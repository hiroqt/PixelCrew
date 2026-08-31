import test from 'node:test';
import assert from 'node:assert/strict';
import { DynamicPlanner } from '../src/orchestrator/planner.js';
import { TaskQueue } from '../src/orchestrator/task-queue.js';
import { CodeGenerator } from '../src/orchestrator/code-generator.js';
import { OneShotEngine } from '../src/orchestrator/oneshot.js';
import { TaskGraph } from '../src/core/task-graph.js';
import { Scheduler } from '../src/core/scheduler.js';
import { AgentRuntime } from '../src/core/agent-runtime.js';
import { EventBus } from '../src/core/event-bus.js';
import { createTask, TASK_STATUS } from '../src/protocol/task.js';

test('SaaS Prompt Analysis: "create me a SaaS dashboard with login" parses domain, auth, and KPI topology', () => {
  const planner = new DynamicPlanner();
  const prompt = "create me a SaaS dashboard with login";
  
  const analysis = planner.analyzeRequirements(prompt);
  assert.equal(analysis.domain, 'saas');
  assert.ok(analysis.requestedFeatures.includes('auth-login-modal'));
  assert.ok(analysis.requestedFeatures.includes('jwt-session-management'));
  assert.ok(analysis.requestedFeatures.includes('saas-kpi-dashboard'));

  const spec = planner.createProjectSpecification(analysis);
  assert.equal(spec.domain, 'saas');
  assert.ok(spec.sections.some(s => s.component === 'DashboardMetrics'));
  assert.ok(spec.sections.some(s => s.component === 'AuthLoginModal'));
  assert.ok(spec.sections.some(s => s.component === 'PricingMatrix'));

  const routePaths = spec.apiRoutes.map(r => r.path);
  assert.ok(routePaths.includes('src/app/api/auth/login/route.ts'));
  assert.ok(routePaths.includes('src/app/api/dashboard/stats/route.ts'));
  assert.ok(routePaths.includes('src/app/api/contact/route.ts'));
});

test('DAG Architecture: Identifies explicit parallel execution batches vs sequential dependency barriers', () => {
  const planner = new DynamicPlanner();
  const prompt = "create me a SaaS dashboard with login";
  const analysis = planner.analyzeRequirements(prompt);
  const spec = planner.createProjectSpecification(analysis);
  const { tasks } = planner.createTaskGraph(spec);

  assert.equal(tasks.length, 9);

  // 1. Initial Root Task
  const planTask = tasks.find(t => t.id === 'task-plan');
  assert.deepEqual(planTask.dependsOn, []);

  // 2. Parallel Batch 1: Creative Director & Content Strategist both depend ONLY on task-plan
  const designTask = tasks.find(t => t.id === 'task-design-director');
  const copyTask = tasks.find(t => t.id === 'task-content-strategist');
  assert.deepEqual(designTask.dependsOn, ['task-plan']);
  assert.deepEqual(copyTask.dependsOn, ['task-plan']);

  // 3. Frontend Scaffold depends on design director
  const scaffoldTask = tasks.find(t => t.id === 'task-frontend-scaffold');
  assert.deepEqual(scaffoldTask.dependsOn, ['task-design-director']);

  // 4. Parallel Batch 2: Backend API Routes & Frontend Components
  const backendTask = tasks.find(t => t.id === 'task-backend-routes');
  const componentsTask = tasks.find(t => t.id === 'task-frontend-components');
  assert.deepEqual(backendTask.dependsOn, ['task-frontend-scaffold']);
  assert.deepEqual(componentsTask.dependsOn.sort(), ['task-content-strategist', 'task-frontend-scaffold'].sort());

  // 5. Parallel Batch 3: Animation Specialist & Responsive Specialist both depend on components
  const animTask = tasks.find(t => t.id === 'task-animation-motion');
  const respTask = tasks.find(t => t.id === 'task-responsive-specialist');
  assert.deepEqual(animTask.dependsOn, ['task-frontend-components']);
  assert.deepEqual(respTask.dependsOn, ['task-frontend-components']);

  // 6. Final Quality Barrier: Visual Critic waits for all parallel branches
  const qaTask = tasks.find(t => t.id === 'task-qa-visual-critic');
  assert.deepEqual(qaTask.dependsOn.sort(), ['task-animation-motion', 'task-backend-routes', 'task-responsive-specialist'].sort());
});

