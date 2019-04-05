const sinon = require('sinon');
const userModel = require('./user');
const userService = require('../services/user');
const todoService = require('../services/todo');
const { expect } = require('chai');

describe('models/user.js', () => {
  let model;

  beforeEach(() => {
    model = {
      app: {
        models: {
          Todo: {

          }
        }
      }
    };

    userModel(model);
  });

  it('should bind the correct methods', () => {
    expect(typeof model.list).to.equal('function');
    expect(typeof model.get).to.equal('function');
  });

  it('list should return the correct response', async () => {
    const users = [
      {
        id: 1,
        name: 'Ed'
      },
      {
        id: 2,
        name: 'Lokesh'
      }
    ];

    sinon.stub(userService, 'list')
      .callsFake(() => users);

    const todos = [
      {
        userId: 1,
        text: 'Write my mocks',
        completed: false
      },
      {
        userId: 2,
        text: 'Write my comments',
        completed: false
      }
    ];

    sinon.stub(todoService, 'list')
      .callsFake(() => todos);

    const output = await model.list('RC', 'LYDS', '12345');

    expect(output).to.deep.equal([
      {
        id: 1,
        name: 'Ed',
        todos: [
          {
            userId: 1,
            text: 'Write my mocks',
            completed: false
          }
        ]
      },
      {
        id: 2,
        name: 'Lokesh',
        todos: [
          {
            userId: 2,
            text: 'Write my comments',
            completed: false
          }
        ]
      }
    ]);

    userService.list.restore();
    todoService.list.restore();
  });

  it('list should return the correct error when there is a downstream error', async () => {
    sinon.stub(userService, 'list')
      .callsFake(() => Promise.reject(new Error('Downstream API failed')));

    const todos = [
      {
        userId: 1,
        text: 'Write my mocks',
        completed: false
      },
      {
        userId: 2,
        text: 'Write my comments',
        completed: false
      }
    ];

    sinon.stub(todoService, 'list')
      .callsFake(() => todos);

    try {
      await model.list('RC', 'LYDS', '12345');
    } catch (e) {
      expect(e.statusCode).to.equal(500);
      expect(e.code).to.equal('BOILERPLATE_API_ERR_003');
      expect(e.message).to.equal('Downstream API failed');
    }

    userService.list.restore();
    todoService.list.restore();
  });

  it('get should return the correct response', async () => {
    const user = {
      id: 1,
      name: 'Ed'
    };

    sinon.stub(userService, 'get')
      .callsFake(() => user);

    const todos = [
      {
        userId: 1,
        text: 'Write my mocks',
        completed: false
      },
      {
        userId: 1,
        text: 'Write my comments',
        completed: false
      }
    ];

    sinon.stub(todoService, 'list')
      .callsFake(() => todos);

    const output = await model.get(1, 'RC', 'LYDS', '12345');

    expect(output).to.deep.equal({
      id: 1,
      name: 'Ed',
      todos: [
        {
          userId: 1,
          text: 'Write my mocks',
          completed: false
        },
        {
          userId: 1,
          text: 'Write my comments',
          completed: false
        }
      ]
    });

    userService.get.restore();
    todoService.list.restore();
  });

  it('get should return the correct error when there is a downstream error', async () => {
    const user = {
      id: 1,
      name: 'Ed'
    };

    sinon.stub(userService, 'get')
      .callsFake(() => user);

    sinon.stub(todoService, 'list')
      .callsFake(() => Promise.reject(new Error('Downstream API failed')));

    try {
      await model.get('RC', 'LYDS', '12345');
    } catch (e) {
      expect(e.statusCode).to.equal(500);
      expect(e.code).to.equal('BOILERPLATE_API_ERR_003');
      expect(e.message).to.equal('Downstream API failed');
    }

    userService.get.restore();
    todoService.list.restore();
  });
});
