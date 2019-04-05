const { mockServerClient } = require('mockserver-client');
const config = require('./config');

const client = mockServerClient(config.hostname, config.port);

const todoUserIdStub = require('./stubs/todo/userId.json');
const todoUserIdErrorStub = require('./stubs/todo/userId-error.json');
const todoListStub = require('./stubs/todo/list.json');
const todoListErrorStub = require('./stubs/todo/list-error.json');

const userIdStub = require('./stubs/user/id.json');
const userIdErrorStub = require('./stubs/user/id-error.json');
const userListStub = require('./stubs/user/list.json');
const userListErrorStub = require('./stubs/user/list-error.json');
const lukeId = require('./stubs/user/luke.json');


const stubs = [
  todoUserIdStub,
  todoUserIdErrorStub,
  todoListStub,
  todoListErrorStub,


  userIdStub,
  userIdErrorStub,
  userListStub,
  userListErrorStub,
  lukeId
];

client.setDefaultHeaders({});

const stubsToP = stubs => {
  return stubs.map(stub => {
    const httpRequest = {
      method: stub.request.method,
      path: stub.request.path,
      body: stub.request.body
    };

    if (stub.request.headers) {
      httpRequest.headers = Object.keys(stub.request.headers).map((name) => ({
        name,
        values: [stub.request.headers[name]]
      }));
    }

    if (stub.request.query) {
      httpRequest.queryStringParameters = Object.keys(stub.request.query).map((name) => ({
        name,
        values: [stub.request.query[name]]
      }));
    }

    const httpResponse = {
      statusCode: stub.response.statusCode,
      body: typeof stub.response.body === 'object' ? JSON.stringify(stub.response.body) : stub.response.body
    };

    if (stub.response.headers) {
      httpResponse.headers = Object.keys(stub.response.headers).map((name) => ({
        name,
        values: [stub.response.headers[name]]
      }));
    }

    return client.mockAnyResponse({
      httpRequest,
      httpResponse,
      times: {
        unlimited: true
      }
    })
      .then(() => {
        console.log(`Stub ${httpRequest.method} ${httpRequest.path} created`);
      });
  });
};

const handleError = err => {
  console.error(err);
  process.exit(1);
};

client.reset()
  .then(() => Promise.all(stubsToP(stubs)))
  .catch(handleError);
