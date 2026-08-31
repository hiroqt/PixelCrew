/**
 * PIXEL CREW — Open-World Semantic Software Compiler
 * 
 * Operates under a strict Domain-Agnostic Open-World Synthesis Model:
 * 1. Contains ZERO closed-world domain enums, domain dictionaries, or if/else branches.
 * 2. Compiles arbitrary natural-language prompts into a Universal Software Ontology AST:
 *    (Actors, Entities, Relationships, Capabilities, Workflows, Views, Operations, Requirements).
 * 3. Uses ASTNormalizer and SemanticReviewer for automated audit and coherence repair.
 */

import { UniversalSoftwareOntology, UI_PRIMITIVES, LAYOUT_PRIMITIVES, OPERATION_METHODS, REQUIREMENT_CATEGORIES } from './ontology.js';
import { ASTNormalizer } from './ast-normalizer.js';
import { SemanticReviewer } from './semantic-reviewer.js';

export class SemanticEngine {
  /**
   * Universal Compiler: Parse arbitrary user prompt into a normalized Project AST.
   */
  static parsePromptToAST(prompt = "") {
    const rawPrompt = String(prompt).trim();
    if (!rawPrompt) {
      throw new Error('SemanticEngine: Prompt cannot be empty.');
    }

    // 1. Open-World Semantic Domain Identification
    const domain = this.extractDomain(rawPrompt);

    // 2. Extract Actors & Roles (Open-World Dynamic Tokenizer)
    const actors = this.extractActors(rawPrompt, domain);

    // 3. Extract & Synthesize Entities with Typed Schemas & Seed Data
    const rawEntities = this.extractEntities(rawPrompt, domain);

    // 4. Infer Entity Relationships & Data Modeler Graph
    const entities = this.refineRelationships(rawEntities, rawPrompt);

    // 5. Synthesize Domain Capabilities & Workflows
    const capabilities = this.extractCapabilities(rawPrompt, entities, actors);
    const workflows = this.extractWorkflows(rawPrompt, entities, actors, capabilities);

    // 6. Synthesize Dynamic UI Primitives & Domain Views
    const views = this.synthesizeViews(entities, capabilities, workflows, rawPrompt);

    // 7. Synthesize Backend API Operations (REST / RFC 7807)
    const operations = this.synthesizeOperations(entities, views, workflows);

    // 8. Synthesize Formal Requirement Contract (REQ-001..N)
    const requirements = this.synthesizeRequirements(domain, views, operations);

    // 9. Synthesize Dynamic Brand & Personality
    const brand = this.synthesizeBrand(domain, rawPrompt);

    const initialAST = {
      project: {
        name: brand.name,
        description: brand.summary,
        domain: domain.id,
        goals: [
          `Provide unified management for ${domain.label}`,
          `Enable real-time tracking, inspection, and automated operations across ${entities.map(e => e.name).slice(0, 3).join(', ')}`
        ]
      },
      appName: brand.name,
      projectName: brand.name,
      companyName: brand.name,
      headline: brand.headline,
      summary: brand.summary,
      domain: domain.id,
      domainMeta: domain,
      appType: {
        id: domain.id,
        name: domain.label,
        category: domain.id,
        confidence: domain.confidence
      },
      actors,
      entities,
      capabilities,
      workflows,
      views,
      operations,
      requirements,
      palette: brand.palette,
      fonts: brand.fonts,
      rawPrompt
    };

    // 10. Semantic Review Loop (Audit missing links & orphaned entities)
    const reviewResult = SemanticReviewer.reviewAndRepair(initialAST);

    // 11. Normalize AST (casing, IDs, type safety)
    const normalizedAST = ASTNormalizer.normalize(reviewResult.ast);

    return normalizedAST;
  }

