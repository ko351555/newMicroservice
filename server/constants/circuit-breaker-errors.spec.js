const { expect } = require('chai');
const circuitBreakerErrors = require('./circuit-breaker-errors');

describe('constants/circuit-breaker-errors.js', () => {
  it('should be an object', () => {
    expect(circuitBreakerErrors).to.be.an('object');
  });
});
