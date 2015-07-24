'use strict';

var createPublicMethodName = require('./create-method-name');
var ServerError = require('./server-error');
var debug = require('debug')('bograch');

var DEFAULT_TTL = 5 * 1000; // 5 sec.

function Client(transport, opts, cb) {
  if (!transport) {
    throw new TypeError('Bograch client should have a transport');
  }

  opts = opts || {};
  if (!opts.name) {
    throw new TypeError('Service name is missing');
  }

  this._transport = transport;
  this._name = opts.name;
  this._ttl = opts.ttl || DEFAULT_TTL;

  /* Successfully handshaked with the server. */
  this._isConnected = false;
  this.methods = {};
  this._existingMethods = [];

  cb = cb || function () {};

  transport.connect(function () {
    debug('connected transport for %s client', this._name);
    this.call('methodList', function (err, methods) {
      if (err) {
        return cb(err);
      }

      this._existingMethods = methods;
      this.register(methods);
      this._isConnected = true;
      return cb(null, this);
    }.bind(this));
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
Client.prototype.call = function(methodName) {
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
    debug('nonexistend method called - %s in client %s', methodName, this._name);
    var err = new ServerError('invalidMethod', 'Remote method `' + methodName + '` does not exist');
    if (cb) {
      return cb(err);
    }
    throw err;
  }

  publicMethodName = createPublicMethodName(this._name, methodName);

  if (cb) {
    timeoutId = setTimeout(function() {
      killed = true;
      debug('resonse timed out for method %s', publicMethodName);
      cb(new ServerError('responseTimeout',
        'Method execution exceeded the time limit of `' + this._ttl + '`'));
    }.bind(this), this._ttl);
  }

  debug('calling %s with args %j', publicMethodName, args);
  this._transport.call(publicMethodName, args, function() {
    if (!killed && cb) {
      clearTimeout(timeoutId);
    var responseArgs = Array.prototype.slice.call(arguments);
    debug('got response from %s. Args: %j', publicMethodName, responseArgs);
      cb.apply({}, responseArgs);
    }
  });
};

Client.prototype.register = function(methods) {
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

Client.prototype.connect = function() {
  this._transport.connect(function() {});
};

module.exports = Client;
