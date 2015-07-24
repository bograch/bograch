'use strict';

var EventEmitter = require('events').EventEmitter;

var methods = {};
var ee = new EventEmitter();

//
// ServerTransport
//
function ServerTransport() {
}

ServerTransport.prototype.start = function(cb) {
  cb();
};

ServerTransport.prototype.on = function(method, cb) {
  methods[method] = cb;
};


//
// ClientTransport
//
function ClientTransport() {
}

ClientTransport.prototype.call = function(method, args, cb) {
  ee.emit('call', method, args, cb);
  if (methods[method]) {
    methods[method](args, cb);
  }
};

ClientTransport.prototype.connect = function(cb) {
  cb();
};

exports.name = 'mock';
exports.ServerTransport = ServerTransport;
exports.ClientTransport = ClientTransport;
exports.ee = ee;
