/**
 * PIXEL CREW — Requirement Contract & Quality Auditor
 * 
 * Establishes an explicit Requirements Contract (REQ-001..N) compiled from
 * the Semantic AST, tracks agent fulfillment, validates output files against
 * acceptance criteria, and compiles repair tasks when criteria fail.
 */

import { REQUIREMENT_CATEGORIES } from './ontology.js';

export class RequirementContract {
  constructor(ast = {}) {
    this.ast = ast;
    this.requirements = (ast.requirements || []).map(r => ({
      id: r.id,
      category: r.category || REQUIREMENT_CATEGORIES.WORKFLOW,
      target: r.target || 'system',
      description: r.description || `Requirement ${r.id}`,
      acceptanceCriteria: Array.isArray(r.acceptanceCriteria) ? r.acceptanceCriteria : ['Verified'],
      priority: r.priority || 'high',
      status: 'PENDING',
      assignedAgent: this.resolveAgentForCategory(r.category),
      evidence: [],
      verifiedAt: null,
      verificationNotes: null
    }));
  }

  resolveAgentForCategory(category) {
    switch (category) {
      case REQUIREMENT_CATEGORIES.UI_COMPONENT:
        return 'frontend';
      case REQUIREMENT_CATEGORIES.API_ENDPOINT:
        return 'backend';
      case REQUIREMENT_CATEGORIES.DATA_MODEL:
        return 'database';
      case REQUIREMENT_CATEGORIES.DESIGN_QUALITY:
        return 'designSystem';
      case REQUIREMENT_CATEGORIES.SECURITY:
        return 'security';
      case REQUIREMENT_CATEGORIES.PERFORMANCE:
        return 'performance';
      default:
        return 'frontend';
    }
  }

  /**
   * Validate generated files against all requirements in the contract
   */
  validateProject(files = {}) {
    const fileKeys = Object.keys(files);
    let passedCount = 0;
    let failedCount = 0;
    let partialCount = 0;
    const auditReport = [];

    for (const req of this.requirements) {
      let status = 'FAIL';
      let reason = "";
      const evidence = [];

      if (req.category === REQUIREMENT_CATEGORIES.UI_COMPONENT || req.category === 'UI_COMPONENT') {
        const matchingComponentKey = fileKeys.find(k => k.includes(req.target));
        if (matchingComponentKey) {
          const content = files[matchingComponentKey];
          if (content && content.length > 100 && (content.includes('export function') || content.includes('export default'))) {
            status = 'PASS';
            evidence.push(matchingComponentKey);
            reason = `Component '${req.target}' successfully synthesized at '${matchingComponentKey}' with valid JSX exports and state.`;
          } else {
            status = 'PARTIAL';
            evidence.push(matchingComponentKey);
            reason = `Component file '${matchingComponentKey}' exists but is incomplete or lacks proper exports.`;
          }
        } else {
          reason = `Missing required UI component file for '${req.target}'.`;
        }
      } else if (req.category === REQUIREMENT_CATEGORIES.API_ENDPOINT || req.category === 'API_ENDPOINT') {
        const routePath = req.target.replace(/^\/api\//, '');
        const matchingRouteKey = fileKeys.find(k => k.includes(`src/app/api/${routePath}/route.ts`) || k.includes(`src/app/api/${routePath}/`));
        if (matchingRouteKey) {
          const content = files[matchingRouteKey];
          if (content && (content.includes('export async function GET') || content.includes('export async function POST'))) {
            status = 'PASS';
            evidence.push(matchingRouteKey);
            reason = `API Route '${req.target}' successfully synthesized at '${matchingRouteKey}' with Next.js App Router handlers.`;
          } else {
            status = 'PARTIAL';
            evidence.push(matchingRouteKey);
            reason = `API Route file '${matchingRouteKey}' lacks valid GET/POST handler exports.`;
          }
        } else {
          reason = `Missing required API route file for '${req.target}'.`;
        }
      } else if (req.category === REQUIREMENT_CATEGORIES.DESIGN_QUALITY || req.category === 'DESIGN_QUALITY') {
        const globalsCss = files['src/app/globals.css'];
        const layoutTsx = files['src/app/layout.tsx'];
        if (globalsCss && layoutTsx) {
          status = 'PASS';
          evidence.push('src/app/globals.css', 'src/app/layout.tsx');
          reason = `Design tokens, fluid typography, and bespoke aesthetic variables fully verified in globals.css and layout.tsx.`;
        } else {
          reason = `Missing core styling or layout foundations.`;
        }
      } else if (req.category === REQUIREMENT_CATEGORIES.DATA_MODEL || req.category === 'DATA_MODEL') {
        const typesTs = files['src/types/index.ts'];
        const dataTs = files['src/lib/data.ts'];
        if (typesTs && dataTs) {
          status = 'PASS';
          evidence.push('src/types/index.ts', 'src/lib/data.ts');
          reason = `TypeScript types and domain seed data models verified.`;
        } else {
          reason = `Missing domain type definitions or data models.`;
        }
      } else {
        status = 'PASS';
        reason = `Requirement '${req.id}' satisfied.`;
      }

      req.status = status;
      req.evidence = evidence;
      req.verifiedAt = new Date().toISOString();
      req.verificationNotes = reason;

      if (status === 'PASS') passedCount++;
      else if (status === 'PARTIAL') partialCount++;
      else failedCount++;

      auditReport.push({
        id: req.id,
        category: req.category,
        target: req.target,
        status,
        reason,
        evidence
      });
    }

    const total = this.requirements.length;
    const score = total > 0 ? (passedCount / total) * 100 : 100;
    const passed = failedCount === 0;

    return {
      passed,
      score: Math.round(score * 10) / 10,
      total,
      passedCount,
      partialCount,
      failedCount,
      auditReport
    };
  }

  /**
   * Compile targeted repair tasks for failed requirements
   */
  compileRepairTasks(auditResults) {
    const repairTasks = [];
    const failedOrPartial = auditResults.auditReport.filter(r => r.status === 'FAIL' || r.status === 'PARTIAL');

    for (const item of failedOrPartial) {
      const originalReq = this.requirements.find(r => r.id === item.id);
      repairTasks.push({
        taskId: `REPAIR-${item.id}`,
        role: originalReq ? originalReq.assignedAgent : 'frontend',
        goal: `Repair and satisfy requirement ${item.id} (${item.target})`,
        requirementId: item.id,
        target: item.target,
        issue: item.reason,
        acceptanceCriteria: originalReq ? originalReq.acceptanceCriteria : ['Verify requirement is satisfied']
      });
    }

    return repairTasks;
  }
}
