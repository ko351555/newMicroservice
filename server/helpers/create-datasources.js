const fs = require('fs');
const path = require('path');
const { outboundTLS } = require('ob-core-common-modules');

const isDatasourceFile = file =>
  file.endsWith('.js') && !file.endsWith('.spec.js');

// method to set up datasources
module.exports = (app, datasourceLocation) => {
  if (datasourceLocation) {
    fs.readdirSync(datasourceLocation)
      .filter(isDatasourceFile)
      .forEach((file) => {
        const datasource = require(path.resolve(datasourceLocation, file));
        const secureDatasource = outboundTLS(datasource);

        app.dataSource(secureDatasource.name, secureDatasource);
      });
  }
};

module.exports.isDatasourceFile = isDatasourceFile;
