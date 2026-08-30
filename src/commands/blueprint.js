/**
 * PIXEL CREW — /blueprint Command
 * 
 * Compiles architectural topology, UI wireframes, and dynamic DAG task graph before writing code.
 */

import { PixelCommand } from './command.interface.js';
import { DynamicPlanner } from '../orchestrator/planner.js';

export class BlueprintCommand extends PixelCommand {
  constructor() {
    super({
      name: 'blueprint',
      aliases: ['shape', 'spec', 'plan-shape'],
      description: 'Floor 42 Blueprint: Plan UX section topologies and compile dynamic DAG task graph',
      usage: '/blueprint <prompt>',
      category: 'planning'
    });
    this.planner = new DynamicPlanner();
  }

  async execute(context, args = []) {
    const prompt = args.filter(a => !a.startsWith('-')).join(' ');
    if (!prompt) {
      return {
        success: false,
        message: 'Please provide a prompt for /blueprint. Example: /blueprint Developer docs with interactive API playground',
        output: '\x1b[31mError: Please provide a prompt for /blueprint.\x1b[0m'
      };
    }

    const analysis = this.planner.analyzeRequirements(prompt, context.options || {});
    const spec = this.planner.createProjectSpecification(analysis);
    const graphResult = this.planner.createTaskGraph(spec);
    const taskList = Array.isArray(graphResult) ? graphResult : (graphResult.tasks || []);

    const lines = [
      '╔══════════════════════════════════════════════════════════════════╗',
      '║   PIXEL CREW — FLOOR 42 ARCHITECTURAL BLUEPRINT SPEC            ║',
      '╚══════════════════════════════════════════════════════════════════╝',
      '',
      `\x1b[1mPROJECT:\x1b[0m            ${spec.projectName}`,
      `\x1b[1mCOMPANY/ENTITY:\x1b[0m     ${spec.companyName}`,
      `\x1b[1mDOMAIN:\x1b[0m             ${spec.domain.toUpperCase()}`,
      `\x1b[1mARCHETYPE:\x1b[0m          ${spec.archetype}`,
      `\x1b[1mHEADLINE:\x1b[0m           "${spec.headline}"`,
      `\x1b[1mPRIMARY PALETTE:\x1b[0m    Background: ${spec.palette?.bg || '#0b0f19'} | Accent: ${spec.palette?.accent || '#00f0ff'}`,
      `\x1b[1mTYPOGRAPHY:\x1b[0m         Display: ${spec.fonts?.display || 'Outfit'} | Body: ${spec.fonts?.body || 'Inter'}`,
      '',
      '\x1b[1mUX SECTION TOPOLOGY:\x1b[0m',
      ...(spec.sections || []).map((s, i) => `  ${i + 1}. [${s.id}] → ${s.component} (${s.headline || s.title || 'Section'})`),
      '',
      `\x1b[1mDAG TASK GRAPH:\x1b[0m     ${taskList.length} nodes compiled for parallel agent execution`,
      ...taskList.map(n => `  • [${(n.agentId || n.agent || 'orchestrator').padEnd(16)}] ${n.name || n.title} (depends on: ${(n.dependsOn || []).join(', ') || 'none'})`),
      ''
    ];

    return {
      success: true,
      message: `Compiled Floor 42 blueprint for: "${spec.companyName}"`,
      data: { spec, taskGraph: taskList },
      output: lines.join('\n')
    };
  }
}
