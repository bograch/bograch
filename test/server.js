'use strict';

var Server = require('../lib/server');
var Client = require('../lib/client');
var expect = require('chai').expect;
var ServerTransporter = require('./transporter-mock').ServerTransporter;
var ClientTransporter = require('./transporter-mock').ClientTransporter;

var noop = function () {};
var serverTransporter = new ServerTransporter();
var boServer = new Server(serverTransporter, {
  name: 'test'
});

describe('Bograch server addMethod', function () {
  it('should throw an error if no parameters were passed', function () {
    expect(function () {
      boServer.addMethod();
    }).to.throw(TypeError, 'Bograch.addMethod requires a methodName');
  });

  it('should throw an error if no callback function is passed', function () {
    expect(function () {
      boServer.addMethod('foo');
    }).to.throw(TypeError, 'Bograch.addMethod requires a callback function');
  });

  it('should throw an error if invalid callback function is passed', function () {
    expect(function () {
      boServer.addMethod('foo', 234);
    }).to.throw(TypeError, 'Bograch.addMethod requires a callback function');
  });

  it('should not throw an exception if the second parameter is a callback function', function () {
    expect(function () {
      boServer.addMethod('foo', noop);
    }).not.to.throw(Error);
  });
});

describe('Bograch client/server communication', function () {
  var boClient = new Client(new ClientTransporter(), {
    name: 'test',
    ttl: 10
  });

  it('should pass all the arguments', function (done) {
    boServer.addMethod('sum', function (a, b, cb) {
      expect(a).to.be.equal(32);
      expect(b).to.be.equal(54);
      expect(typeof cb).to.be.equal('function');
      done();
    });
    boClient.call('sum', 32, 54);
  });

  it('should return error if remote method has an uncaught exception', function (done) {
    boServer.addMethod('exception', function (cb) {
      throw 'foo';
    });
    boClient.call('exception', function (err) {
      expect(err).to.be.equal('foo');
      done();
    });
  });

  it('should return error if remote method timed out', function (done) {
    boServer.addMethod('timeout', function (cb) {
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