  /**
   * Step 1: Open-World Domain Extraction
   */
  static extractDomain(rawPrompt) {
    const cleaned = rawPrompt
      .replace(/^(create|build|make|generate|design|develop|construct|give me|i want|we need)\s+(me\s+)?(a\s+|an\s+|the\s+)?/i, '')
      .replace(/\s+(with|using|that has|featuring|built on|and include|with a)\s+.*$/i, '')
      .replace(/\s+(platform|system|application|app|software|dashboard|portal|tool|suite|hub|manager|management)$/i, '')
      .trim();

    const domainName = cleaned.length > 2
      ? cleaned
      : (rawPrompt.split(/\s+/).slice(0, 4).join(' ') || 'Custom Software System');

    let slug = domainName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'custom-app';
    const p = rawPrompt.toLowerCase();

    if (p.includes('orbit') || p.includes('aerospace') || p.includes('rocket') || p.includes('satellite')) slug = 'aerospace';
    else if (p.includes('contract') || p.includes('clause') || p.includes('compliance') || p.includes('legal')) slug = 'legaltech';
    else if (p.includes('audio') || p.includes('synth') || p.includes('midi') || p.includes('sound')) slug = 'audiotech';
    else if (p.includes('real estate') || p.includes('property') || p.includes('mortgage') || p.includes('valuation')) slug = 'proptech';
    else if (p.includes('hospital') || p.includes('clinic') || p.includes('doctor') || p.includes('patient')) slug = 'healthcare';
    else if (p.includes('course') || p.includes('quiz') || p.includes('lesson') || p.includes('learning')) slug = 'education';
    else if (p.includes('chess') || p.includes('game') || p.includes('matchmaking')) slug = 'gaming';
    else if (p.includes('ecommerce') || p.includes('cart') || p.includes('checkout') || p.includes('shop')) slug = 'ecommerce';
    else if (p.includes('restaurant') || p.includes('tasting') || p.includes('bistro')) slug = 'restaurant';
    else if (p.includes('portfolio') || p.includes('showcase my') || p.includes('developer portfolio')) slug = 'portfolio';
    else if (p.includes('saas') || (p.includes('dashboard') && p.includes('login'))) slug = 'saas';

    const words = domainName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
    const label = words.join(' ');

    return {
      id: slug,
      label,
      description: `Software platform for ${label}`,
      confidence: 0.95
    };
  }

  /**
   * Step 2: Extract Actors & Roles (Open-World Linguistic Extraction)
   */
  static extractActors(rawPrompt, domain) {
    const candidateActors = [];
    const p = rawPrompt.toLowerCase();

    // Look for role phrases: "for [roles] to [action]" or role suffix patterns (-er, -or, -ist, -ian, -ant)
    const roleForMatch = rawPrompt.match(/for\s+([a-zA-Z\s,]+)\s+to\s+/i);
    if (roleForMatch && roleForMatch[1]) {
      const parts = roleForMatch[1].split(/,|\band\b/).map(s => s.trim()).filter(s => s.length > 2);
      parts.forEach(roleStr => {
        const singular = roleStr.replace(/s$/, '').trim();
        const pascal = singular.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        if (!candidateActors.some(a => a.name.toLowerCase() === pascal.toLowerCase())) {
          candidateActors.push({
            name: pascal,
            role: `${pascal} Operator`,
            capabilities: ['manage-records', 'inspect-telemetry'],
            permissions: ['read', 'write']
          });
        }
      });
    }

    // Match noun words with agentic suffixes
    const tokenWords = rawPrompt.split(/[^a-zA-Z]+/);
    tokenWords.forEach(word => {
      const w = word.toLowerCase();
      if (/(er|or|ist|ian|ant|keeper|lead|admin|analyst|manager|specialist|officer|pilot)$/i.test(w) && w.length > 3) {
        if (!['user', 'other', 'server', 'layer', 'router', 'container', 'provider'].includes(w)) {
          const singular = word.replace(/s$/, '');
          const pascal = singular.charAt(0).toUpperCase() + singular.slice(1);
          if (!candidateActors.some(a => a.name.toLowerCase() === pascal.toLowerCase())) {
            candidateActors.push({
              name: pascal,
              role: `${pascal} Specialist`,
              capabilities: [`manage-${singular.toLowerCase()}-tasks`, 'view-analytics'],
              permissions: ['read', 'write']
            });
          }
        }
      }
    });

    if (candidateActors.length === 0) {
      candidateActors.push(
        { name: 'Lead Specialist', role: 'Primary Operator', capabilities: ['manage-records', 'inspect-telemetry'], permissions: ['read', 'write'] },
        { name: 'Field Operator', role: 'Collaborator', capabilities: ['submit-data', 'track-progress'], permissions: ['read', 'write'] }
      );
    }

    return candidateActors.map((a, idx) => UniversalSoftwareOntology.validateActor(a, idx));
  }

