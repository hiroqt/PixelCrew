/**
 * PIXEL CREW — Targeted Repair Planner
 * 
 * Compiles precision repair tasks for failed requirements or visual critic defects
 * without regenerating the entire repository. Enforces maximum repair limits.
 */

export const MAX_REPAIR_ITERATIONS = 3;

export class RepairPlanner {
  /**
   * Plan targeted repair tasks from validation and visual critic reports.
   */
  static planRepairs({ validationResult, visualCriticResult, iteration = 1, files = {}, artifactGraph = null }) {
    if (iteration > MAX_REPAIR_ITERATIONS) {
      return {
        canRepair: false,
        status: 'needs-review',
        iteration,
        message: `Maximum repair iterations (${MAX_REPAIR_ITERATIONS}) reached. Manual review required.`,
        repairTasks: []
      };
    }

    const repairTasks = [];

    // 1. Requirement Failure Repairs
    if (validationResult && Array.isArray(validationResult.auditReport)) {
      const failedReqs = validationResult.auditReport.filter(r => r.status === 'FAIL' || r.status === 'PARTIAL');
      failedReqs.forEach(req => {
        repairTasks.push({
          taskId: `REPAIR-${req.id}-iter${iteration}`,
          role: req.category === 'api_endpoint' ? 'backend' : (req.category === 'data_model' ? 'database' : 'frontend'),
          goal: `Repair and satisfy requirement ${req.id} (${req.target})`,
          target: req.target,
          reason: req.reason,
          iteration
        });
      });
    }

    // 2. Visual Critic Defect Repairs
    if (visualCriticResult && Array.isArray(visualCriticResult.findings)) {
      const slopFindings = visualCriticResult.findings.filter(f => f.severity === 'high');
      slopFindings.forEach((finding, idx) => {
        repairTasks.push({
          taskId: `REPAIR-SLOP-${idx + 1}-iter${iteration}`,
          role: 'frontend',
          goal: `Eliminate ${finding.rule} in ${finding.file}`,
          target: finding.file,
          reason: finding.evidence,
          iteration
        });
      });
    }

    const canRepair = repairTasks.length > 0;

    return {
      canRepair,
      status: canRepair ? 'in-progress' : 'complete',
      iteration,
      totalTasks: repairTasks.length,
      repairTasks
    };
  }
}
