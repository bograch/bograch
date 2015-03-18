'use strict';

var createMethodName = require('./create-method-name');

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
  var methodName = createMethodName(this._name, 'methodList');
  this._transporter.on(methodName, function (params, cb) {
    cb(null, this._methods);
  }.bind(this));
};

Server.prototype.on = function (message, cb) {
  if (!message) {
    throw new TypeError('Bograch.on requires a message');
  }
  if (typeof message !== 'string') {
    throw new TypeError('Bograch.on requires a message of string type');
  }
  if (cb === null || typeof cb !== 'function') {
    throw new TypeError('Bograch.on requires a callback function');
  }
  
  this._methods.push(message);
  var methodName = createMethodName(this._name, message);
  this._transporter.on(methodName, cb);
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