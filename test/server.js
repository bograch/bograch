'use strict';

var Server = require('../lib/server');
var expect = require('chai').expect;
var TransporterMock = require('./transporter-mock');

var noop = function () {};
var transporter = new TransporterMock();
var boServer = new Server(transporter, {
  name: 'test'
});

describe('Bograch server on', function () {
  it('should throw an error if no parameters were passed', function () {
    expect(function () {
      boServer.on();
    }).to.throw(TypeError, 'Bograch.on requires a message');
  });
  
  it('should throw an error if no callback function is passed', function () {
    expect(function () {
      boServer.on('foo');
    }).to.throw(TypeError, 'Bograch.on requires a callback function');
  });
  
  it('should throw an error if invalid callback function is passed', function () {
    expect(function () {
      boServer.on('foo', 234);
    }).to.throw(TypeError, 'Bograch.on requires a callback function');
  });
  
  it('should not throw an exception if the second parameter is a callback function', function () {
    expect(function () {
      boServer.on('foo', noop);
    }).not.to.throw(Error);
  });
});