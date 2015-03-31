'use strict';

var Server = require('../lib/server');
var Client = require('../lib/client');
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
    }).to.throw(TypeError, 'Bograch.on requires a methodName');
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

describe('Bograch client/server communication', function () {
  var boClient = new Client(transporter, {
    name: 'test',
    ttl: 10
  });

  it('should pass all the arguments', function (done) {
    boServer.on('sum', function (a, b, cb) {
      expect(a).to.be.equal(32);
      expect(b).to.be.equal(54);
      expect(typeof cb).to.be.equal('function');
      done();
    });
    boClient.call('sum', 32, 54);
  });

  it('should return error if remote method has an uncaught exception', function (done) {
    boServer.on('exception', function (cb) {
      throw 'foo';
    });
    boClient.call('exception', function (err) {
      expect(err).to.be.equal('foo');
      done();
    });
  });

  it('should return error if remote method timed out', function (done) {
    boServer.on('timeout', function (cb) {
      'I am not calling the callback function. Ever!';
    });
    boClient.call('timeout', function (err) {
      expect(err.type).to.be.equal('responseTimeout');
      done();
    });
  });

  it('should return error if remote method does not exist', function (done) {
    boClient.call('lochNess', function (err) {
      expect(err.type).to.be.equal('invalidMethod');
      done();
    });
  });
});