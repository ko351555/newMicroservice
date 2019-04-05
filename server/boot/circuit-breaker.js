const { circuit } = require('ob-core-circuit-breaker');
const getRootContext = require('../helpers/get-root-context');

// method to set up circuit breaker stats
module.exports = (app) => {
  const router = app.loopback.Router();

  app.get(`${getRootContext()}/api/circuit.breaker.stream`, function (req, res) {
    res.setHeader('Content-Type', 'text/event-stream;charset=UTF-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
    res.setHeader('Pragma', 'no-cache');

    return circuit.stream(res);
  });

  router.get(`${getRootContext()}/api/circuit.breaker.stats`, function (req, res) {
    res.setHeader('Content-Type', 'text/event-stream;charset=UTF-8');
    res.setHeader('Cache-Control', 'no-cache, no-store, max-age=0, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.send(circuit.stats('Booked Transactions'));
  });

  app.use(router);
};