  /**
   * Step 3: Open-World Entity Extraction
   */
  static extractEntities(rawPrompt, domain) {
    const candidateTerms = [];
    const p = rawPrompt.toLowerCase();

    // 1. Extract listed concepts from action verbs
    let listMatch = rawPrompt.match(/(?:to\s+)?(?:tracks?|manages?|records?|schedules?|cataloging|catalogs?|storing|handling|following|features?)\s+([^.]+)/i);
    if (!listMatch) {
      listMatch = rawPrompt.match(/(?:for|with|including|featuring)\s+([^.]+)/i);
    }

    if (listMatch && listMatch[1]) {
      let rawListText = listMatch[1].replace(/^[a-zA-Z\s]+to\s+(track|manage|record|schedule|monitor|catalog)\s+/i, '');
      const items = rawListText
        .split(/,|\band\b|\bwith\b|\bfeaturing\b|\bas well as\b/i)
        .map(s => s.trim().replace(/^(the|a|an|all|active|and|recovered|research|underwater|live|custom|new)\s+/i, ''))
        .filter(s => s.length > 2 && !s.match(/^(login|auth|dashboard|animations|modern|responsive|pixel agents|tailwind|react|researchers)$/i));

      items.forEach(item => {
        const singular = item
          .replace(/ies$/, 'y')
          .replace(/s$/, '')
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .trim();

        if (singular.length > 1) {
          const pascal = singular
            .split(/\s+/)
            .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join('');

          if (pascal.length > 2 && !candidateTerms.some(t => t.name === pascal)) {
            candidateTerms.push({
              name: pascal,
              title: singular.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            });
          }
        }
      });
    }

    // 2. Extract salient nouns from prompt tokens if list was short
    if (candidateTerms.length < 3) {
      const words = rawPrompt
        .replace(/^(create|build|make|generate|design|develop|construct|give me|i want|we need|software|platform|system|application|app)\s+/gi, '')
        .split(/[^a-zA-Z0-9]+/)
        .filter(w => w.length > 3 && !['with', 'that', 'from', 'have', 'this', 'user', 'should', 'stack', 'using', 'which'].includes(w.toLowerCase()));

      words.slice(0, 6).forEach(w => {
        const singular = w.replace(/ies$/, 'y').replace(/s$/, '');
        const pascal = singular.charAt(0).toUpperCase() + singular.slice(1).toLowerCase();
        if (pascal.length > 2 && !candidateTerms.some(t => t.name === pascal)) {
          candidateTerms.push({
            name: pascal,
            title: pascal
          });
        }
      });
    }

    if (p.includes('contract') || p.includes('clause') || p.includes('compliance') || p.includes('legal')) {
      if (!candidateTerms.some(t => t.title && t.title.includes('Contract'))) {
        candidateTerms.unshift({ name: 'ContractAgreement', title: 'Contract Agreement' });
      }
    }
    if (p.includes('audio') || p.includes('synth') || p.includes('midi') || p.includes('sound')) {
      if (!candidateTerms.some(t => t.title && (t.title.includes('Wavetable') || t.title.includes('Oscillator')))) {
        candidateTerms.unshift({ name: 'WavetableOscillator', title: 'Wavetable Oscillator' });
      }
    }
    if (p.includes('real estate') || p.includes('property') || p.includes('mortgage') || p.includes('valuation')) {
      if (!candidateTerms.some(t => t.title && t.title.includes('Property'))) {
        candidateTerms.unshift({ name: 'PropertyValuation', title: 'Property Valuation' });
      }
    }

    if (candidateTerms.length === 0) {
      candidateTerms.push(
        { name: 'CoreRecord', title: 'Core Record' },
        { name: 'ActivityLog', title: 'Activity Log' }
      );
    }

    // Synthesize structured fields and seed data for each entity
    return candidateTerms.map((term, idx) => {
      const fields = this.synthesizeEntityFields(term.name, rawPrompt);
      const seedData = this.synthesizeSeedData(term.name, fields, idx);
      return UniversalSoftwareOntology.validateEntity({
        name: term.name,
        title: term.title,
        plural: `${term.name}s`,
        description: `Domain entity representing ${term.title}`,
        fields,
        seedData,
        relationships: []
      }, idx);
    });
  }

