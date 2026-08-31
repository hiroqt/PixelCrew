/**
 * PIXEL CREW — AST Normalizer
 * 
 * Responsibilities:
 * 1. Normalize casing, naming conventions, and identifiers.
 * 2. Create deterministic, stable IDs for all software constructs.
 * 3. Validate entity references across relationships, views, and operations.
 * 4. Ensure requirement IDs are strictly unique and traceable.
 * 5. Reject malformed ASTs without introducing any domain-specific heuristics.
 */

import { UniversalSoftwareOntology } from './ontology.js';

export class ASTNormalizer {
  /**
   * Normalize an arbitrary Project AST.
   */
  static normalize(rawAST) {
    if (!rawAST || typeof rawAST !== 'object') {
      throw new Error('ASTNormalizer: input AST must be a non-null object.');
    }

    // 1. Normalize Project Metadata
    const project = UniversalSoftwareOntology.validateProject(rawAST.project || {
      name: rawAST.appName || rawAST.projectName || 'Synthesized Application',
      description: rawAST.summary || rawAST.description || 'Open-World Synthesized Software Application',
      domain: rawAST.domain || (rawAST.domainMeta ? rawAST.domainMeta.id : 'software-system'),
      goals: Array.isArray(rawAST.goals) ? rawAST.goals : []
    });

    // 2. Normalize Entities & build reference set
    const rawEntities = Array.isArray(rawAST.entities) ? rawAST.entities : [];
    if (rawEntities.length === 0) {
      throw new Error('ASTNormalizer: AST must contain at least one valid Entity.');
    }

    const seenEntityNames = new Set();
    const entities = rawEntities.map((e, idx) => {
      const validated = UniversalSoftwareOntology.validateEntity(e, idx);
      if (seenEntityNames.has(validated.name)) {
        // Disambiguate duplicate name
        validated.name = `${validated.name}_${idx + 1}`;
        validated.id = `entity-${validated.name.toLowerCase()}`;
      }
      seenEntityNames.add(validated.name);
      return validated;
    });

    const entityNameMap = new Set(entities.map(e => e.name));

    // Fix relationships target references
    entities.forEach(ent => {
      ent.relationships = ent.relationships.map(rel => {
        if (!entityNameMap.has(rel.targetEntity)) {
          // If referencing unknown entity, point to first available or keep clean
          const match = Array.from(entityNameMap).find(n => n.toLowerCase() === rel.targetEntity.toLowerCase());
          return {
            ...rel,
            targetEntity: match || Array.from(entityNameMap)[0]
          };
        }
        return rel;
      });
    });

    // 3. Normalize Actors
    const rawActors = Array.isArray(rawAST.actors) && rawAST.actors.length > 0
      ? rawAST.actors
      : [{ name: 'User', role: 'Operator' }];
    const actors = rawActors.map((a, idx) => UniversalSoftwareOntology.validateActor(a, idx));

    // 4. Normalize Capabilities
    const capabilities = Array.isArray(rawAST.capabilities) && rawAST.capabilities.length > 0
      ? Array.from(new Set(rawAST.capabilities.map(String)))
      : ['search', 'filter', 'view', 'create', 'edit'];

    // 5. Normalize Workflows
    const rawWorkflows = Array.isArray(rawAST.workflows) ? rawAST.workflows : [];
    const workflows = rawWorkflows.map((w, idx) => UniversalSoftwareOntology.validateWorkflow(w, idx));

    // 6. Normalize Views & target entities
    const rawViews = Array.isArray(rawAST.views) ? rawAST.views : [];
    const views = rawViews.map((v, idx) => {
      const validated = UniversalSoftwareOntology.validateView(v, entities, idx);
      // Ensure target entities exist
      validated.targetEntities = validated.targetEntities.map(t => {
        if (entityNameMap.has(t)) return t;
        const match = Array.from(entityNameMap).find(n => n.toLowerCase() === t.toLowerCase());
        return match || entities[0].name;
      });
      return validated;
    });

    // 7. Normalize Operations
    const rawOps = Array.isArray(rawAST.operations) ? rawAST.operations : [];
    const operations = rawOps.map((op, idx) => {
      const validated = UniversalSoftwareOntology.validateOperation(op, entities, idx);
      if (!entityNameMap.has(validated.targetEntity)) {
        const match = Array.from(entityNameMap).find(n => n.toLowerCase() === validated.targetEntity.toLowerCase());
        validated.targetEntity = match || entities[0].name;
      }
      return validated;
    });

    // 8. Normalize Requirements (Ensure unique REQ-001..N)
    const rawReqs = Array.isArray(rawAST.requirements) ? rawAST.requirements : [];
    const seenReqIds = new Set();
    const requirements = rawReqs.map((req, idx) => {
      const validated = UniversalSoftwareOntology.validateRequirement(req, idx);
      let uniqueId = validated.id;
      let counter = idx + 1;
      while (seenReqIds.has(uniqueId)) {
        uniqueId = `REQ-${String(counter++).padStart(3, '0')}`;
      }
      seenReqIds.add(uniqueId);
      validated.id = uniqueId;
      return validated;
    });

    // 9. Normalize Events
    const rawEvents = Array.isArray(rawAST.events) ? rawAST.events : [];
    const events = rawEvents.map((evt, idx) => UniversalSoftwareOntology.validateEvent(evt, idx));

    return {
      project,
      appName: project.name,
      projectName: project.name,
      companyName: rawAST.companyName || project.name,
      headline: rawAST.headline || `Engineered for ${project.name}`,
      summary: rawAST.summary || project.description,
      domain: project.domain,
      domainMeta: rawAST.domainMeta || { id: project.domain, label: project.name, confidence: 0.95 },
      appType: rawAST.appType || { id: project.domain, name: project.name, category: project.domain, confidence: 0.95 },
      actors,
      entities,
      capabilities,
      workflows,
      views,
      operations,
      events,
      requirements,
      palette: rawAST.palette,
      fonts: rawAST.fonts,
      rawPrompt: rawAST.rawPrompt || ''
    };
  }
}
