'use strict';

function Transporter() {
  this.name = 'mock';
  this._methods = {};
}

Transporter.prototype.on = function (method, cb) {
  this._methods[method] = cb;
};

Transporter.prototype.call = function (method, params, cb) {
  if (this._methods[method]) {
    this._methods[method](params, cb);
  }
};

module.exports = Transporter;