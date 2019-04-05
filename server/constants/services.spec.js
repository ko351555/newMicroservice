const { expect } = require('chai');
const services = require('./services');

describe('constants/services.js', () => {
  it('should be an object', () => {
    expect(services).to.be.an('object');
  });
});
