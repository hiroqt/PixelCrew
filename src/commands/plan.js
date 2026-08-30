/**
 * PIXEL CREW — /plan Command
 * 
 * Analyzes requirements and compiles a Dynamic DAG Task Graph without execution.
 */

import { PixelCommand } from './command.interface.js';
import { DynamicPlanner } from '../orchestrator/planner.js';

export class PlanCommand extends PixelCommand {
  constructor() {
    super({
      name: 'plan',
      aliases: ['spec', 'design'],
      description: 'Analyze the request and create a dynamic DAG task plan without executing',
      usage: '/plan <prompt>',
      category: 'planning'
    });
    this.planner = new DynamicPlanner();
  }

  async execute(context, args) {
    const prompt = args.join(' ');
    if (!prompt) {
      return {
        success: false,
        message: 'Please provide a project prompt to plan. Example: /plan Build high-performance SaaS pricing calculator'
      };
    }

    const analysis = this.planner.analyzeRequirements(prompt, context.options || {});
    const spec = this.planner.createProjectSpecification(analysis);
    const graphResult = this.planner.createTaskGraph(spec);
    const taskList = Array.isArray(graphResult) ? graphResult : (graphResult.tasks || []);

    const taskListFormatted = taskList.map((t, idx) => {
      const deps = t.dependsOn && t.dependsOn.length > 0 ? ` (deps: ${t.dependsOn.join(', ')})` : '';
      return `  ${idx + 1}. [${t.agentId || t.agent}] ${t.name || t.title}${deps}\n     Skills: ${(t.skills || []).join(', ')}`;
    }).join('\n');

    const output = [
      `╔══════════════════════════════════════════════════════════════════╗`,
      `║   PIXEL CREW DYNAMIC PROJECT PLAN & TASK DAG                     ║`,
      `╚══════════════════════════════════════════════════════════════════╝`,
      ``,
      `PROJECT:    ${spec.projectName}`,
      `ENTITY:     ${spec.companyName} (${spec.roleOrSubtitle})`,
      `DOMAIN:     ${spec.domain.toUpperCase()}`,
      `FRAMEWORK:  ${spec.framework}`,
      `SUMMARY:    ${spec.summary}`,
      ``,
      `TASK GRAPH (DAG - ${taskList.length} steps):`,
      taskListFormatted,
      ``,
      `To execute this plan, run:`,
      `  /oneshot ${prompt}`
    ].join('\n');

    return {
      success: true,
      message: `Dynamic plan compiled for: "${spec.projectName}" (${taskList.length} tasks)`,
      data: { spec, taskGraph: taskList },
      output
    };
  }
}
