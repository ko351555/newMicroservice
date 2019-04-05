const sinon = require('sinon');
const { expect } = require('chai');
const createDatasources = require('./create-datasources');
const { datasourceLocation } = require('../config.json');

describe('helpers/create-datasources.js', () => {
  it('should do nothing if datasourceLocation is not defined', () => {
    const app = {
      dataSource: sinon.spy()
    };

    createDatasources(app, null);

    expect(app.dataSource.callCount).to.equal(0);
  });

  it('should create the correct datasources', () => {
    const app = {
      dataSource: sinon.spy()
    };

    createDatasources(app, datasourceLocation);

    expect(app.dataSource.getCall(0).args[0]).to.equal('todos');
    expect(app.dataSource.getCall(1).args[0]).to.equal('users');
  });

  it('should support datasource tests', () => {
    expect(createDatasources.isDatasourceFile('some.spec.js')).to.equal(false);
  });
});