test('Parallel Runtime Concurrency: Proves simultaneous overlapping execution in TaskQueue', async () => {
  const planner = new DynamicPlanner();
  const spec = planner.createProjectSpecification(planner.analyzeRequirements("create me a SaaS dashboard with login"));
  const { tasks } = planner.createTaskGraph(spec);

  const queue = new TaskQueue(tasks);
  const taskTimings = new Map();
  const activeConcurrent = new Set();
  let maxObservedConcurrency = 0;

  const simulatedWorkDelay = 50; // ms

  const result = await queue.execute({
    executeTaskHandler: async (task) => {
      const startTime = Date.now();
      activeConcurrent.add(task.id);
      if (activeConcurrent.size > maxObservedConcurrency) {
        maxObservedConcurrency = activeConcurrent.size;
      }

      await new Promise(r => setTimeout(r, simulatedWorkDelay));

      const endTime = Date.now();
      activeConcurrent.delete(task.id);
      taskTimings.set(task.id, { start: startTime, end: endTime });
    }
  });

  assert.equal(result.success, true);
  assert.equal(result.completedCount, 9);
  assert.ok(maxObservedConcurrency >= 2, `Expected at least 2 concurrent tasks, observed: ${maxObservedConcurrency}`);

  // Prove Parallel Batch 1 Overlap (Creative Director & Content Strategist)
  const tDesign = taskTimings.get('task-design-director');
  const tCopy = taskTimings.get('task-content-strategist');
  const batch1Overlap = (tDesign.start < tCopy.end) && (tCopy.start < tDesign.end);
  assert.ok(batch1Overlap, 'task-design-director and task-content-strategist must execute in parallel concurrently');

  // Prove Parallel Batch 3 Overlap (Animation Specialist & Responsive Specialist)
  const tAnim = taskTimings.get('task-animation-motion');
  const tResp = taskTimings.get('task-responsive-specialist');
  const batch3Overlap = (tAnim.start < tResp.end) && (tResp.start < tAnim.end);
  assert.ok(batch3Overlap, 'task-animation-motion and task-responsive-specialist must execute in parallel concurrently');
});

test('Core Orchestrator & Scheduler: Multi-Agent TaskGraph dispatches parallel tasks across worker slots', async () => {
  const eventBus = new EventBus();
  const runtime = new AgentRuntime({ eventBus });
  const scheduler = new Scheduler({ agentRuntime: runtime, maxConcurrent: 4 });

  const t1 = createTask({ id: 'task-plan', title: 'Plan', agent: 'orchestrator', dependencies: [] });
  const t2 = createTask({ id: 'task-design', title: 'Design', agent: 'creativeDirector', dependencies: ['task-plan'] });
  const t3 = createTask({ id: 'task-copy', title: 'Copy', agent: 'contentStrategist', dependencies: ['task-plan'] });
  const t4 = createTask({ id: 'task-ui', title: 'Frontend UI', agent: 'frontend', dependencies: ['task-design', 'task-copy'] });
  const t5 = createTask({ id: 'task-api', title: 'Backend Auth API', agent: 'backend', dependencies: ['task-design'] });
  const t6 = createTask({ id: 'task-qa', title: 'QA Audit', agent: 'qa', dependencies: ['task-ui', 'task-api'] });

  const graph = new TaskGraph([t1, t2, t3, t4, t5, t6]);
  const dispatchedEvents = [];
  eventBus.on('event', evt => dispatchedEvents.push(evt));

  const result = await scheduler.execute(graph, {
    executeTaskHandler: async (task) => {
      await new Promise(r => setTimeout(r, 20));
      return { status: 'OK', taskId: task.id };
    }
  });

  assert.equal(result.success, true);
  assert.equal(result.completed, 6);
  assert.equal(graph.isCompleted(), true);
});

test('CodeGenerator & OneShot Synthesis: Synthesizes complete SaaS Dashboard with Login & Auth API routes', async () => {
  const oneshot = new OneShotEngine({ fast: true });
  const prompt = "create me a SaaS dashboard with login";
  const tempDir = './tmp-saas-test';

  try {
    const result = await oneshot.generateWebsite(prompt, {
      outputDir: tempDir
    });

    assert.equal(result.targetFramework, 'nextjs');
    assert.ok(result.buildResult.fileCount >= 10);
    
    const files = result.buildResult.files;
    assert.ok(files['src/components/sections/DashboardMetrics.tsx'], 'Must generate DashboardMetrics.tsx');
    assert.ok(files['src/components/sections/AuthLoginModal.tsx'], 'Must generate AuthLoginModal.tsx');
    assert.ok(files['src/components/sections/PricingMatrix.tsx'], 'Must generate PricingMatrix.tsx');
    assert.ok(files['src/app/api/auth/login/route.ts'], 'Must generate /api/auth/login route');
    assert.ok(files['src/app/api/dashboard/stats/route.ts'], 'Must generate /api/dashboard/stats route');
    assert.ok(files['src/app/page.tsx'], 'Must generate root page.tsx');
    assert.ok(files['package.json'], 'Must generate package.json');

    // Verify Anti-AI Visual Critic Rubric Score
    assert.ok(result.evaluation.finalScore >= 8.5, `Evaluation score ${result.evaluation.finalScore} should be >= 8.5`);
    assert.equal(result.evaluation.passed, true);
  } finally {
    const fs = await import('node:fs/promises');
    await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
  }
});
