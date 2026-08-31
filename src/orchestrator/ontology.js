/**
 * PIXEL CREW — Universal Software Ontology
 * 
 * Defines the domain-agnostic primitives and grammar of software architecture.
 * The system never contains hardcoded domain knowledge; instead, it uses
 * these formal software constructs to model any arbitrary software application at runtime.
 */

export const UI_PRIMITIVES = {
  CATALOG: 'catalog',       // Card grid, search, multi-filter, detail preview
  TABLE: 'table',           // Tabular data, sortable columns, row selection, metrics
  FORM: 'form',             // Input fields, validation, submit action, async dispatch
  CALENDAR: 'calendar',     // Date/slot selector, time schedule, booking status
  TIMELINE: 'timeline',     // Chronological feed, activity log, event sequence
  BOARD: 'board',           // Kanban / stage columns, turn-based board, drag/move states
  MATRIX: 'matrix',         // Telemetry stats, KPI cards, analytical indicators
  WORKSPACE: 'workspace',   // Interactive editor, execution runner, live sandbox
  MODAL: 'modal',           // Dialog overlay, confirm actions, popover detail
  DRAWER: 'drawer',         // Slide-over cart, inspector panel, side drawer
  RUNNER: 'runner'          // Step-by-step progress, quiz/assessment, simulation engine
};

export const OPERATION_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE'
};

export const REQUIREMENT_CATEGORIES = {
  UI_COMPONENT: 'UI_COMPONENT',
  API_ENDPOINT: 'API_ENDPOINT',
  DATA_MODEL: 'DATA_MODEL',
  WORKFLOW: 'WORKFLOW',
  DESIGN_QUALITY: 'DESIGN_QUALITY'
};

export class UniversalSoftwareOntology {
  /**
   * Validate that an entity definition conforms to the ontology schema.
   */
  static validateEntity(entity) {
    if (!entity || typeof entity.name !== 'string') {
      throw new Error('Entity must have a valid string name.');
    }
    const sanitized = {
      name: entity.name.replace(/[^a-zA-Z0-9]/g, ''),
      title: entity.title || entity.name,
      plural: entity.plural || `${entity.name}s`,
      description: entity.description || `Domain entity representing ${entity.name}`,
      fields: Array.isArray(entity.fields) ? entity.fields.map(f => this.normalizeField(f)) : [
        { name: 'id', type: 'string', label: 'ID', sampleValue: 'id-001' },
        { name: 'name', type: 'string', label: 'Name', sampleValue: `Sample ${entity.name}` },
        { name: 'status', type: 'string', label: 'Status', sampleValue: 'Active' }
      ],
      relationships: Array.isArray(entity.relationships) ? entity.relationships : [],
      seedData: Array.isArray(entity.seedData) && entity.seedData.length > 0 ? entity.seedData : []
    };
    return sanitized;
  }

  /**
   * Normalize an individual field definition.
   */
  static normalizeField(field) {
    if (typeof field === 'string') {
      return {
        name: field,
        type: field === 'id' ? 'string' : (field.includes('count') || field.includes('price') || field.includes('size') || field.includes('age') || field.includes('rating') || field.includes('score') ? 'number' : 'string'),
        label: field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1'),
        sampleValue: `Sample ${field}`
      };
    }
    return {
      name: field.name || 'field',
      type: field.type || 'string',
      label: field.label || field.name || 'Field',
      sampleValue: field.sampleValue || `Sample ${field.name || 'Value'}`
    };
  }

  /**
   * Validate an Actor definition.
   */
  static validateActor(actor) {
    return {
      name: actor.name || 'User',
      role: actor.role || 'Primary Operator',
      capabilities: Array.isArray(actor.capabilities) ? actor.capabilities : ['manage-records', 'view-telemetry'],
      permissions: Array.isArray(actor.permissions) ? actor.permissions : ['read', 'write']
    };
  }

  /**
   * Validate a View Primitive definition.
   */
  static validateView(view, entities = []) {
    const primitiveType = Object.values(UI_PRIMITIVES).includes(view.primitiveType)
      ? view.primitiveType
      : UI_PRIMITIVES.CATALOG;

    return {
      id: view.id || `view-${Math.random().toString(36).substring(2, 7)}`,
      title: view.title || 'Domain View',
      componentName: view.componentName || 'DomainComponent',
      primitiveType,
      targetEntity: view.targetEntity || (entities[0] ? entities[0].name : 'System'),
      purpose: view.purpose || `Interactive ${primitiveType} for managing domain entities`,
      capabilities: Array.isArray(view.capabilities) ? view.capabilities : ['search', 'filter', 'inspect']
    };
  }

  /**
   * Validate an Operation definition.
   */
  static validateOperation(op) {
    return {
      id: op.id || `op-${op.method.toLowerCase()}-${op.path.replace(/[^a-zA-Z0-9]/g, '-')}`,
      path: op.path.startsWith('/') ? op.path : `/${op.path}`,
      method: op.method ? op.method.toUpperCase() : OPERATION_METHODS.GET,
      description: op.description || `Execute ${op.method} on ${op.path}`,
      targetEntity: op.targetEntity || 'Entity',
      payloadFields: Array.isArray(op.payloadFields) ? op.payloadFields : []
    };
  }
}
