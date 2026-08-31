/**
 * PIXEL CREW — Dynamic Prompt-Driven Project Planner & Task Graph Engine
 * 
 * Decomposes arbitrary user prompts from first principles into:
 * 1. Semantic AST (Domain, Actors, Entities, Views, Operations, Interactive Workflows)
 * 2. Requirement Contract (REQ-001..N with verifiable acceptance criteria)
 * 3. Bespoke Design Specification (DesignEngine)
 * 4. Dynamic Task Graph (DAG) with specialized agent role allocation
 */

import { SkillRegistry } from './skills-registry.js';
import { SemanticEngine } from './semantic-engine.js';
import { RequirementContract } from './requirement-contract.js';
import { DesignEngine } from './design-engine.js';
import { TaskPlanner } from './task-planner.js';

export class DynamicPlanner {
  constructor() {
    this.skillRegistry = new SkillRegistry();
  }

  /**
   * Step 1: Semantic Requirement Analysis from User Prompt
   */
  analyzeRequirements(prompt, options = {}) {
    const rawPrompt = (prompt || '').trim();
    const p = rawPrompt.toLowerCase();

    // 1. Target Framework & Runtime Stack
    let framework = options.targetFramework || 'nextjs';
    if (p.includes('react') && !p.includes('next')) framework = 'react';
    else if (p.includes('vue')) framework = 'vue';
    else if (p.includes('vanilla')) framework = 'vanilla';

    // 2. Parse into full Semantic Project AST
    const ast = SemanticEngine.parsePromptToAST(rawPrompt);

    // 3. Create verifiable Requirement Contract
    const contract = new RequirementContract(ast);

    // 4. Synthesize bespoke DesignSpec
    const designSpec = DesignEngine.synthesizeDesignSpec(ast, rawPrompt);

    // 5. Motion & Animation Intent
    const hasAnimations = true;

    // 6. Requested Interactive Features
    const requestedFeatures = this.extractRequestedFeatures(p, ast);

    return {
      prompt: rawPrompt,
      domain: ast.domain,
      framework,
      hasAnimations,
      projectName: ast.appName,
      companyName: ast.appName,
      roleOrSubtitle: ast.headline,
      summary: ast.summary,
      ast,
      contract,
      designSpec,
      entities: ast.entities,
      views: ast.views,
      operations: ast.operations,
      requirements: ast.requirements,
      metrics: this.synthesizeDynamicMetrics(ast.appName, p),
      actions: this.synthesizeDynamicActions(p),
      aestheticMood: 'bespoke',
      palette: designSpec.color || ast.palette,
      fonts: designSpec.typography || ast.fonts,
      requestedFeatures
    };
  }

  /**
   * Helper: Extracts requested interactive features
   */
  extractRequestedFeatures(p, ast) {
    const features = [];
    if (p.includes('saas') || p.includes('dashboard')) {
      features.push('saas-kpi-dashboard');
    }
    if (p.includes('portfolio') || p.includes('developer') || p.includes('showcase')) {
      features.push('project-filter-matrix', 'interactive-terminal-shell');
    }
    if (p.includes('restaurant') || p.includes('tasting') || p.includes('dining') || p.includes('reservation')) {
      features.push('interactive-tasting-menu', 'table-reservation-modal');
    }
    if (p.includes('login') || p.includes('auth') || p.includes('sign in') || p.includes('account')) {
      features.push('auth-login-modal', 'jwt-session-management');
    }
    if (p.includes('pricing') || p.includes('tier') || p.includes('plan')) {
      features.push('pricing-tier-switcher');
    }
    if (p.includes('search') || p.includes('filter') || p.includes('sort')) {
      features.push('realtime-filter-search');
    }
    if (features.length === 0) {
      features.push('domain-workspace', 'realtime-filter-search');
    }
    return features;
  }

