const localConfig = require('./config');
const path = require('path');
const { Pact, Verifier, Matchers, broker, config } = require('ob-core-pact-node-wrapper');
const supertest = require('supertest');
const server = require('../../server/server');

describe('Enterprise service', () => {
  const consumer = 'ob-core-node-example-microservice';
  const provider = 'enterprise-api';

  before(async () => {
    // create provider

    const relation = new Pact(Object.assign({}, localConfig.provider, {
      consumer,
      provider
    }));

    // setup contract expectation

    await relation.setup()
      .then(() => relation.addInteraction({
        state: 'when enterprise api server is up',
        uponReceiving: 'a request to get user with ID 1',
        withRequest: {
          method: 'GET',
          path: '/users/1'
        },
        willRespondWith: {
          status: 200,
          body: {
            id: Matchers.like(1),
            name: Matchers.like('Leanne Graham'),
            username: Matchers.like('Bret'),
            email: Matchers.like('Sincere@april.biz'),
            address: {
              street: Matchers.like('Kulas Light'),
              suite: Matchers.like('Apt. 556'),
              city: Matchers.like('Gwenborough'),
              zipcode: Matchers.like('92998-3874'),
              geo: {
                lat: Matchers.like('-37.3159'),
                lng: Matchers.like('81.1496')
              }
            },
            phone: Matchers.like('1-770-736-8031 x56442'),
            website: Matchers.like('hildegard.org'),
            company: {
              name: Matchers.like('Romaguera-Crona'),
              catchPhrase: Matchers.like('Multi-layered client-server neural-net'),
              bs: Matchers.like('harness real-time e-markets')
            }
          }
        }
      }))
      .then(() => relation.addInteraction({
        state: 'when enterprise api server is up',
        uponReceiving: 'a request to get todos with user ID 1',
        withRequest: {
          method: 'GET',
          path: '/todos',
          query: {
            userId: '1'
          }
        },
        willRespondWith: {
          status: 200,
          body: Matchers.eachLike({
            userId: Matchers.like(1),
            id: Matchers.like(1),
            title: Matchers.like('delectus aut autem'),
            completed: Matchers.like(false)
          })
        }
      }));

    await supertest(server)
      .get('/node-example-microservice/v1.0/users/1')
      .set('x-lbg-txn-correlation-id', '12345')
      .set('x-lbg-brand', 'LYDS')
      .set('x-lbg-channel', 'RC')
      .send()
      .expect(200);

    // verify contract is met

    await relation.verify();

    // finish up

    await relation.finalize();
  });

  it('should publish the contract successfully', async () => {
    await broker.publishPacts(Object.assign({}, localConfig.broker, {
      pactBroker: config.pactBroker,
      providerBaseUrl: process.env.TODOS_SERVICE_BASE_URL,
      pactFilesOrDirs: [
        path.resolve(process.cwd(), 'tests/contract/pacts', `${consumer}-${provider}.json`)
      ]
    }));
  });

  it('should verify the contract successfully', async () => {
    const verifier = new Verifier();

    await verifier.verifyProvider({
      provider,
      providerBaseUrl: 'https://jsonplaceholder.typicode.com',
      publishVerificationResult: true,
      providerVersion: '3.0',
      pactUrls: [
        path.resolve(process.cwd(), 'tests/contract/pacts', `${consumer}-${provider}.json`)
      ]
    });
  });
});
