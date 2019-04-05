const { expect } = require('chai');
const getRootContext = require('./get-root-context');

describe('helpers/get-root-context.js', () => {
  it('returns when provided config file is not passed', () => {
    const contextRoot = getRootContext();

    expect(contextRoot).to.equal('/node-example-microservice/v1.0');
  });

  it('returns when provided config file does not exist', () => {
    const contextRoot = getRootContext('invalidFile.json');

    expect(contextRoot).to.equal('/node-example-microservice/v1.0');
  });

  it('when provided config file exists', () => {
    const contextRoot = getRootContext('urbanCode/server.json');

    expect(contextRoot).to.equal('/node-example-microservice/v1.0');
  });
});
