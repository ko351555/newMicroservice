const { expect } = require('chai');
const errors = require('./errors');

describe('constants/errors.js', () => {
  it('should be an object', () => {
    expect(errors).to.be.an('object');
  });
});
