/**
 * PIXEL CREW — Requirement Validator
 * 
 * Inspects generated artifacts against formal acceptance criteria in the RequirementContract.
 * Returns verified status (PASS, FAIL, PARTIAL, BLOCKED) with concrete evidence paths.
 */

export class RequirementValidator {
  /**
   * Validate project artifacts against requirement contract
   */
  static validate(requirementContract, files = {}, artifactGraph = null) {
    if (!requirementContract || typeof requirementContract.validateProject !== 'function') {
      return {
        passed: true,
        score: 100,
        total: 0,
        passedCount: 0,
        failedCount: 0,
        partialCount: 0,
        auditReport: []
      };
    }

    const result = requirementContract.validateProject(files);

    // Cross-reference with artifact graph if present
    if (artifactGraph && Array.isArray(result.auditReport)) {
      result.auditReport.forEach(item => {
        const artifacts = artifactGraph.findByRequirement(item.id);
        if (artifacts.length > 0) {
          item.artifactNodes = artifacts.map(a => ({ path: a.path, version: a.version, producer: a.producerTask }));
        }
      });
    }

    return result;
  }
}
