const {
  CIRCUIT_BREAKER_TIMEOUT,
  CIRCUIT_BREAKER_OPEN_TIMEOUT_IN_MS,
  CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE,
  CIRCUIT_BREAKER_MINIMUM_REQUEST_FOR_HEALTHCHECK,
  CIRCUIT_BREAKER_EXECUTION_TRACK_WINDOW,
  CIRCUIT_BREAKER_WINDOW_BUCKER,
  CIRCUIT_BREAKE_ENABLED
} = process.env;

module.exports = [
  {
    serviceName: 'listDS',
    timeout: CIRCUIT_BREAKER_TIMEOUT,
    openTimeoutInMilliseconds: CIRCUIT_BREAKER_OPEN_TIMEOUT_IN_MS,
    errorThresholdPercentage: CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE,
    minimumRequestForHealthCheck: CIRCUIT_BREAKER_MINIMUM_REQUEST_FOR_HEALTHCHECK,
    executionTrackWindow: CIRCUIT_BREAKER_EXECUTION_TRACK_WINDOW,
    windowBucket: CIRCUIT_BREAKER_WINDOW_BUCKER,
    disable: CIRCUIT_BREAKE_ENABLED
  },
  {
    serviceName: 'getDS',
    timeout: CIRCUIT_BREAKER_TIMEOUT,
    openTimeoutInMilliseconds: CIRCUIT_BREAKER_OPEN_TIMEOUT_IN_MS,
    errorThresholdPercentage: CIRCUIT_BREAKER_ERROR_THRESHOLD_PERCENTAGE,
    minimumRequestForHealthCheck: CIRCUIT_BREAKER_MINIMUM_REQUEST_FOR_HEALTHCHECK,
    executionTrackWindow: CIRCUIT_BREAKER_EXECUTION_TRACK_WINDOW,
    windowBucket: CIRCUIT_BREAKER_WINDOW_BUCKER,
    disable: CIRCUIT_BREAKE_ENABLED
  }
];
