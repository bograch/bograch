'use strict';

var Client = require('./client');
var Server = require('./server');

function Bograch() {
  this._transporters = {};
}

Bograch.prototype.use = function (name, transporter) {
  if (!transporter) {
    transporter = name;
    if (!transporter) {
      throw new Error('Bograch use must receive a transporter');
    }
    name = transporter.name;
  }
  if (!name) { throw new Error('Bograch transporters must have a name'); }
  
  this._transporters[name] = transporter;
  
  this[name + 'Client'] = function (options, cb) {
    return this.client(name, options, cb);
  };
  
  this[name + 'Server'] = function (options) {
    return this.server(name, options);
  };
  
  return this;
};

Bograch.prototype.client = function (name, options, cb) {
  if (!name || typeof name !== 'string') {
    throw new TypeError('Can\'t get a Bograch client w/o a name');
  }
  if (!this._transporters[name]) {
    throw new Error('No transporter with the specified name has been found');
  }
  var clientTransporter = new this._transporters[name].ClientTransporter(options);
  var client = new Client(clientTransporter, options, cb);
  return client;
};

Bograch.prototype.server = function (name, options) {
  if (!name || typeof name !== 'string') {
    throw new TypeError('Can\'t get a Bograch server w/o a name');
  }
  if (!this._transporters[name]) {
    throw new Error('No transporter with the specified name has been found');
  }
  var serverTransporter = new this._transporters[name].ServerTransporter(options);
  var server = new Server(serverTransporter, options);
  return server;
};

module.exports = Bograch;