'use strict';

var Client = require('../lib/client');
var expect = require('chai').expect;
var TransporterMock = require('./transporter-mock');
var bo = require('../lib');

var noop = function () {};
var transporter = new TransporterMock();
var boClient = new Client(transporter, {
  name: 'test'
});

describe('Bograch client', function () {
  describe('call', function () {
    it('should throw an error if no parameters were passed', function () {
      expect(function () {
        boClient.call();
      }).to.throw(TypeError, 'Bograch.on requires a methodName');
    });

    it('should not throw an error if the third parameter is not a function', function () {
      expect(function () {
        boClient.call('foo', null, 4234);
      }).not.to.throw(Error);
    });

    it('should not throw an exception if the second parameter is a callback function', function () {
      expect(function () {
        boClient.call('foo', noop);
      }).not.to.throw(Error);
    });

    it('should not throw an exception if the third parameter is a callback function', function () {
      expect(function () {
        boClient.call('foo', {
          a: 34
        }, noop);
      }).not.to.throw(Error);
    });
    
    it('should not throw an exception if no callback function passed', function () {
      expect(function () {
        boClient.call('foo', {
          a: 34
        });
      }).not.to.throw(Error);
    });
  });
  
  describe('register', function () {
    it('should register one method', function () {
      boClient.register('foo1');
      expect(typeof boClient.methods.foo1).to.be.equal('function');
    });
    
    it('should register several methods', function () {
      boClient.register(['foo2', 'foo3']);
      expect(typeof boClient.methods.foo2).to.be.equal('function');
      expect(typeof boClient.methods.foo3).to.be.equal('function');
    });
  });
  
  describe('proxy', function () {
    it('returned by the server', function (done) {
      bo.use(transporter);
      var server = bo.server('mock', {
        name: 'proxy'
      });
      server.addMethods({
        bar: function () {},
        baz: function () {},
        qux: function () {}
      });
      
      bo.client('mock', {name: 'proxy'}, function (err, client) {
        expect(typeof client.methods.bar).to.be.equal('function');
        expect(typeof client.methods.baz).to.be.equal('function');
        expect(typeof client.methods.qux).to.be.equal('function');
        done();
      });
    });
  });
});