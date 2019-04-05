const supertest = require('supertest');
const server = require('../../server/server');
const { expect } = require('chai');
const expectedResponse = require('./data/response-body/user-get.json');
const expectedError = require('./data/response-body/user-get-error.json');

describe('GET /users/:userId', () => {
  it('should return 400 for invalid request', (done) => {
    supertest(server)
      .get('/node-example-microservice/v1.0/users/1')
      .expect(400)
      .end((error) => {
        expect(error).to.be.an('null');

        return done();
      });
  });

  it('should return the correct response if downstream system returns response', (done) => {
    supertest(server)
      .get('/node-example-microservice/v1.0/users/1')
      .set('x-lbg-txn-correlation-id', '12345')
      .set('x-lbg-brand', 'LYDS')
      .set('x-lbg-channel', 'RC')
      .expect(200)
      .end((error, response) => {
        expect(error).to.be.an('null');

        expect(response.body).to.deep.equal(expectedResponse);

        return done();
      });
  });

  it('should return the correct response if downstream system returns error', (done) => {
    supertest(server)
      .get('/node-example-microservice/v1.0/users/2')
      .set('x-lbg-txn-correlation-id', '12345')
      .set('x-lbg-brand', 'LYDS')
      .set('x-lbg-channel', 'RC')
      .expect(400)
      .end((error, response) => {
        expect(error).to.be.an('null');

        expect(response.body).to.deep.equal(expectedError);

        return done();
      });
  });
});
