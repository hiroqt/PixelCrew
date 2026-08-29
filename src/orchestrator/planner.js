/**
 * PIXEL CREW — Dynamic Project Planner & Task Graph Engine
 * 
 * Analyzes user prompts from first principles and creates:
 * 1. Deep Project Specification (Domain, Components, Features, Data Models)
 * 2. Dynamic Task Graph (DAG) with explicit dependency resolution
 */

import { SkillRegistry } from './skills-registry.js';

export class DynamicPlanner {
  constructor() {
    this.skillRegistry = new SkillRegistry();
  }

  /**
   * Step 1: Analyze Requirements from User Prompt
   */
  analyzeRequirements(prompt, options = {}) {
    const p = (prompt || '').toLowerCase();

    // 1. Target Framework & Stack
    let framework = options.targetFramework || 'nextjs';
    if (p.includes('react') && !p.includes('next')) framework = 'react';
    else if (p.includes('vue')) framework = 'vue';
    else if (p.includes('vanilla')) framework = 'vanilla';

    // 2. Domain Classification
    let domain = 'custom';
    if (p.includes('portfolio') || p.includes('resume') || p.includes('showcase my project') || p.includes('developer portfolio') || p.includes('personal site')) {
      domain = 'portfolio';
    } else if (p.includes('restaurant') || p.includes('culinary') || p.includes('dining') || p.includes('cafe') || p.includes('bistro') || p.includes('menu')) {
      domain = 'restaurant';
    } else if (p.includes('ecommerce') || p.includes('shop') || p.includes('store') || p.includes('product store') || p.includes('clothing')) {
      domain = 'ecommerce';
    } else if (p.includes('saas') || p.includes('platform') || p.includes('subscription') || p.includes('analytics') || p.includes('pricing calculator')) {
      domain = 'saas';
    } else if (p.includes('agency') || p.includes('studio') || p.includes('creative lab') || p.includes('design agency')) {
      domain = 'agency';
    } else if (p.includes('database') || p.includes('infra') || p.includes('developer tool') || p.includes('query') || p.includes('api engine')) {
      domain = 'devtool';
    }

    // 3. Motion & Animation Intent
    const hasAnimations = p.includes('animation') || p.includes('motion') || p.includes('interactive') || p.includes('kinetic') || true;
    
    // 4. Extract Entity / Project Name
    let projectName = "Bespoke System";
    let companyName = "Studio Artisan";
    let roleOrSubtitle = "Modern Digital Platform";
    let summary = "Engineered with intentional restraint and zero generic AI slop.";

    if (domain === 'portfolio') {
      projectName = "Modern Developer Portfolio";
      companyName = "Alex Rivera";
      roleOrSubtitle = "Staff Systems Architect & Creative Technologist";
      summary = "Designing high-order distributed architectures, sub-millisecond query engines, and kinetic human-grade web interfaces.";
    } else if (domain === 'restaurant') {
      projectName = "Artisan Culinary Studio";
      companyName = "AURELIA";
      roleOrSubtitle = "Modern Botanical Gastronomy & Tasting Lab";
      summary = "Hyper-seasonal tasting menus driven by foraging, fermentation, and architectural plating.";
    } else if (domain === 'ecommerce') {
      projectName = "Minimalist Object Store";
      companyName = "MONOLITH GOODS";
      roleOrSubtitle = "Precision-Crafted Hardware & Studio Tools";
      summary = "Industrial-grade design artifacts engineered for creators, architects, and minimalists.";
    } else if (domain === 'saas' || domain === 'devtool') {
      projectName = "High-Performance Data Infrastructure";
      companyName = "VectorScale";
      roleOrSubtitle = "Real-Time Telemetry & Vector Query Engine";
      summary = "Sub-millisecond latency query routing and deterministic state coordination for autonomous AI swarms.";
    } else if (domain === 'agency') {
      projectName = "Kinetic Creative Studio";
      companyName = "KITE CREATIVE";
      roleOrSubtitle = "Design Engineering & Spatial Digital Systems";
      summary = "We partner with visionary founders to build category-defining digital flagships and interactive products.";
    }

    return {
      prompt,
      domain,
      framework,
      hasAnimations,
      projectName,
      companyName,
      roleOrSubtitle,
      summary,
      requestedFeatures: this.extractRequestedFeatures(p, domain)
    };
  }

  /**
   * Helper: Extracts requested interactive feature modules
   */
  extractRequestedFeatures(promptLower, domain) {
    const features = [];

    if (domain === 'portfolio') {
      features.push('project-filter-matrix', 'interactive-terminal-shell', 'career-timeline', 'contact-modal');
    } else if (domain === 'restaurant') {
      features.push('interactive-tasting-menu', 'table-reservation-modal', 'chef-curation-slider', 'hours-location-card');
    } else if (domain === 'ecommerce') {
      features.push('product-bento-grid', 'interactive-cart-drawer', 'currency-toggle', 'live-spec-sheet');
    } else if (domain === 'saas' || domain === 'devtool') {
      features.push('interactive-latency-calculator', 'code-sandbox-tabs', 'benchmark-comparison-matrix', 'pricing-tier-switcher');
    } else {
      features.push('asymmetric-showcase', 'interactive-feature-tabs', 'dynamic-contact-drawer');
    }

    if (promptLower.includes('dark') || promptLower.includes('theme') || promptLower.includes('toggle')) {
      features.push('theme-toggle');
    }

    return features;
  }

