const { ENTERPRISE_SERVICE_BASE_URL } = process.env;

const headers = {
  'x-lbg-channel': '{xLbgChannel}',
  'x-lbg-brand': '{xLbgBrand}',
  'x-lbg-txn-correlation-id': '{xLbgTxnCorrelationId}'
};

module.exports = {
  name: 'profile',
  crud: true,
  connector: 'rest',
  uri: ENTERPRISE_SERVICE_BASE_URL,
  operations: [
    {
      functions: {
        listDS: [
          'xLbgChannel',
          'xLbgBrand',
          'xLbgTxnCorrelationId'
        ]
      },
      template: {
        method: 'GET',
        url: `${ENTERPRISE_SERVICE_BASE_URL}/direct-debits`,

        headers
      }
    }
  ]
};
