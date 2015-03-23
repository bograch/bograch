'use strict';

var createPublicMethodName = require('./create-method-name');

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
  this.methods = {};

  cb = cb || function () {};

  this.call('methodList', function (err, methods) {
    if (err) {
      return cb(err);
    }
    
    this.register(methods);
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
  var cb;
  
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
  
  if (methodName == 'methodList') {
    console.log('---||---');
    console.log(arguments);
    console.log(args);
    console.log(cb);
  }

  var publicMethodName = createPublicMethodName(this._name, methodName);
  this._transporter.call(publicMethodName, args, cb);
};

Client.prototype.register = function (methods) {
  if (!(methods instanceof Array)) {
    methods = [methods];
  }
  methods.forEach(function (method) {
    if (typeof this.methods[method] === 'undefined') {
      this.methods[method] = function () {
        var args = [method].concat(arguments);
        this.call.apply(this, args);
      }.bind(this);
    }
  }.bind(this));
};

module.exports = Client;