'use strict';

function BograchClient(provider) {
  if (!provider) {
    throw new TypeError('Bograch client should have a provider');
  }
  
  this._provider = provider;
}

BograchClient.prototype.call = function (message, params, cb) {
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
  
  this._provider.call(message, params, cb);
};

module.exports = BograchClient;