'use strict';

var Client = require('./client');
var Server = require('./server');

function Bograch() {
  this._transports = {};
}

Bograch.prototype.use = function(name, transport) {
  if (!transport) {
    transport = name;
    if (!transport) {
      throw new Error('Bograch use must receive a transport');
    }
    name = transport.name;
  }
  if (!name) {
    throw new Error('Bograch transports must have a name');
  }

  this._transports[name] = transport;

  this[name + 'Client'] = function(options, cb) {
    return this.client(name, options, cb);
  };

  this[name + 'Server'] = function(options) {
    return this.server(name, options);
  };

  return this;
};

Bograch.prototype.client = function(name, options, cb) {
  if (!name || typeof name !== 'string') {
    throw new TypeError('Can\'t get a Bograch client w/o a name');
  }
  if (!this._transports[name]) {
    throw new Error('No transport with the specified name has been found');
  }
  var clientTransport = new this._transports[name].ClientTransport(options);
  var client = new Client(clientTransport, options, cb);
  return client;
};

Bograch.prototype.server = function(name, options) {
  if (!name || typeof name !== 'string') {
    throw new TypeError('Can\'t get a Bograch server w/o a name');
  }
  if (!this._transports[name]) {
    throw new Error('No transport with the specified name has been found');
  }
  var serverTransport = new this._transports[name].ServerTransport(options);
  var server = new Server(serverTransport, options);
  return server;
};

module.exports = Bograch;
