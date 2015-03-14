'use strict';

var BograchClient = require('./bograch-client');
var BograchWorker = require('./bograch-worker');

function Bograch() {
  this._providers = {};
}

Bograch.prototype.use = function (name, provider) {
  if (!provider) {
    provider = name;
    if (!provider) {
      throw new Error('Bograch use must receive a provider');
    }
    name = provider.name;
  }
  if (!name) { throw new Error('Bograch providers must have a name'); }
  
  this._providers[name] = provider;
  return this;
};

Bograch.prototype.client = function (name) {
  if (!name || typeof name !== 'string') {
    throw new TypeError('Can\'t get a Bograch client w/o a name');
  }
  if (!this._providers[name]) {
    throw new Error('No provider with the specified name has been found');
  }
  var client = new BograchClient(this._providers[name]);
  return client;
};

Bograch.prototype.worker = function (name) {
  if (!name || typeof name !== 'string') {
    throw new TypeError('Can\'t get a Bograch worker w/o a name');
  }
  if (!this._providers[name]) {
    throw new Error('No provider with the specified name has been found');
  }
  var worker = new BograchWorker(this._providers[name]);
  return worker;
};

module.exports = new Bograch();