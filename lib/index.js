'use strict';

var Bograch = require('./bograch');

/**
 * Export default singleton.
 *
 * @api public
 */
exports = module.exports = new Bograch();

/**
 * Expose constructors.
 */
exports.ServerError = require('./server-error');