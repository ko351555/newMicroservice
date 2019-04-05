const { expect } = require('chai');
const messages = require('./messages');

describe('constants/messages.js', () => {
  it('should be an object', () => {
    expect(messages).to.be.an('object');
  });
});
