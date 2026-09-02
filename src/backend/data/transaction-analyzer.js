/**
 * PIXEL CREW — Transaction Boundary Analyzer
 * 
 * Identifies multi-entity mutating workflows that require atomic transaction guarantees ($transaction),
 * rollback handling, and concurrency locks.
 */

export class TransactionAnalyzer {
  /**
   * Determine transaction boundaries across workflows
   * @param {Array<object>} workflows 
   * @param {Array<object>} entities 
   * @returns {Array<object>} Transaction Boundaries
   */
  static identifyBoundaries(workflows = [], entities = []) {
    const boundaries = [];

    workflows.forEach(wf => {
      const name = wf.name || 'Workflow';
      const isTransactional = /order|payment|transfer|booking|reserve|checkout|register|create|delete/i.test(name);

      if (isTransactional) {
        boundaries.push({
          workflowId: wf.id,
          workflowName: name,
          requiresTransaction: true,
          isolationLevel: 'ReadCommitted',
          timeoutMs: 5000,
          steps: wf.steps || ['Validate inputs', 'Mutate primary entity', 'Update related records', 'Audit log'],
          rollbackStrategy: 'Automatic ORM rollback on unhandled error or constraint violation'
        });
      }
    });

    if (boundaries.length === 0) {
      boundaries.push({
        workflowId: 'wf-default-atomic',
        workflowName: 'Default Atomic Mutation',
        requiresTransaction: true,
        isolationLevel: 'ReadCommitted',
        timeoutMs: 5000,
        steps: ['Input validation', 'Database write', 'Event emission'],
        rollbackStrategy: 'Rollback on error'
      });
    }

    return boundaries;
  }
}