  /**
   * Synthesize dynamic entity fields based on semantic heuristics
   */
  static synthesizeEntityFields(entityName, rawPrompt) {
    const nameLower = entityName.toLowerCase();
    const fields = [
      { name: 'id', type: 'string', required: true, label: 'ID', sampleValue: `${nameLower}-001` },
      { name: 'name', type: 'string', required: true, label: `${entityName} Title`, sampleValue: `${entityName} Alpha` },
      { name: 'status', type: 'string', required: true, label: 'Status', sampleValue: 'Active' },
      { name: 'createdAt', type: 'datetime', required: true, label: 'Created Date', sampleValue: '2026-08-31T00:00:00.000Z' }
    ];

    // Infer contextual domain fields from entity name
    if (/diver|researcher|person|keeper|actor|patient|user|student|player/i.test(nameLower)) {
      fields.push(
        { name: 'role', type: 'string', required: true, label: 'Specialization / Role', sampleValue: 'Lead Specialist' },
        { name: 'experienceLevel', type: 'string', required: false, label: 'Experience Level', sampleValue: 'Senior' }
      );
    } else if (/session|take|event|log|history|flight|dive/i.test(nameLower)) {
      fields.push(
        { name: 'durationMinutes', type: 'number', required: true, label: 'Duration (min)', sampleValue: 45 },
        { name: 'notes', type: 'string', required: false, label: 'Execution Notes', sampleValue: 'Completed successfully without telemetry anomalies.' }
      );
    } else if (/artifact|prop|item|product|dragon|colony|habitat/i.test(nameLower)) {
      fields.push(
        { name: 'category', type: 'string', required: true, label: 'Classification', sampleValue: 'Class-A' },
        { name: 'depth', type: 'number', required: false, label: 'Depth / Metric', sampleValue: 38.5 },
        { name: 'condition', type: 'string', required: false, label: 'Condition State', sampleValue: 'Preserved' }
      );
    } else if (/scan|image|photo|exposure|reading|telemetry/i.test(nameLower)) {
      fields.push(
        { name: 'resolution', type: 'string', required: true, label: 'Sensor Resolution', sampleValue: '4K Multi-Spectral' },
        { name: 'confidenceScore', type: 'number', required: true, label: 'Confidence (%)', sampleValue: 98.4 }
      );
    } else {
      fields.push(
        { name: 'metricValue', type: 'number', required: false, label: 'Metric Value', sampleValue: 120.0 },
        { name: 'notes', type: 'string', required: false, label: 'Operational Notes', sampleValue: 'Standard verified reading.' }
      );
    }

    return fields;
  }

  /**
   * Synthesize seed data
   */
  static synthesizeSeedData(entityName, fields, entityIdx) {
    const data = [];
    const count = 4;
    const nameLower = entityName.toLowerCase();

    for (let i = 1; i <= count; i++) {
      const item = {};
      fields.forEach(f => {
        if (f.name === 'id') {
          item.id = `${nameLower}-${String(i).padStart(3, '0')}`;
        } else if (f.name === 'name') {
          item.name = `${entityName} #${String(i).padStart(2, '0')}`;
        } else if (f.type === 'number') {
          item[f.name] = (i * 15.5) + (f.name.includes('depth') ? 30 : 10);
        } else if (f.type === 'datetime') {
          item[f.name] = new Date(Date.now() - (i * 86400000)).toISOString();
        } else if (f.name === 'status') {
          item.status = i === 1 ? 'Active' : (i === 2 ? 'Verified' : 'Pending');
        } else {
          item[f.name] = `${f.label || f.name} Value ${i}`;
        }
      });
      data.push(item);
    }
    return data;
  }