  /**
   * Step 2: Create Unique Project Specification
   */
  createProjectSpecification(analysis) {
    const { domain, framework, companyName, roleOrSubtitle, summary, requestedFeatures, hasAnimations } = analysis;

    // 1. Design Tokens & Palette (High-contrast, zero generic AI purple blobs)
    let palette = {
      bg: "#090a0f",
      surface: "#10121a",
      surfaceRaised: "#181b26",
      border: "rgba(255, 255, 255, 0.08)",
      borderHover: "rgba(255, 255, 255, 0.25)",
      textPrimary: "#f8fafc",
      textSecondary: "#94a3b8",
      accent: "#38bdf8",
      accentGlow: "rgba(56, 189, 248, 0.15)"
    };

    let fonts = {
      display: "'Space Grotesk', -apple-system, sans-serif",
      body: "'Plus Jakarta Sans', -apple-system, sans-serif",
      mono: "'JetBrains Mono', monospace",
      googleFontsUrl: "https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap"
    };

    if (domain === 'restaurant') {
      palette = {
        bg: "#0c0b0a",
        surface: "#141311",
        surfaceRaised: "#1c1b18",
        border: "rgba(217, 196, 163, 0.12)",
        borderHover: "rgba(217, 196, 163, 0.35)",
        textPrimary: "#f5f2eb",
        textSecondary: "#a8a29e",
        accent: "#d4af37",
        accentGlow: "rgba(212, 175, 55, 0.15)"
      };
      fonts = {
        display: "'Cormorant Garamond', Georgia, serif",
        body: "'Plus Jakarta Sans', sans-serif",
        mono: "'JetBrains Mono', monospace",
        googleFontsUrl: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap"
      };
    } else if (domain === 'agency' || domain === 'portfolio') {
      palette = {
        bg: "#08090c",
        surface: "#0f1117",
        surfaceRaised: "#161922",
        border: "rgba(255, 255, 255, 0.08)",
        borderHover: "rgba(255, 255, 255, 0.3)",
        textPrimary: "#ffffff",
        textSecondary: "#9ca3af",
        accent: "#10b981",
        accentGlow: "rgba(16, 185, 129, 0.15)"
      };
      fonts = {
        display: "'Instrument Serif', Georgia, serif",
        body: "'Inter', -apple-system, sans-serif",
        mono: "'JetBrains Mono', monospace",
        googleFontsUrl: "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
      };
    }

    // 2. Dynamic Section Topology
    const sections = this.buildSectionTopology(domain, companyName, roleOrSubtitle, summary, requestedFeatures);

    return {
      projectName: analysis.projectName,
      domain,
      framework,
      companyName,
      headline: roleOrSubtitle,
      summary,
      hasAnimations,
      palette,
      fonts,
      requestedFeatures,
      sections,
      apiRoutes: [
        { path: 'src/app/api/contact/route.ts', purpose: 'Handles inquiries with RFC 7807 validation' },
        { path: 'src/app/api/data/route.ts', purpose: 'Serves dynamic domain entities & filtering' }
      ]
    };
  }

  /**
   * Helper: Builds domain-specific section hierarchy
   */
  buildSectionTopology(domain, name, headline, summary, features) {
    if (domain === 'portfolio') {
      return [
        { id: 'navbar', component: 'Navbar', title: name, navLinks: ['Projects', 'Console', 'Timeline', 'Contact'] },
        { id: 'hero', component: 'Hero', headline: "Architecting high-order distributed systems & kinetic web platforms.", subheadline: summary, primaryCta: "Explore Selected Works", secondaryCta: "Launch Interactive Shell" },
        { id: 'projects', component: 'ProjectsGrid', title: "Selected Works & Architectures", categories: ["All", "Distributed Systems", "AI & RAG", "Frontend Islands", "Open Source"] },
        { id: 'terminal', component: 'TerminalBio', title: "Interactive Developer Shell", subtitle: "Type `skills`, `architecture`, `experience`, or `contact`" },
        { id: 'experience', component: 'ExperienceTimeline', title: "Career & Technical Milestones" },
        { id: 'contact', component: 'ContactSection', title: "Let's build something exceptional together.", email: "alex@example.com" }
      ];
    } else if (domain === 'restaurant') {
      return [
        { id: 'navbar', component: 'Navbar', title: name, navLinks: ['Tasting Menu', 'Philosophy', 'Private Dining', 'Reservations'] },
        { id: 'hero', component: 'Hero', headline: "Hyper-seasonal gastronomy rooted in botanical exploration.", subheadline: summary, primaryCta: "Reserve a Table", secondaryCta: "View Seasonal Menu" },
        { id: 'tasting-menu', component: 'TastingMenu', title: "Autumn Tasting Course", categories: ["All", "First Course", "Main Course", "Dessert", "Wine Pairings"] },
        { id: 'philosophy', component: 'ChefPhilosophy', title: "From Soil to Plate", quote: "We cook not to impress, but to connect guests with the untamed landscape." },
        { id: 'reservation', component: 'ReservationSection', title: "Join Us at the Table", cta: "Book Reservation" }
      ];
    } else {
      return [
        { id: 'navbar', component: 'Navbar', title: name, navLinks: ['Capabilities', 'Architecture', 'Throughput', 'Contact'] },
        { id: 'hero', component: 'Hero', headline: headline, subheadline: summary, primaryCta: "Launch Interactive Sandbox", secondaryCta: "Explore Specs" },
        { id: 'showcase', component: 'BentoShowcase', title: "Engineered from First Principles", cards: 4 },
        { id: 'interactive', component: 'InteractiveCalculator', title: "Performance ROI Calculator" },
        { id: 'contact', component: 'ContactSection', title: "Deploy Modern Architecture", email: "team@example.com" }
      ];
    }
  }

