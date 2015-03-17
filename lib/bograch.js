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
  
  this[name + 'Client'] = function (options) {
    var client = new Client(transporter, options);
    return client;
  };
  
  this[name + 'Worker'] = function (options) {
    var worker = new Server(transporter, options);
    return worker;
  };
  
  return this;
};

Bograch.prototype.client = function (name, options) {
  if (!name || typeof name !== 'string') {
    throw new TypeError('Can\'t get a Bograch client w/o a name');
  }
  if (!this._transporters[name]) {
    throw new Error('No transporter with the specified name has been found');
  }
  var client = new Client(this._transporters[name], options);
  return client;
};

Bograch.prototype.server = function (name, options) {
  if (!name || typeof name !== 'string') {
    throw new TypeError('Can\'t get a Bograch server w/o a name');
  }
  if (!this._transporters[name]) {
    throw new Error('No transporter with the specified name has been found');
  }
  var worker = new Server(this._transporters[name], options);
  return worker;
};

module.exports = new Bograch();