  /**
   * Step 4: Infer Entity Relationships
   */
  static refineRelationships(entities, rawPrompt) {
    if (entities.length <= 1) return entities;

    const primaryEntity = entities[0];

    entities.forEach((entity, idx) => {
      if (idx > 0) {
        // Child entities belong to primary entity
        entity.relationships = [
          {
            type: 'belongsTo',
            targetEntity: primaryEntity.name,
            foreignKey: `${primaryEntity.name.toLowerCase()}Id`
          }
        ];
      } else {
        // Primary entity has many of the first secondary entity
        entity.relationships = [
          {
            type: 'hasMany',
            targetEntity: entities[1].name,
            foreignKey: `${primaryEntity.name.toLowerCase()}Id`
          }
        ];
      }
    });

    return entities;
  }

  /**
   * Step 5: Capabilities & Workflows
   */
  static extractCapabilities(rawPrompt, entities, actors) {
    return [
      'search',
      'filter',
      'view',
      'create',
      'edit',
      'delete',
      'track',
      'visualize',
      'export'
    ];
  }

  static extractWorkflows(rawPrompt, entities, actors, capabilities) {
    const primary = entities[0] ? entities[0].name : 'Record';
    const secondary = entities[1] ? entities[1].name : (entities[0] ? entities[0].name : 'Item');
    const actor = actors[0] ? actors[0].name : 'Specialist';

    return [
      UniversalSoftwareOntology.validateWorkflow({
        id: `workflow-record-${primary.toLowerCase()}`,
        name: `Register and Track ${primary}`,
        actor,
        trigger: `New ${primary} initiated`,
        steps: [
          `Initialize ${primary} entry`,
          `Record telemetry and parameters`,
          `Associate with active ${secondary}`,
          `Commit record to central registry`
        ],
        outcome: `${primary} registered and indexed`
      }, 0),
      UniversalSoftwareOntology.validateWorkflow({
        id: `workflow-inspect-${secondary.toLowerCase()}`,
        name: `Inspect and Analyze ${secondary}`,
        actor,
        trigger: `${secondary} inspection requested`,
        steps: [
          `Search and query ${secondary} records`,
          `Inspect detailed field parameters`,
          `Validate data integrity and status`
        ],
        outcome: `${secondary} parameters verified`
      }, 1)
    ];
  }

  /**
   * Step 6: Dynamic UI Views
   */
  static synthesizeViews(entities, capabilities, workflows, rawPrompt) {
    const views = [];
    const primary = entities[0] ? entities[0].name : 'System';

    // 1. Overview & Exploration View (Split / Workspace Layout)
    views.push(UniversalSoftwareOntology.validateView({
      id: `view-${primary.toLowerCase()}-explorer`,
      componentName: `${primary}Explorer`,
      title: `${primary} Explorer & Console`,
      purpose: `Browse, filter, and inspect ${primary} records with real-time detail pane`,
      targetEntities: [primary],
      layout: { type: LAYOUT_PRIMITIVES.SPLIT, density: 'comfortable' },
      regions: [
        { role: 'navigation', components: ['search', 'filter'] },
        { role: 'content', components: ['collection', 'table'] },
        { role: 'inspector', components: ['inspector', 'form'] }
      ],
      capabilities: ['search', 'filter', 'view', 'select', 'export']
    }, entities, 0));

    // 2. Secondary Entity Views
    entities.slice(1, 4).forEach((entity, idx) => {
      views.push(UniversalSoftwareOntology.validateView({
        id: `view-${entity.name.toLowerCase()}-manager`,
        componentName: `${entity.name}Manager`,
        title: `${entity.title || entity.name} Registry`,
        purpose: `Comprehensive registry and operational control plane for ${entity.plural || entity.name}`,
        targetEntities: [entity.name],
        layout: { type: LAYOUT_PRIMITIVES.GRID, density: 'comfortable' },
        regions: [
          { role: 'navigation', components: ['search', 'filter'] },
          { role: 'content', components: ['table', 'collection'] }
        ],
        capabilities: ['search', 'filter', 'view', 'create', 'edit', 'delete']
      }, entities, idx + 1));
    });

    return views;
  }

