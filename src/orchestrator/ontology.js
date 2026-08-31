/**
 * PIXEL CREW — Universal Software Ontology
 * 
 * Defines the domain-agnostic primitives, grammatical contracts, and schemas of software architecture.
 * The orchestrator owns the software synthesis process, NOT a catalog of application domains.
 * The domain is runtime data.
 */

export const UNIVERSAL_CAPABILITIES = [
  'search',
  'filter',
  'sort',
  'create',
  'edit',
  'delete',
  'view',
  'schedule',
  'calculate',
  'simulate',
  'compare',
  'upload',
  'download',
  'export',
  'authenticate',
  'authorize',
  'approve',
  'reject',
  'assign',
  'track',
  'visualize',
  'collaborate',
  'notify',
  'archive',
  'restore'
];

export const LAYOUT_PRIMITIVES = {
  STACK: 'stack',
  SPLIT: 'split',
  GRID: 'grid',
  OVERLAY: 'overlay',
  WORKSPACE: 'workspace',
  SIDEBAR: 'sidebar',
  INSPECTOR: 'inspector',
  CANVAS: 'canvas',
  TIMELINE: 'timeline',
  SEQUENCE: 'sequence',
  NESTED: 'nested',
  FREEFORM: 'freeform'
};

export const UI_PRIMITIVES = {
  COLLECTION: 'collection',
  TABLE: 'table',
  FORM: 'form',
  TIMELINE: 'timeline',
  CALENDAR: 'calendar',
  BOARD: 'board',
  CANVAS: 'canvas',
  INSPECTOR: 'inspector',
  WORKSPACE: 'workspace',
  MODAL: 'modal',
  DRAWER: 'drawer',
  SEARCH: 'search',
  FILTER: 'filter',
  PAGINATION: 'pagination',
  VISUALIZATION: 'visualization'
};

export const OPERATION_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

export const REQUIREMENT_CATEGORIES = {
  WORKFLOW: 'workflow',
  UI_COMPONENT: 'ui_component',
  API_ENDPOINT: 'api_endpoint',
  DATA_MODEL: 'data_model',
  SECURITY: 'security',
  PERFORMANCE: 'performance',
  DESIGN_QUALITY: 'design_quality'
};

export class UniversalSoftwareOntology {
  /**
   * Validate & Normalize Project Definition
   */
  static validateProject(project) {
    if (!project || typeof project !== 'object') {
      throw new Error('Project definition must be a valid object.');
    }
    return {
      name: String(project.name || 'Universal Application').trim(),
      description: String(project.description || 'Open-world synthesized software application').trim(),
      domain: String(project.domain || 'general-software').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      goals: Array.isArray(project.goals) ? project.goals.map(String) : []
    };
  }

  /**
   * Validate & Normalize Actor Definition
   */
  static validateActor(actor, index = 0) {
    if (!actor || typeof actor !== 'object') {
      return {
        id: `actor-${index + 1}`,
        name: 'User',
        role: 'Primary Operator',
        capabilities: ['view', 'create', 'search'],
        permissions: ['read', 'write']
      };
    }
    const name = String(actor.name || `Actor ${index + 1}`).trim();
    const id = actor.id || `actor-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || (index + 1)}`;
    return {
      id,
      name,
      role: String(actor.role || name).trim(),
      capabilities: Array.isArray(actor.capabilities) ? actor.capabilities.map(String) : ['view', 'search'],
      permissions: Array.isArray(actor.permissions) ? actor.permissions.map(String) : ['read']
    };
  }

  /**
   * Validate & Normalize Entity Definition
   */
  static validateEntity(entity, index = 0) {
    if (!entity || typeof entity !== 'object' || !entity.name) {
      throw new Error(`Entity at index ${index} must have a valid string name.`);
    }
    const cleanName = String(entity.name).replace(/[^a-zA-Z0-9]/g, '');
    if (!cleanName) {
      throw new Error(`Entity name '${entity.name}' contains no alphanumeric characters.`);
    }
    const id = entity.id || `entity-${cleanName.toLowerCase()}`;
    const title = entity.title || cleanName;
    const plural = String(entity.plural || `${cleanName}s`).trim();
    const description = String(entity.description || `Domain entity representing ${cleanName}`).trim();

    const fields = Array.isArray(entity.fields) && entity.fields.length > 0
      ? entity.fields.map((f, fi) => this.normalizeField(f, fi))
      : [
        { name: 'id', type: 'string', required: true, label: 'ID', sampleValue: `${id}-001` },
        { name: 'name', type: 'string', required: true, label: 'Name', sampleValue: `Sample ${cleanName}` },
        { name: 'status', type: 'string', required: false, label: 'Status', sampleValue: 'Active' },
        { name: 'createdAt', type: 'datetime', required: true, label: 'Created At', sampleValue: '2026-08-31T00:00:00.000Z' }
      ];

    const relationships = Array.isArray(entity.relationships)
      ? entity.relationships.map(r => this.normalizeRelationship(r, cleanName))
      : [];

    const constraints = Array.isArray(entity.constraints) ? entity.constraints.map(String) : [];
    const seedData = Array.isArray(entity.seedData) ? entity.seedData : [];

    return {
      id,
      name: cleanName,
      title,
      plural,
      description,
      fields,
      relationships,
      constraints,
      seedData
    };
  }

