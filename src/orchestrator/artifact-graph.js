/**
 * PIXEL CREW — Artifact Graph & Dependency Matrix
 * 
 * Tracks generated software artifacts, version histories, producer tasks,
 * dependency trees, consumer linkages, and requirement traceability.
 */

export class ArtifactGraph {
  constructor() {
    this.nodes = new Map(); // path -> ArtifactNode
  }

  /**
   * Register or update an artifact node
   */
  registerArtifact({ path, producerTask, requirements = [], dependencies = [], content = "", version = 1, repairReason = null }) {
    const existing = this.nodes.get(path);
    const currentVersion = existing ? existing.version + 1 : version;
    const history = existing ? [...existing.history] : [];

    if (existing) {
      history.push({
        version: existing.version,
        producerTask: existing.producerTask,
        requirements: existing.requirements,
        repairReason: existing.repairReason,
        timestamp: existing.timestamp
      });
    }

    const node = {
      path,
      producerTask: producerTask || 'generator',
      requirements: Array.isArray(requirements) ? requirements : [requirements],
      dependencies: Array.isArray(dependencies) ? dependencies : [],
      consumers: [],
      version: currentVersion,
      repairReason,
      timestamp: new Date().toISOString(),
      sizeBytes: typeof content === 'string' ? content.length : 0,
      status: 'active',
      history
    };

    this.nodes.set(path, node);
    this.rebuildConsumers();
    return node;
  }

  /**
   * Get an artifact by path
   */
  getArtifact(path) {
    return this.nodes.get(path) || null;
  }

  /**
   * List all registered artifacts
   */
  listArtifacts() {
    return Array.from(this.nodes.values());
  }

  /**
   * Find artifacts addressing a specific requirement ID
   */
  findByRequirement(reqId) {
    return Array.from(this.nodes.values()).filter(node => node.requirements.includes(reqId));
  }

  /**
   * Find artifacts produced by a specific task
   */
  findByTask(taskId) {
    return Array.from(this.nodes.values()).filter(node => node.producerTask === taskId);
  }

  /**
   * Rebuild consumer references across graph
   */
  rebuildConsumers() {
    for (const node of this.nodes.values()) {
      node.consumers = [];
    }
    for (const [consumerPath, node] of this.nodes.entries()) {
      for (const depPath of node.dependencies) {
        const depNode = this.nodes.get(depPath);
        if (depNode && !depNode.consumers.includes(consumerPath)) {
          depNode.consumers.push(consumerPath);
        }
      }
    }
  }

  /**
   * Serialize graph for diagnostics & reports
   */
  toJSON() {
    return {
      totalArtifacts: this.nodes.size,
      artifacts: Array.from(this.nodes.values())
    };
  }
}
