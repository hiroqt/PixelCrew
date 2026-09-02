/**
 * PIXEL CREW — Backend Architecture Reasoner
 * 
 * Synthesizes a comprehensive ArchitectureSpecification from requirements and complexity analysis.
 * Adheres strictly to the principle of "Minimum necessary complexity + Maximum necessary reliability".
 */

import { RequirementAnalyzer } from '../analyzer/requirement-analyzer.js';
import { ComplexityAnalyzer } from '../analyzer/complexity-analyzer.js';
import { ThreatAnalyzer } from '../analyzer/threat-analyzer.js';

export class ArchitectureReasoner {
  /**
   * Derive an architecture specification from prompt & AST
   * @param {string} prompt 
   * @param {object} ast 
   * @returns {object} ArchitectureSpecification
   */
  static reason(prompt = '', ast = {}) {
    const requirements = RequirementAnalyzer.analyze(prompt, ast);
    const complexity = ComplexityAnalyzer.analyze(requirements, ast);
    const threatModel = ThreatAnalyzer.analyze(requirements, ast);

    // 1. Architecture Topology Selection
    let style = 'modular-monolith';
    if (complexity.tier === 'high') {
      style = 'distributed-modular-services';
    } else if (requirements.backgroundJobs.required || complexity.tier === 'medium') {
      style = 'modular-monolith-with-workers';
    }

    // 2. Database Selection
    const dbType = requirements.application.expectedScale === 'high' || requirements.security.tenantIsolation
      ? 'postgresql'
      : 'postgresql'; // default to postgresql with sqlite dev fallback

    // 3. Cache Selection
    const cacheRequired = requirements.performance.caching;
    const cacheTech = (complexity.tier === 'high' || requirements.backgroundJobs.required) ? 'redis' : 'in-memory-lru';

    // 4. Queue Selection
    const queueRequired = requirements.backgroundJobs.required;
    const queueTech = queueRequired ? (cacheTech === 'redis' ? 'bullmq' : 'in-memory-async-queue') : 'none';

    // 5. Auth Strategy
    const authStrategy = requirements.users.authentication ? 'session-cookie' : 'none';
    const authRoles = requirements.users.roles ? 'rbac' : 'none';

    // 6. Observability
    const logging = true;
    const metrics = complexity.tier !== 'low';
    const tracing = complexity.tier === 'high';

    const architectureSpec = {
      style,
      tier: complexity.tier,
      complexityScore: complexity.totalScore,

      api: {
        style: 'rest',
        versioning: true,
        routeStructure: 'app-router-modular',
        errorHandling: 'rfc-7807',
        validation: 'zod'
      },

      database: {
        type: dbType,
        orm: 'prisma',
        transactions: requirements.data.transactions,
        softDelete: requirements.data.softDelete,
        auditLog: requirements.data.auditLog,
        tenantIsolation: requirements.security.tenantIsolation
      },

      cache: {
        required: cacheRequired,
        technology: cacheTech,
        ttlSeconds: 300
      },

      queue: {
        required: queueRequired,
        technology: queueTech,
        tasks: requirements.backgroundJobs.tasks
      },

      authentication: {
        required: requirements.users.authentication,
        strategy: authStrategy
      },

      authorization: {
        required: requirements.users.roles,
        strategy: authRoles
      },

      security: {
        rateLimiting: requirements.api.rateLimiting,
        tenantIsolation: requirements.security.tenantIsolation,
        sensitiveData: requirements.security.sensitiveData,
        controls: threatModel.controls
      },

      observability: {
        logging,
        metrics,
        tracing,
        structuredJson: true
      },

      requirements,
      complexity,
      threatModel
    };

    return architectureSpec;
  }
}
