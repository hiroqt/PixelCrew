/**
 * PIXEL CREW — Architecture Complexity Analyzer
 * 
 * Computes multi-dimensional complexity scores and prevents over-engineering
 * by ensuring architectural choices match actual application constraints.
 */

export class ComplexityAnalyzer {
  /**
   * Calculate complexity score across 6 architectural dimensions
   * @param {object} requirements - SystemRequirementsModel
   * @param {object} ast - Semantic Project AST
   * @returns {object} Complexity Assessment
   */
  static analyze(requirements = {}, ast = {}) {
    const app = requirements.application || {};
    const users = requirements.users || {};
    const data = requirements.data || {};
    const api = requirements.api || {};
    const security = requirements.security || {};
    const performance = requirements.performance || {};
    const jobs = requirements.backgroundJobs || {};

    const entities = ast.entities || [];
    const workflows = ast.workflows || [];
    const operations = ast.operations || [];

    // 1. Domain Complexity (0–25)
    let domainScore = 5;
    if (entities.length > 5) domainScore += 5;
    if (entities.length > 10) domainScore += 5;
    if (workflows.length > 3) domainScore += 5;
    if (users.roles && users.organizations) domainScore += 5;

    // 2. Traffic & Concurrency Complexity (0–20)
    let trafficScore = 3;
    if (app.expectedScale === 'medium') trafficScore += 5;
    if (app.expectedScale === 'high') trafficScore += 12;
    if (performance.realTime) trafficScore += 5;

    // 3. Data & Storage Complexity (0–20)
    let dataScore = 4;
    if (data.transactions) dataScore += 5;
    if (data.search) dataScore += 3;
    if (data.auditLog) dataScore += 3;
    if (security.tenantIsolation) dataScore += 5;

    // 4. Integration & Background Processing (0–15)
    let integrationScore = 2;
    if (jobs.required) integrationScore += 5;
    if (jobs.tasks && jobs.tasks.length > 2) integrationScore += 4;
    if (api.public) integrationScore += 4;

    // 5. Reliability & Availability Requirements (0–10)
    let reliabilityScore = 2;
    if (app.availability === '99.9%') reliabilityScore += 3;
    if (app.availability === '99.99%') reliabilityScore += 6;
    if (data.transactions) reliabilityScore += 2;

    // 6. Security Complexity (0–10)
    let securityScore = 2;
    if (security.tenantIsolation) securityScore += 3;
    if (security.sensitiveData) securityScore += 3;
    if (security.auditLogging) securityScore += 2;

    const totalScore = domainScore + trafficScore + dataScore + integrationScore + reliabilityScore + securityScore;

    // Determine Tier
    let tier = 'low';
    let recommendedStyle = 'modular-monolith';
    let allowedInfrastructure = ['postgresql', 'sqlite', 'in-memory-cache'];
    let disallowedInfrastructure = ['microservices', 'kubernetes', 'kafka', 'service-mesh'];

    if (totalScore >= 60) {
      tier = 'high';
      recommendedStyle = 'distributed-modular-services';
      allowedInfrastructure.push('redis', 'bullmq', 'cdn-edge', 'worker-cluster');
      if (totalScore > 80) {
        disallowedInfrastructure = []; // Complex requirements may justify advanced distributed infra
      }
    } else if (totalScore >= 35) {
      tier = 'medium';
      recommendedStyle = 'modular-monolith-with-workers';
      allowedInfrastructure.push('redis', 'bullmq');
    }

    return {
      totalScore,
      tier, // 'low' | 'medium' | 'high'
      recommendedStyle,
      dimensions: {
        domain: domainScore,
        traffic: trafficScore,
        data: dataScore,
        integration: integrationScore,
        reliability: reliabilityScore,
        security: securityScore
      },
      allowedInfrastructure,
      disallowedInfrastructure,
      summary: `Complexity score ${totalScore}/100 (${tier} complexity). Recommended architecture: ${recommendedStyle}.`
    };
  }
}