  /**
   * Normalize an individual Field definition
   */
  static normalizeField(field, index = 0) {
    if (typeof field === 'string') {
      const isNum = /(count|price|depth|size|age|rating|score|amount|total|latitude|longitude|index|duration|tokens|ms|speed)/i.test(field);
      const isDate = /(date|time|at|created|updated|scheduled|timestamp)/i.test(field);
      const isBool = /(is|has|enabled|active|completed|verified)/i.test(field);
      const type = field === 'id' ? 'string' : (isNum ? 'number' : (isDate ? 'datetime' : (isBool ? 'boolean' : 'string')));
      return {
        name: field,
        type,
        required: field === 'id' || field === 'name',
        label: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1'),
        sampleValue: isNum ? 100 : (isDate ? '2026-08-31T12:00:00.000Z' : (isBool ? true : `Sample ${field}`))
      };
    }
    const name = String(field.name || `field_${index + 1}`).trim();
    const type = String(field.type || 'string').toLowerCase();
    const required = Boolean(field.required ?? (name === 'id' || name === 'name'));
    const label = String(field.label || name.charAt(0).toUpperCase() + name.slice(1)).trim();
    let sampleValue = field.sampleValue;
    if (sampleValue === undefined) {
      if (type === 'number') sampleValue = 42;
      else if (type === 'boolean') sampleValue = true;
      else if (type === 'datetime') sampleValue = '2026-08-31T12:00:00.000Z';
      else sampleValue = `Sample ${label}`;
    }
    return {
      name,
      type,
      required,
      label,
      sampleValue
    };
  }

  /**
   * Normalize an Entity Relationship
   */
  static normalizeRelationship(rel, sourceEntity) {
    if (typeof rel === 'string') {
      return {
        type: 'belongsTo',
        targetEntity: rel.replace(/[^a-zA-Z0-9]/g, ''),
        foreignKey: `${rel.toLowerCase()}Id`
      };
    }
    return {
      type: rel.type || 'hasMany',
      targetEntity: String(rel.targetEntity || rel.target || 'Entity').replace(/[^a-zA-Z0-9]/g, ''),
      foreignKey: rel.foreignKey || (rel.type === 'belongsTo' ? `${(rel.targetEntity || 'entity').toLowerCase()}Id` : undefined),
      cardinality: rel.cardinality || (rel.type === 'hasMany' ? '1:N' : 'N:1')
    };
  }

  /**
   * Validate & Normalize Workflow Definition
   */
  static validateWorkflow(wf, index = 0) {
    if (!wf || typeof wf !== 'object') {
      return {
        id: `workflow-${index + 1}`,
        name: `Workflow ${index + 1}`,
        actor: 'User',
        trigger: 'Manual Action',
        steps: ['Initiate', 'Process', 'Complete'],
        outcome: 'Completed'
      };
    }
    const name = String(wf.name || `Workflow ${index + 1}`).trim();
    const id = wf.id || `workflow-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || (index + 1)}`;
    return {
      id,
      name,
      actor: String(wf.actor || 'User').trim(),
      trigger: String(wf.trigger || 'Action Triggered').trim(),
      steps: Array.isArray(wf.steps) ? wf.steps.map(String) : ['Execute action', 'Record state'],
      outcome: String(wf.outcome || 'Workflow completed').trim()
    };
  }