  /**
   * Helper: Synthesizes dynamic metrics
   */
  synthesizeDynamicMetrics(subject, p) {
    if (p.includes('orbit') || p.includes('rocket') || p.includes('space') || p.includes('mission')) {
      return [
        { label: "Delta-V Budget", value: "3,840 m/s", change: "Optimal Margin", status: "optimal" },
        { label: "Altitude & Apogee", value: "542.8 km", change: "LEO Synchronous", status: "optimal" },
        { label: "Inclination Vector", value: "51.64°", change: "Nominal", status: "nominal" },
        { label: "Telemetry Link", value: "99.98%", change: "Ground Lock", status: "nominal" }
      ];
    }
    if (p.includes('legal') || p.includes('contract') || p.includes('clause') || p.includes('compliance')) {
      return [
        { label: "Risk Index", value: "94.2 / 100", change: "Sub-10ms Inference", status: "optimal" },
        { label: "Compliance Score", value: "99.94%", change: "Strict Benchmark", status: "optimal" },
        { label: "Clauses Extracted", value: "1,480 / sec", change: "Zero Hallucination", status: "optimal" },
        { label: "Active Agreements", value: "482 Files", change: "Multi-Jurisdiction", status: "nominal" }
      ];
    }
    if (p.includes('audio') || p.includes('synth') || p.includes('midi') || p.includes('sound')) {
      return [
        { label: "DSP Latency", value: "0.18 ms", change: "Zero Buffer Drop", status: "optimal" },
        { label: "Sample Processing", value: "192 kHz", change: "32-bit Float", status: "optimal" },
        { label: "Polyphony Voices", value: "64 Active", change: "Real-Time Parallel", status: "optimal" },
        { label: "Filter Headroom", value: "+18.4 dB", change: "Analog Modeled", status: "nominal" }
      ];
    }
    if (p.includes('real estate') || p.includes('property') || p.includes('mortgage') || p.includes('valuation')) {
      return [
        { label: "Valuation Comps", value: "12,400 Comps", change: "Real-Time Index", status: "optimal" },
        { label: "Portfolio AUM", value: "$42.8M", change: "+12.4% Annualized", status: "optimal" },
        { label: "Average Cap Rate", value: "6.85%", change: "+45 bps vs Index", status: "optimal" },
        { label: "Confidence Score", value: "99.2%", change: "Hedonic Model", status: "optimal" }
      ];
    }
    return [
      { label: `${subject} Throughput`, value: "4.2M ops/s", change: "+18.4% p99", status: "optimal" },
      { label: "Query Latency", value: "0.48 ms", change: "Sub-millisecond", status: "optimal" },
      { label: "Active Nodes", value: "1,248 Nodes", change: "Multi-Region", status: "nominal" },
      { label: "Availability SLA", value: "99.999%", change: "Zero Downtime", status: "nominal" }
    ];
  }

  /**
   * Helper: Extracts dynamic user operations / actions
   */
  synthesizeDynamicActions(p) {
    return ['search-and-filter', 'execute-runtime-command', 'inspect-telemetry'];
  }

  /**
   * Step 2: Create Dynamic Project Specification
   */
  createProjectSpecification(analysis) {
    const {
      prompt,
      domain,
      framework,
      projectName,
      companyName,
      roleOrSubtitle,
      summary,
      ast,
      contract,
      designSpec,
      entities,
      views,
      operations,
      requirements,
      metrics,
      actions,
      aestheticMood,
      palette,
      fonts,
      requestedFeatures
    } = analysis;

    const sections = this.buildDynamicSectionTopology(ast, requestedFeatures, companyName, projectName, roleOrSubtitle, summary, domain);

    return {
      appName: companyName || projectName || 'Application',
      companyName: companyName || projectName || 'Application',
      projectName: projectName || 'Application',
      domain: domain || 'software-system',
      headline: roleOrSubtitle || `Unified Platform for ${projectName}`,
      summary: summary || 'Engineered with open-world synthesis.',
      targetFramework: framework,
      sections,
      palette,
      fonts,
      ast,
      contract,
      designSpec,
      entities,
      views,
      operations,
      requirements,
      metrics,
      actions,
      aestheticMood,
      requestedFeatures,
      apiRoutes: [
        { path: 'src/app/api/auth/login/route.ts' },
        { path: 'src/app/api/dashboard/stats/route.ts' },
        { path: 'src/app/api/contact/route.ts' },
        { path: 'src/app/api/data/route.ts' }
      ],
      rawPrompt: prompt
    };
  }

