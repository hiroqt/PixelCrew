/**
 * PIXEL CREW — Dynamic Task Planner
 * 
 * Compiles a Directed Acyclic Graph (DAG) of specialized agent tasks from
 * Project AST, RequirementContract, and DesignSpec.
 */

export class TaskPlanner {
  /**
   * Compile DAG task graph
   */
  static planTaskGraph({ ast, requirementContract, designSpec }) {
    const tasks = [];
    const views = ast.views || [];
    const operations = ast.operations || [];
    const entities = ast.entities || [];

    // Phase 1: Semantic Review & Design Direction
    tasks.push({
      id: 'task-semantic-review',
      title: 'Review Project AST & Semantic Coherence',
      role: 'orchestrator',
      phase: 'analysis',
      dependencies: [],
      inputs: ['Project AST'],
      outputs: ['Normalized AST', 'Requirement Contract']
    });

    tasks.push({
      id: 'task-design-spec',
      title: 'Synthesize Bespoke Visual Design Specification',
      role: 'creativeDirector',
      phase: 'design',
      dependencies: ['task-semantic-review'],
      inputs: ['Normalized AST'],
      outputs: ['DesignSpec']
    });

    // Phase 2: Domain Modeling & Database Fixtures
    tasks.push({
      id: 'task-data-modeling',
      title: `Synthesize TypeScript Models & Seed Data for ${entities.length} Entities`,
      role: 'database',
      phase: 'foundation',
      dependencies: ['task-semantic-review'],
      inputs: entities.map(e => e.name),
      outputs: ['src/types/index.ts', 'src/lib/data.ts']
    });

    // Phase 3: Global Design Tokens & App Layout
    tasks.push({
      id: 'task-design-tokens',
      title: 'Compile Tailwind Tokens & Global CSS',
      role: 'designSystem',
      phase: 'foundation',
      dependencies: ['task-design-spec'],
      inputs: ['DesignSpec'],
      outputs: ['src/app/globals.css', 'tailwind.config.ts']
    });

    // Phase 4: Parallel View & Backend API Construction
    views.forEach((v, idx) => {
      tasks.push({
        id: `task-view-${v.componentName.toLowerCase()}`,
        title: `Implement ${v.componentName} (${v.title})`,
        role: 'frontend',
        phase: 'implementation',
        dependencies: ['task-data-modeling', 'task-design-tokens'],
        inputs: [v.componentName, ...v.targetEntities],
        outputs: [`src/components/sections/${v.componentName}.tsx`]
      });
    });

    tasks.push({
      id: 'task-backend-routes',
      title: `Synthesize ${operations.length} REST Route Handlers (RFC 7807)`,
      role: 'backend',
      phase: 'implementation',
      dependencies: ['task-data-modeling'],
      inputs: operations.map(o => o.path),
      outputs: operations.map(o => `src/app${o.path}/route.ts`)
    });

    // Phase 5: Root Page Assembly
    tasks.push({
      id: 'task-page-assembly',
      title: 'Assemble Dynamic Root Page & Navigation',
      role: 'frontend',
      phase: 'assembly',
      dependencies: views.map(v => `task-view-${v.componentName.toLowerCase()}`),
      inputs: views.map(v => v.componentName),
      outputs: ['src/app/page.tsx', 'src/components/sections/PortalHeader.tsx']
    });

    // Phase 6: Requirement & Visual Quality Validation
    tasks.push({
      id: 'task-validation-gate',
      title: 'Run Requirement Contract & Visual Critic Quality Gate',
      role: 'qa',
      phase: 'validation',
      dependencies: ['task-page-assembly', 'task-backend-routes'],
      inputs: ['RequirementContract', 'All Generated Files'],
      outputs: ['QualityGateReport']
    });

    return {
      totalTasks: tasks.length,
      tasks
    };
  }
}
