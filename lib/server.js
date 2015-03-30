'use strict';

var createPublicMethodName = require('./create-method-name');

function Server(transporter, options) {
  if (!transporter) {
    throw new TypeError('Bograch worker should have a transporter');
  }
  
  options = options || {};
  if (!options.name) {
    throw new TypeError('Service name is missing');
  }
  
  this._transporter = transporter;
  this._name = options.name;
  this._methods = [];
  
  this._init();
}

Server.prototype._init = function () {
  var methodName = createPublicMethodName(this._name, 'methodList');
  this._transporter.on(methodName, function (args, cb) {
    cb(null, this._methods);
  }.bind(this));
};

Server.prototype.on = function (methodName, method) {
  if (!methodName) {
    throw new TypeError('Bograch.on requires a methodName');
  }
  if (typeof methodName !== 'string') {
    throw new TypeError('Bograch.on requires a methodName of string type');
  }
  if (method === null || typeof method !== 'function') {
    throw new TypeError('Bograch.on requires a callback function');
  }
  
  this._methods.push(methodName);
  var publicMethodName = createPublicMethodName(this._name, methodName);
  this._transporter.on(publicMethodName, function (args, cb) {
    args.push(cb || function () {});
    
    try {
      method.apply({}, args);
    } catch (err) {
      cb(err);
    }
  });
};

Server.prototype.addMethods = function (scope) {
  if (typeof scope !== 'object') {
    throw new Error('scope should be an object');
  }
  
  for (var methodName in scope) {
    this.on(methodName, scope[methodName]);
  }
};

module.exports = Server;