  buildDynamicSectionTopology(ast, requestedFeatures, companyName, projectName, roleOrSubtitle, summary, domain) {
    const sections = [
      {
        id: "header",
        componentName: "PortalHeader",
        role: "Persistent Navigation & Workspace Header",
        stateful: false
      }
    ];

    if (domain === 'portfolio') {
      sections.push(
        { id: "hero", component: "Hero", componentName: "Hero", role: "Masthead", stateful: false },
        { id: "projects", component: "ProjectsGrid", componentName: "ProjectsGrid", role: "Projects Showcase", stateful: true }
      );
    } else if (domain === 'restaurant') {
      sections.push(
        { id: "tasting", component: "TastingMenu", componentName: "TastingMenu", role: "Tasting Menu", stateful: true },
        { id: "reservation", component: "ReservationSection", componentName: "ReservationSection", role: "Reservation", stateful: true }
      );
    } else if (domain === 'saas' || requestedFeatures.includes('saas-kpi-dashboard')) {
      sections.push(
        { id: "metrics", component: "DashboardMetrics", componentName: "DashboardMetrics", role: "Metrics & KPIs", stateful: true },
        { id: "auth", component: "AuthLoginModal", componentName: "AuthLoginModal", role: "Authentication Modal", stateful: true },
        { id: "pricing", component: "PricingMatrix", componentName: "PricingMatrix", role: "Pricing Matrix", stateful: true }
      );
    } else if (ast && Array.isArray(ast.views) && ast.views.length > 0) {
      ast.views.forEach(v => {
        sections.push({
          id: v.id || v.componentName.toLowerCase(),
          component: v.componentName,
          componentName: v.componentName,
          role: v.purpose || v.title,
          stateful: true
        });
      });
    } else {
      sections.push({
        id: "workspace",
        component: "DynamicWorkspace",
        componentName: "DynamicWorkspace",
        role: "Primary Domain Workspace",
        stateful: true
      });
    }

    return sections;
  }

  /**
   * Step 3: Dynamic Task Graph (DAG) Compilation
   */
  createTaskGraph(spec) {
    const tasks = [
      { id: 'task-plan', name: 'Synthesize AST & Requirements', agentId: 'orchestrator', dependsOn: [], skills: ['open-world-synthesis'], status: 'queued' },
      { id: 'task-design-director', name: 'Artistic Direction & Negative Constraints', agentId: 'creativeDirector', dependsOn: ['task-plan'], skills: ['design-director'], status: 'queued' },
      { id: 'task-content-strategist', name: 'Copywriting & Content Topology', agentId: 'uxPlanner', dependsOn: ['task-plan'], skills: ['ux-architecture'], status: 'queued' },
      { id: 'task-frontend-scaffold', name: 'Design Tokens & Global CSS Layout', agentId: 'designSystem', dependsOn: ['task-design-director'], skills: ['design-tokens'], status: 'queued' },
      { id: 'task-backend-routes', name: 'API Routes & RFC 7807 Handlers', agentId: 'backend', dependsOn: ['task-frontend-scaffold'], skills: ['typescript-routes'], status: 'queued' },
      { id: 'task-frontend-components', name: 'Dynamic View Components Synthesis', agentId: 'frontend', dependsOn: ['task-content-strategist', 'task-frontend-scaffold'], skills: ['react-19'], status: 'queued' },
      { id: 'task-animation-motion', name: 'Fluid Motion & Micro-Interactions', agentId: 'frontend', dependsOn: ['task-frontend-components'], skills: ['framer-motion'], status: 'queued' },
      { id: 'task-responsive-specialist', name: 'Responsive Viewport Calibration', agentId: 'frontend', dependsOn: ['task-frontend-components'], skills: ['tailwind'], status: 'queued' },
      { id: 'task-qa-visual-critic', name: 'Impeccable Visual Quality Gate', agentId: 'qa', dependsOn: ['task-animation-motion', 'task-backend-routes', 'task-responsive-specialist'], skills: ['visual-critic'], status: 'queued' }
    ];

    const agents = {
      creativeDirector: { role: 'Creative Director', skills: ['design-director', 'anti-ai-patterns'] },
      uxPlanner: { role: 'UX Planner', skills: ['ux-architecture', 'bento-layout'] },
      designSystem: { role: 'Design System Architect', skills: ['design-tokens', 'fluid-typography'] },
      frontend: { role: 'Frontend Engineer', skills: ['react-19', 'nextjs-app-router', 'tailwind'] },
      backend: { role: 'Backend & API Engineer', skills: ['typescript-routes', 'rfc7807-errors'] },
      database: { role: 'Database & Data Modeler', skills: ['data-fixtures', 'typescript-interfaces'] },
      qa: { role: 'QA & Compliance Auditor', skills: ['requirement-validation', 'visual-critic'] }
    };

    return {
      spec,
      totalTasks: tasks.length,
      agents,
      tasks
    };
  }

  compileTaskGraph(spec) {
    return this.createTaskGraph(spec);
  }
}
