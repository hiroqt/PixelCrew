/**
 * PIXEL CREW — Universal Backend Synthesizer
 * 
 * Master backend synthesis orchestrator:
 * Compiles ArchitectureSpecification + Enriched Entities -> Complete production-grade backend tree:
 * - Domain Modules (Controller, Service, Repository, Schema, Policy, Test)
 * - Next.js App Router API Routes (src/app/api/.../route.ts)
 * - Prisma Database Schema (prisma/schema.prisma)
 * - Security & Middleware (Auth, RBAC, Rate-Limiting, Env)
 * - Resilience, Caching & Observability Suites
 * - Architecture Decision Records (docs/architecture/ADR-*.md)
 * - Threat Model Document (docs/security/threat-model.md)
 * - Infrastructure (Dockerfile, docker-compose.yml, .env.example)
 */

import { ArchitectureReasoner } from '../architecture/architecture-reasoner.js';
import { DataModeler } from '../data/data-modeler.js';
import { SchemaGenerator as PrismaSchemaGenerator } from '../data/schema-generator.js';
import { RouteGenerator } from '../api/route-generator.js';
import { ErrorContract } from '../api/error-contract.js';
import { SecurityEngine } from '../security/security-engine.js';
import { ThreatModelDocumenter } from '../security/threat-model.js';
import { PerformanceEngine } from '../performance/performance-engine.js';
import { ResilienceEngine } from '../reliability/resilience-engine.js';
import { LoggingEngine } from '../observability/logging-engine.js';
import { MetricsEngine } from '../observability/metrics-engine.js';
import { ADRGenerator } from '../architecture/adr-generator.js';
import { ModuleSynthesizer } from './module-synthesizer.js';
import { InfrastructureSynthesizer } from './infrastructure-synthesizer.js';

export class BackendSynthesizer {
  /**
   * Synthesize complete backend file tree from prompt & AST
   * @param {string} prompt 
   * @param {object} ast 
   * @returns {object} { files, architecture, entities, summary }
   */
  static synthesize(prompt = '', ast = {}) {
    const files = {};

    // 1. Architecture Reasoning
    const architecture = ArchitectureReasoner.reason(prompt, ast);

    // 2. Data Modeling & Invariant Enrichment
    const rawEntities = ast.entities || [];
    const entities = DataModeler.model(rawEntities, architecture);

    // 3. RFC 7807 Error Contract
    files['src/shared/errors.ts'] = ErrorContract.generateErrorClasses();

    // 4. Logging & Observability
    files['src/infrastructure/logger.ts'] = LoggingEngine.generateLogger();
    files['src/app/api/health/route.ts'] = MetricsEngine.generateHealthRoutes();

    // 5. Security & Auth Suite
    const securityFiles = SecurityEngine.generateSecuritySuite(architecture);
    Object.assign(files, securityFiles);

    // 6. Performance & Caching Suite
    const performanceFiles = PerformanceEngine.generatePerformanceSuite(architecture);
    Object.assign(files, performanceFiles);

    // 7. Resilience & Reliability Suite
    const resilienceFiles = ResilienceEngine.generateResilienceSuite(architecture);
    Object.assign(files, resilienceFiles);

    // 8. Prisma Database Schema
    files['prisma/schema.prisma'] = PrismaSchemaGenerator.generatePrismaSchema(entities, architecture);

    // 9. Synthesize Domain Modules (Controller, Service, Repository, Schema, Policy, Test)
    entities.forEach(ent => {
      const moduleFiles = ModuleSynthesizer.synthesizeModule(ent, architecture);
      Object.assign(files, moduleFiles);

      // Synthesize Next.js App Router API Routes delegating to controller
      const slug = ent.plural ? ent.plural.toLowerCase() : `${ent.name.toLowerCase()}s`;
      files[`src/app/api/v1/${slug}/route.ts`] = RouteGenerator.generateCollectionRoute(ent);
      files[`src/app/api/v1/${slug}/[id]/route.ts`] = RouteGenerator.generateItemRoute(ent);
    });

    // 10. Infrastructure Files
    const infraFiles = InfrastructureSynthesizer.synthesize(architecture);
    Object.assign(files, infraFiles);

    // 11. ADRs & Threat Model Documentation
    const adrFiles = ADRGenerator.generateADRs(architecture);
    Object.assign(files, adrFiles);
    files['docs/security/threat-model.md'] = ThreatModelDocumenter.generateMarkdown(architecture);

    return {
      files,
      fileCount: Object.keys(files).length,
      architecture,
      entities,
      summary: `Synthesized ${Object.keys(files).length} backend files (${architecture.style}, ${entities.length} entities, ${architecture.complexity.tier} complexity).`
    };
  }
}