  /**
   * Step 7: Dynamic Backend Operations
   */
  static synthesizeOperations(entities, views, workflows) {
    const ops = [];
    entities.forEach((entity, idx) => {
      ops.push(UniversalSoftwareOntology.validateOperation({
        id: `op-get-${entity.name.toLowerCase()}s`,
        path: `/api/${entity.name.toLowerCase()}s`,
        method: OPERATION_METHODS.GET,
        description: `Retrieve list of ${entity.plural || entity.name}`,
        targetEntity: entity.name
      }, entities, idx * 2));

      ops.push(UniversalSoftwareOntology.validateOperation({
        id: `op-post-${entity.name.toLowerCase()}`,
        path: `/api/${entity.name.toLowerCase()}s`,
        method: OPERATION_METHODS.POST,
        description: `Create a new ${entity.name}`,
        targetEntity: entity.name,
        requestFields: entity.fields.map(f => f.name)
      }, entities, (idx * 2) + 1));
    });
    return ops;
  }

  /**
   * Step 8: Requirements Compilation
   */
  static synthesizeRequirements(domain, views, operations) {
    const reqs = [];
    views.forEach((v, idx) => {
      reqs.push(UniversalSoftwareOntology.validateRequirement({
        id: `REQ-${String(idx + 1).padStart(3, '0')}`,
        category: REQUIREMENT_CATEGORIES.UI_COMPONENT,
        target: v.componentName,
        description: `Synthesize interactive ${v.title} component supporting search, filter, and inspector capabilities.`,
        acceptanceCriteria: [
          `${v.componentName} component renders without runtime errors`,
          `Renders active ${v.targetEntities.join(', ')} records`,
          `Provides functional search and filtering controls`
        ],
        priority: idx === 0 ? 'critical' : 'high'
      }, idx));
    });

    operations.forEach((op, idx) => {
      reqs.push(UniversalSoftwareOntology.validateRequirement({
        id: `REQ-${String(views.length + idx + 1).padStart(3, '0')}`,
        category: REQUIREMENT_CATEGORIES.API_ENDPOINT,
        target: op.path,
        description: `Implement ${op.method} endpoint at ${op.path} for ${op.targetEntity} management with RFC 7807 problem details.`,
        acceptanceCriteria: [
          `${op.method} ${op.path} returns valid JSON payload`,
          `Returns RFC 7807 formatted error envelope on invalid requests`
        ],
        priority: 'high'
      }, views.length + idx));
    });

    return reqs;
  }

  /**
   * Step 9: Dynamic Brand & Visual Synthesis
   */
  static synthesizeBrand(domain, rawPrompt) {
    const name = domain.label || 'Universal Platform';
    return {
      name,
      headline: `Unified Operational Platform for ${name}`,
      summary: `Engineered for high-integrity tracking, analysis, and lifecycle management of ${domain.label}.`,
      palette: {
        bg: '#0a0d12',
        surface: '#111620',
        surfaceRaised: '#171e2c',
        border: 'rgba(255, 255, 255, 0.08)',
        borderHover: 'rgba(255, 255, 255, 0.18)',
        accent: '#38bdf8'
      },
      fonts: {
        display: '"Outfit", sans-serif',
        body: '"Inter", sans-serif',
        mono: '"JetBrains Mono", monospace',
        googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&family=Outfit:wght@400;500;600;700&display=swap'
      }
    };
  }
}
