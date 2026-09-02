/**
 * PIXEL CREW — Resilience & Reliability Policy
 */

export const ResiliencePolicy = {
  id: 'POL-REL-RESILIENCE',
  name: 'Resilience & Fault Tolerance Policy',
  rules: [
    { id: 'REL-01', description: 'Mutating operations must support Idempotency-Key validation.' },
    { id: 'REL-02', description: 'Asynchronous workers must have dead-letter queues and retry backoff.' },
    { id: 'REL-03', description: 'Applications must handle SIGTERM/SIGINT with graceful resource cleanup.' }
  ]
};