  /**
   * Step 3: Create Dynamic Task Graph (DAG)
   */
  createTaskGraph(spec) {
    const tasks = [
      {
        id: 'task-plan',
        agentId: 'orchestrator',
        name: 'Project Requirement Analysis & DAG Compilation',
        task: `Deconstruct brief for ${spec.domain.toUpperCase()} project into modular task DAG`,
        skills: ['frontend/nextjs'],
        dependsOn: [],
        status: 'queued'
      },
      {
        id: 'task-design-director',
        agentId: 'creativeDirector',
        name: 'Visual Direction & Anti-AI Guardian Strategy',
        task: `Formulate authentic visual personality, fluid clamp typography, and ban purple gradients & repetitive cards`,
        skills: ['design/ui-design', 'design/typography', 'anti-ai/slop-guardian'],
        dependsOn: ['task-plan'],
        status: 'queued'
      },
      {
        id: 'task-content-strategist',
        agentId: 'contentStrategist',
        name: 'Grounded Technical Copywriting & Domain Data',
        task: `Author bespoke domain fixtures and technical value props with zero placeholder cliché copy`,
        skills: ['content/copywriting', 'backend/data-models'],
        dependsOn: ['task-plan'],
        status: 'queued'
      },
      {
        id: 'task-frontend-scaffold',
        agentId: 'frontend',
        name: 'Next.js 14/15 App Router Scaffolding & Root Layout',
        task: `Synthesize package.json, tsconfig.json, tailwind.config.ts, src/app/layout.tsx, and globals.css`,
        skills: ['frontend/nextjs', 'frontend/react', 'frontend/tailwind'],
        dependsOn: ['task-design-director'],
        status: 'queued'
      },
      {
        id: 'task-frontend-components',
        agentId: 'frontend',
        name: 'Bespoke Asymmetric Section Components & Pages',
        task: `Build src/app/page.tsx and all section components (${spec.sections.map(s => s.component).join(', ')})`,
        skills: ['frontend/nextjs', 'frontend/react', 'design/ui-design'],
        dependsOn: ['task-frontend-scaffold', 'task-content-strategist'],
        status: 'queued'
      },
      {
        id: 'task-backend-routes',
        agentId: 'backend',
        name: 'TypeScript API Route Handlers & Data Contract',
        task: `Synthesize src/app/api/contact/route.ts and src/app/api/data/route.ts with RFC 7807 validation`,
        skills: ['backend/route-handlers', 'backend/data-models'],
        dependsOn: ['task-frontend-scaffold'],
        status: 'queued'
      },
      {
        id: 'task-animation-motion',
        agentId: 'animationSpecialist',
        name: 'Framer Motion Transitions & Interactive Micro-Interactions',
        task: `Add smooth reveal choreography, interactive category filtering, and terminal emulator logic`,
        skills: ['motion/framer-motion', 'motion/micro-interactions'],
        dependsOn: ['task-frontend-components'],
        status: 'queued'
      },
      {
        id: 'task-responsive-specialist',
        agentId: 'responsiveSpecialist',
        name: 'Responsive Viewport Optimization & Layout Integrity',
        task: `Ensure zero horizontal scroll, fluid clamp() font scaling, and touch target sizing`,
        skills: ['quality/responsive-design', 'frontend/accessibility'],
        dependsOn: ['task-frontend-components'],
        status: 'queued'
      },
      {
        id: 'task-qa-visual-critic',
        agentId: 'visualCritic',
        name: 'Anti-AI Rubric Review & Build Verification',
        task: `Audit generated codebase against 6-dimension Anti-AI rubric and verify final threshold >= 8.5/10`,
        skills: ['quality/visual-review', 'quality/browser-testing'],
        dependsOn: ['task-animation-motion', 'task-responsive-specialist', 'task-backend-routes'],
        status: 'queued'
      }
    ];

    return {
      spec,
      tasks
    };
  }
}
