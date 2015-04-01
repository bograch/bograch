'use strict';

var EventEmitter = require('events').EventEmitter;

var methods = {};
var ee = new EventEmitter();

//
// ServerTransporter
//
function ServerTransporter() {
}

ServerTransporter.prototype.start = function (cb) {
  cb();
};

ServerTransporter.prototype.on = function (method, cb) {
  methods[method] = cb;
};


//
// ClientTransporter
//
function ClientTransporter() {
}

ClientTransporter.prototype.call = function (method, args, cb) {
  ee.emit('call', method, args, cb);
  if (methods[method]) {
    methods[method](args, cb);
  }
};

ClientTransporter.prototype.connect = function (cb) {
  cb();
};

exports.name = 'mock';
exports.ServerTransporter = ServerTransporter;
exports.ClientTransporter = ClientTransporter;
exports.ee = ee;