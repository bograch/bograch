'use strict';

var createMethodName = require('./create-method-name');

function BograchWorker(provider, options) {
  if (!provider) {
    throw new TypeError('Bograch worker should have a provider');
  }
  
  options = options || {};
  if (!options.name) {
    throw new TypeError('Service name is missing');
  }
  
  this._provider = provider;
  this._name = options.name;
  this._methods = [];
  
  this._init();
}

BograchWorker.prototype._init = function () {
  var methodName = createMethodName(this._name, 'methodList');
  this._provider.on(methodName, function (params, cb) {
    cb(null, this._methods);
  });
};

BograchWorker.prototype.on = function (message, cb) {
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
  this._provider.on(methodName, cb);
};

module.exports = BograchWorker;