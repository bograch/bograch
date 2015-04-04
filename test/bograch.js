'use strict';

var bo = require('../lib');
var expect = require('chai').expect;
var transportMock = require('./transport-mock');

describe('Bograch use', function () {
  it('should return an error if nothing was passed', function () {
    expect(function () {
      bo.use();
    }).to.throw(Error, 'Bograch use must receive a transport');
  });

  it('should return an error if no transport with name was passed', function () {
    expect(function () {
      bo.use('foo');
    }).to.throw(Error, 'Bograch transports must have a name');
  });

  it('should not return error if passed transport with name', function () {
    var transport = {
      name: 'foo'
    };
    expect(function () {
      bo.use(transport);
    }).not.to.throw(Error);
  });

  it('should not return error if passed transport name and transport with name', function () {
    var transport = {
      name: 'foo'
    };
    expect(function () {
      bo.use('bar', transport);
    }).not.to.throw(Error);
  });
});

describe('Bograch client', function () {
  before(function () {
    bo._transports = {};
  });

  it('should throw error if no transport name was passed', function () {
    expect(function () {
      bo.client();
    }).to.throw(TypeError, 'Can\'t get a Bograch client w/o a name');
  });

  it('should throw error if no transport with the passed name was found', function () {
    expect(function () {
      bo.client('foo', { name: 'test' });
    }).to.throw(Error, 'No transport with the specified name has been found');
  });

  it('should return client if transport is found', function () {
    bo.use('foo', transportMock);
    expect(bo.client('foo', { name: 'test' })).not.to.be.a('null');
  });
});

describe('Bograch server', function () {
  before(function () {
    bo._transports = {};
  });

  it('should throw error if no transport name was passed', function () {
    expect(function () {
      bo.server();
    }).to.throw(TypeError, 'Can\'t get a Bograch server w/o a name');
  });

  it('should throw error if no transport with the passed name was found', function () {
    expect(function () {
      bo.server('foo', { name: 'test' });
    }).to.throw(Error, 'No transport with the specified name has been found');
  });

  it('should return server if transport is found', function () {
    bo.use('foo', transportMock);
    expect(bo.server('foo', { name: 'test' })).not.to.be.a('null');
  });
});