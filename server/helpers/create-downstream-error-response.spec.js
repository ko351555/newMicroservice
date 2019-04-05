const { expect } = require('chai');
const createDownstreamErrorResponse = require('./create-downstream-error-response');

describe('helpers/create-downstream-error-response.js', () => {
  it('should delete loopback error context', () => {
    const err = new Error();

    err['error@context'] = 'foo';

    const downstreamError = createDownstreamErrorResponse(err);

    expect(downstreamError['error@context']).to.equal(undefined);
  });

  it('should return an error with the correct status code if one is passed', () => {
    const err = new Error();

    err.statusCode = 400;

    const downstreamError = createDownstreamErrorResponse(err);

    expect(downstreamError.statusCode).to.equal(400);
  });

  it('should return a generic downstream error object', () => {
    const downstreamError = createDownstreamErrorResponse(new Error());

    expect(downstreamError.statusCode).to.equal(500);
    expect(downstreamError.code).to.equal('BOILERPLATE_API_ERR_003');
  });
});
