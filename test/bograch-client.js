'use strict';

var BograchClient = require('../lib/bograch-client');
var expect = require('chai').expect;

var noop = function () {};
var provider = {
  call: noop
};
var boClient = new BograchClient(provider, {
  name: 'test'
});

describe('Bograch client call', function () {
  it('should throw an error if no parameters were passed', function () {
    expect(function () {
      boClient.call();
    }).to.throw(TypeError, 'Bograch.on requires a message');
  });

  it('should throw an error if the third parameter is not a function', function () {
    expect(function () {
      boClient.call('foo', null, 4234);
    }).to.throw(TypeError, 'Bograch.call has an invalid callback function');
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
});