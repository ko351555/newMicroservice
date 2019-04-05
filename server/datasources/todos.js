const { ENTERPRISE_SERVICE_BASE_URL } = process.env;

const headers = {
  'x-lbg-channel': '{xLbgChannel}',
  'x-lbg-brand': '{xLbgBrand}',
  'x-lbg-txn-correlation-id': '{xLbgTxnCorrelationId}'
};

module.exports = {
  name: 'todos',
  crud: true,
  connector: 'rest',
  uri: ENTERPRISE_SERVICE_BASE_URL,
  operations: [
    {
      functions: {
        listDS: [
          'userId',
          'xLbgChannel',
          'xLbgBrand',
          'xLbgTxnCorrelationId'
        ]
      },
      template: {
        method: 'GET',
        url: `${ENTERPRISE_SERVICE_BASE_URL}/todos`,
        query: {
          userId: '{userId}'
        },
        headers
      }
    }
  ]
};
