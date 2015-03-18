'use strict';

var createMethodName = require('./create-method-name');

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

Client.prototype.call = function (message, params, cb) {
  if (!message) {
    throw new TypeError('Bograch.on requires a message');
  }
  if (typeof message !== 'string') {
    throw new TypeError('Bograch.on requires a message of string type');
  }

  if (typeof params === 'function') {
    cb = params;
    params = null;
  } else if (cb !== null && typeof cb !== 'function') {
    throw new TypeError('Bograch.call has an invalid callback function');
  }

  var methodName = createMethodName(this._name, message);
  this._transporter.call(methodName, params, cb);
};

Client.prototype.register = function (methods) {
  if (!(methods instanceof Array)) {
    methods = [methods];
  }
  methods.forEach(function (method) {
    if (typeof this.methods[method] === 'undefined') {
      this.methods[method] = function (params, cb) {
        this.call(method, params, cb);
      }.bind(this);
    }
  }.bind(this));
};

module.exports = Client;