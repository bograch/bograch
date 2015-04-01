'use strict';

var bo = require('../lib');
var expect = require('chai').expect;
var transporterMock = require('./transporter-mock');

describe('Bograch use', function () {
  it('should return an error if nothing was passed', function () {
    expect(function () {
      bo.use();
    }).to.throw(Error, 'Bograch use must receive a transporter');
  });

  it('should return an error if no transporter with name was passed', function () {
    expect(function () {
      bo.use('foo');
    }).to.throw(Error, 'Bograch transporters must have a name');
  });

  it('should not return error if passed transporter with name', function () {
    var transporter = {
      name: 'foo'
    };
    expect(function () {
      bo.use(transporter);
    }).not.to.throw(Error);
  });

  it('should not return error if passed transporter name and transporter with name', function () {
    var transporter = {
      name: 'foo'
    };
    expect(function () {
      bo.use('bar', transporter);
    }).not.to.throw(Error);
  });
});

describe('Bograch client', function () {
  before(function () {
    bo._transporters = {};
  });

  it('should throw error if no transporter name was passed', function () {
    expect(function () {
      bo.client();
    }).to.throw(TypeError, 'Can\'t get a Bograch client w/o a name');
  });

  it('should throw error if no transporter with the passed name was found', function () {
    expect(function () {
      bo.client('foo', { name: 'test' });
    }).to.throw(Error, 'No transporter with the specified name has been found');
  });

  it('should return client if transporter is found', function () {
    bo.use('foo', transporterMock);
    expect(bo.client('foo', { name: 'test' })).not.to.be.a('null');
  });
});

describe('Bograch server', function () {
  before(function () {
    bo._transporters = {};
  });

  it('should throw error if no transporter name was passed', function () {
    expect(function () {
      bo.server();
    }).to.throw(TypeError, 'Can\'t get a Bograch server w/o a name');
  });

  it('should throw error if no transporter with the passed name was found', function () {
    expect(function () {
      bo.server('foo', { name: 'test' });
    }).to.throw(Error, 'No transporter with the specified name has been found');
  });

  it('should return server if transporter is found', function () {
    bo.use('foo', transporterMock);
    expect(bo.server('foo', { name: 'test' })).not.to.be.a('null');
  });
});