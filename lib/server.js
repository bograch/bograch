'use strict';

var createPublicMethodName = require('./create-method-name');
var debug = require('debug')('bograch');

function Server(transport, options) {
  if (!transport) {
    throw new TypeError('Bograch worker should have a transport');
  }
  
  options = options || {};
  if (!options.name) {
    throw new TypeError('Service name is missing');
  }
  
  this._transport = transport;
  this._name = options.name;
  this._methods = [];
  this._isUp = false;
  this.exports = {};
  
  this._init();
}

Server.prototype._init = function () {
  var methodName = createPublicMethodName(this._name, 'methodList');
  this._transport.on(methodName, function (args, cb) {
    cb(null, this._methods);
  }.bind(this));
};

Server.prototype.addMethod = function (methodName, method) {
  if (!methodName) {
    throw new TypeError('Bograch.addMethod requires a methodName');
  }
  if (typeof methodName !== 'string') {
    throw new TypeError('Bograch.addMethod requires a methodName of string type');
  }
  if (method === null || typeof method !== 'function') {
    throw new TypeError('Bograch.addMethod requires a callback function');
  }
  
  this._methods.push(methodName);
  var publicMethodName = createPublicMethodName(this._name, methodName);
  this._transport.on(publicMethodName, function (args, cb) {
    args.push(cb || function () {});
    
    debug('executing %s with arguments %j', publicMethodName, args);
    
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
    this.addMethod(methodName, scope[methodName]);
  }
};

Server.prototype.start = function (cb) {
  cb = cb || function () {};
  if (!this._isUp) {
    this.addMethods(this.exports);
    this._transport.start(function (err) {
      if (!err) {
        debug('started transport for %s server', this._name);
        this._isUp = true;
      }
      cb(err);
    }.bind(this));
  }
};

Server.prototype.end = function (cb) {
  cb = cb || function () {};
  if (this._isUp) {
    this._transport.stop(function (err) {
      if (!err) {
        this._isUp = false;
      }
      cb(err);
    }.bind(this));
  }
};

module.exports = Server;