  /**
   * Validate & Normalize View Definition
   */
  static validateView(view, entities = [], index = 0) {
    if (!view || typeof view !== 'object') {
      const fallbackEntity = entities[0] ? entities[0].name : 'Item';
      return {
        id: `view-${index + 1}`,
        componentName: `${fallbackEntity}Overview`,
        title: `${fallbackEntity} Overview`,
        purpose: `Browse and manage ${fallbackEntity} records`,
        targetEntities: [fallbackEntity],
        layout: { type: LAYOUT_PRIMITIVES.GRID, density: 'comfortable' },
        regions: [
          { role: 'navigation', components: ['search', 'filter'] },
          { role: 'content', components: ['collection'] }
        ],
        capabilities: ['search', 'filter', 'view']
      };
    }
    const rawTitle = String(view.title || view.name || `View ${index + 1}`).trim();
    const cleanComp = (view.componentName || rawTitle).replace(/[^a-zA-Z0-9]/g, '');
    const componentName = cleanComp.charAt(0).toUpperCase() + cleanComp.slice(1) || `DynamicView${index + 1}`;
    const id = view.id || `view-${componentName.toLowerCase()}`;
    const targetEntities = Array.isArray(view.targetEntities) && view.targetEntities.length > 0
      ? view.targetEntities.map(e => String(e).replace(/[^a-zA-Z0-9]/g, ''))
      : (view.targetEntity ? [String(view.targetEntity).replace(/[^a-zA-Z0-9]/g, '')] : (entities[0] ? [entities[0].name] : ['System']));

    const layout = typeof view.layout === 'object' && view.layout !== null
      ? view.layout
      : { type: LAYOUT_PRIMITIVES.GRID, density: 'comfortable' };

    const regions = Array.isArray(view.regions) ? view.regions : [
      { role: 'navigation', components: ['search', 'filter'] },
      { role: 'content', components: ['collection'] }
    ];

    const capabilities = Array.isArray(view.capabilities) ? view.capabilities.map(String) : ['view', 'search', 'filter'];

    return {
      id,
      componentName,
      title: rawTitle,
      purpose: String(view.purpose || `Interactive interface for ${rawTitle}`).trim(),
      targetEntities,
      layout,
      regions,
      capabilities
    };
  }

  /**
   * Validate & Normalize Operation Definition
   */
  static validateOperation(op, entities = [], index = 0) {
    if (!op || typeof op !== 'object') {
      const ent = entities[0] ? entities[0].name : 'Resource';
      return {
        id: `operation-${index + 1}`,
        path: `/api/${ent.toLowerCase()}s`,
        method: OPERATION_METHODS.GET,
        description: `List ${ent} records`,
        targetEntity: ent,
        requestFields: [],
        responseFields: [],
        authorization: 'none'
      };
    }
    const path = String(op.path || '/api/resource').startsWith('/') ? String(op.path || '/api/resource') : `/${op.path}`;
    const method = Object.values(OPERATION_METHODS).includes(String(op.method).toUpperCase())
      ? String(op.method).toUpperCase()
      : OPERATION_METHODS.GET;
    const targetEntity = String(op.targetEntity || (entities[0] ? entities[0].name : 'Entity')).replace(/[^a-zA-Z0-9]/g, '');
    const id = op.id || `op-${method.toLowerCase()}-${path.replace(/[^a-zA-Z0-9]/g, '-')}`;

    return {
      id,
      path,
      method,
      description: String(op.description || `Execute ${method} on ${path}`).trim(),
      targetEntity,
      requestFields: Array.isArray(op.requestFields) ? op.requestFields.map(String) : [],
      responseFields: Array.isArray(op.responseFields) ? op.responseFields.map(String) : [],
      authorization: String(op.authorization || 'none')
    };
  }

  /**
   * Validate & Normalize Event Definition
   */
  static validateEvent(evt, index = 0) {
    if (!evt || typeof evt !== 'object') {
      return {
        id: `event-${index + 1}`,
        name: `Event${index + 1}`,
        source: 'System',
        payload: { timestamp: 'datetime' },
        consumers: ['AuditLogger']
      };
    }
    const name = String(evt.name || `Event${index + 1}`).replace(/[^a-zA-Z0-9]/g, '');
    return {
      id: evt.id || `event-${name.toLowerCase()}`,
      name,
      source: String(evt.source || 'System').trim(),
      payload: typeof evt.payload === 'object' && evt.payload !== null ? evt.payload : {},
      consumers: Array.isArray(evt.consumers) ? evt.consumers.map(String) : []
    };
  }

  /**
   * Validate & Normalize Requirement Definition
   */
  static validateRequirement(req, index = 0) {
    if (!req || typeof req !== 'object') {
      return {
        id: `REQ-${String(index + 1).padStart(3, '0')}`,
        category: REQUIREMENT_CATEGORIES.WORKFLOW,
        target: 'system',
        description: 'System requirement',
        acceptanceCriteria: ['Requirement fulfilled'],
        priority: 'high'
      };
    }
    const id = req.id || `REQ-${String(index + 1).padStart(3, '0')}`;
    const category = Object.values(REQUIREMENT_CATEGORIES).includes(req.category)
      ? req.category
      : REQUIREMENT_CATEGORIES.WORKFLOW;
    return {
      id,
      category,
      target: String(req.target || 'system').trim(),
      description: String(req.description || `Requirement ${id}`).trim(),
      acceptanceCriteria: Array.isArray(req.acceptanceCriteria) && req.acceptanceCriteria.length > 0
        ? req.acceptanceCriteria.map(String)
        : ['Functionality implemented and verified'],
      priority: ['critical', 'high', 'medium', 'low'].includes(req.priority) ? req.priority : 'high'
    };
  }
}
