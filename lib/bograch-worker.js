'use strict';

function BograchWorker(provider) {
  if (!provider) {
    throw new TypeError('Bograch worker should have a provider');
  }
  
  this._provider = provider;
}

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
  
  this._provider.on(message, cb);
};

module.exports = BograchWorker;