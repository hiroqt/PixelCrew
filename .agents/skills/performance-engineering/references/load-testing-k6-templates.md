# k6 Load & Stress Testing Script Templates

## Overview
Automated load and stress testing identifies performance bottlenecks, concurrency limits, and memory leaks before production deployment.

---

## 1. Production-Grade k6 Test Suite Template

```javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

const errorRate = new Rate('api_error_rate');
const authLatency = new Trend('auth_duration_ms');

export const options = {
  thresholds: {
    http_req_duration: ['p(95)<250', 'p(99)<500'],
    api_error_rate: ['rate<0.01'],
    http_req_failed: ['rate<0.01'],
  },
  scenarios: {
    average_load: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: [
        { duration: '2m', target: 50 },
        { duration: '5m', target: 200 },
        { duration: '2m', target: 500 },
        { duration: '2m', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
};

const BASE_URL = __ENV.TARGET_URL || 'https://staging.api.example.com';

export default function () {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'k6-load-testing-suite/1.0',
    },
    timeout: '5s',
  };

  const healthRes = http.get(`${BASE_URL}/healthz`, params);
  check(healthRes, {
    'healthz returns 200': (r) => r.status === 200,
  });

  const startTime = Date.now();
  const payload = JSON.stringify({
    query: 'production telemetry report',
    limit: 25,
  });

  const apiRes = http.post(`${BASE_URL}/v1/analytics/query`, payload, params);

  authLatency.add(Date.now() - startTime);

  const isSuccess = check(apiRes, {
    'status is 200': (r) => r.status === 200,
    'has valid payload': (r) => r.json('data') !== undefined,
  });

  errorRate.add(!isSuccess);
  sleep(Math.random() * 1.0 + 0.5);
}
```
