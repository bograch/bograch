'use strict';

var bo = require('../lib');
var expect = require('chai').expect;

describe('Bograch use', function () {
  it('should return an error if nothing was passed', function () {
    expect(function () {
      bo.use();
    }).to.throw(Error, 'Bograch use must receive a provider');
  });

  it('should return an error if no provider with name was passed', function () {
    expect(function () {
      bo.use('foo');
    }).to.throw(Error, 'Bograch providers must have a name');
  });

  it('should not return error if passed provider with name', function () {
    var provider = {
      name: 'foo'
    };
    expect(function () {
      bo.use(provider);
    }).not.to.throw(Error);
  });

  it('should not return error if passed provider name and provider with name', function () {
    var provider = {
      name: 'foo'
    };
    expect(function () {
      bo.use('bar', provider);
    }).not.to.throw(Error);
  });
});

describe('Bograch client', function () {
  before(function () {
    bo._providers = {};
  });

  it('should thrown error if no provider name was passed', function () {
    expect(function () {
      bo.client();
    }).to.throw(TypeError, 'Can\'t get a Bograch client w/o a name');
  });

  it('should throw error if no provider with the passed name was found', function () {
    expect(function () {
      bo.client('foo', { name: 'test' });
    }).to.throw(Error, 'No provider with the specified name has been found');
  });

  it('should return client if provider is found', function () {
    bo.use('foo', {
      name: 'foo'
    });
    expect(bo.client('foo', { name: 'test' })).not.to.be.a('null');
  });
});

describe('Bograch worker', function () {
  before(function () {
    bo._providers = {};
  });

  it('should thrown error if no provider name was passed', function () {
    expect(function () {
      bo.worker();
    }).to.throw(TypeError, 'Can\'t get a Bograch worker w/o a name');
  });

  it('should throw error if no provider with the passed name was found', function () {
    expect(function () {
      bo.worker('foo', { name: 'test' });
    }).to.throw(Error, 'No provider with the specified name has been found');
  });

  it('should return worker if provider is found', function () {
    bo.use('foo', {
      name: 'foo',
      on: function () {}
    });
    expect(bo.worker('foo', { name: 'test' })).not.to.be.a('null');
  });
});