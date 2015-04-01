'use strict';

var createPublicMethodName = require('./create-method-name');
var ServerError = require('./server-error');

var DEFAULT_TTL = 5 * 1000; // 5 sec.

function Client(transporter, options, cb) {
  if (!transporter) {
    throw new TypeError('Bograch client should have a transporter');
  }

  options = options || {};
  if (!options.name) {
    throw new TypeError('Service name is missing');
  }

  this._transporter = transporter;
  this._name = options.name;
  this._ttl = options.ttl || DEFAULT_TTL;

  // Successfully handshaked with the server.
  this._isConnected = false;
  this.methods = {};
  this._existingMethods = [];

  cb = cb || function () {};

  this.call('methodList', function (err, methods) {
    if (err) {
      return cb(err);
    }

    this._existingMethods = methods;
    this.register(methods);
    this._isConnected = true;
    return cb(null, this);
  }.bind(this));
}

/**
 * @callback requestCallback
 * @param {Error} error - The error that happened during executing
 *   the remote method.
 * @param {..*} resonseData - The data returned by the remote method.
 */
/**
 * Call a remote method.
 * @param {string} methodName - The name of the method to be called.
 * @param {...*} arguments - The arguments to be passed to the method.
 * @param {requestCallback} [cb] - The callback that handles the response.
 */
Client.prototype.call = function () {
  var methodName = arguments[0];
  var args = [];
  var i = 0;
  var killed = false;
  var cb, publicMethodName, timeoutId;

  if (!methodName) {
    throw new TypeError('Bograch.on requires a methodName');
  }
  if (typeof methodName !== 'string') {
    throw new TypeError('Bograch.on requires a methodName of string type');
  }

  while (typeof arguments[++i] !== 'function' && i < arguments.length) {
    args.push(arguments[i]);
  }

  if (typeof arguments[i] === 'function') {
    cb = arguments[i];
  }

  if (this._isConnected && this._existingMethods.indexOf(methodName) === -1) {
    var err = new ServerError('invalidMethod', 'Remote method `' + methodName + '` does not exist');
    if (cb) {
      return cb(err);
    }
    throw err;
  }

  publicMethodName = createPublicMethodName(this._name, methodName);

  if (cb) {
    timeoutId = setTimeout(function () {
      killed = true;
      cb(new ServerError('responseTimeout',
        'Method execution exceeded the time limit of `' + this._ttl + '`'));
    }.bind(this), this._ttl);
  }

  this._transporter.call(publicMethodName, args, function () {
    if (!killed && cb) {
      clearTimeout(timeoutId);
      cb.apply({}, arguments);
    }
  });
};

Client.prototype.register = function (methods) {
  if (!(methods instanceof Array)) {
    methods = [methods];
  }
  methods.forEach(function (method) {
    if (typeof this.methods[method] === 'undefined') {
      this.methods[method] = function () {
        var args = [method].concat(Array.prototype.slice.call(arguments));
        this.call.apply(this, args);
      }.bind(this);
    }
  }.bind(this));
};

module.exports = Client;