/**
 * PIXEL CREW — Universal Backend Engineering Engine
 * 
 * Public API Surface:
 * - Requirement & Complexity Analysis
 * - Architecture Reasoning & Technology Selection
 * - Data Modeling, Schema Generation & Index Optimization
 * - API Design & Route Generation (RFC 7807, Zod)
 * - Security Engine & Threat Modeling
 * - Performance, Resilience & Observability Suites
 * - Backend Synthesizer & Quality Validator
 */

export { RequirementAnalyzer } from './analyzer/requirement-analyzer.js';
export { ComplexityAnalyzer } from './analyzer/complexity-analyzer.js';
export { ThreatAnalyzer } from './analyzer/threat-analyzer.js';

export { ArchitectureReasoner } from './architecture/architecture-reasoner.js';
export { ArchitectureSelector } from './architecture/architecture-selector.js';
export { TradeoffAnalyzer } from './architecture/tradeoff-analyzer.js';
export { ADRGenerator } from './architecture/adr-generator.js';

export { DataModeler } from './data/data-modeler.js';
export { SchemaGenerator as PrismaSchemaGenerator } from './data/schema-generator.js';
export { IndexAnalyzer } from './data/index-analyzer.js';
export { QueryAnalyzer } from './data/query-analyzer.js';
export { TransactionAnalyzer } from './data/transaction-analyzer.js';

export { APIDesigner } from './api/api-designer.js';
export { RouteGenerator } from './api/route-generator.js';
export { SchemaGenerator as ZodSchemaGenerator } from './api/schema-generator.js';
export { ErrorContract } from './api/error-contract.js';

export { SecurityEngine } from './security/security-engine.js';
export { AuthSelector } from './security/auth-selector.js';
export { AuthorizationEngine } from './security/authorization-engine.js';
export { ThreatModelDocumenter } from './security/threat-model.js';
export { PolicyEngine } from './security/policy-engine.js';
export { SecretAnalyzer } from './security/secret-analyzer.js';

export { PerformanceEngine } from './performance/performance-engine.js';
export { CacheAnalyzer } from './performance/cache-analyzer.js';
export { QueryOptimizer } from './performance/query-optimizer.js';
export { ConcurrencyAnalyzer } from './performance/concurrency-analyzer.js';

export { ResilienceEngine } from './reliability/resilience-engine.js';
export { RetryAnalyzer } from './reliability/retry-analyzer.js';
export { IdempotencyEngine } from './reliability/idempotency-engine.js';
export { FailureAnalyzer } from './reliability/failure-analyzer.js';

export { LoggingEngine } from './observability/logging-engine.js';
export { MetricsEngine } from './observability/metrics-engine.js';
export { TracingEngine } from './observability/tracing-engine.js';

export { PatternRegistry } from './patterns/pattern-registry.js';
export { PatternSelector } from './patterns/pattern-selector.js';
export { TradeoffEngine } from './patterns/tradeoff-engine.js';

export { BackendSynthesizer } from './synthesis/backend-synthesizer.js';
export { ModuleSynthesizer } from './synthesis/module-synthesizer.js';
export { InfrastructureSynthesizer } from './synthesis/infrastructure-synthesizer.js';

export { ArchitectureValidator } from './validation/architecture-validator.js';
export { SecurityValidator } from './validation/security-validator.js';
export { PerformanceValidator } from './validation/performance-validator.js';
export { DependencyValidator } from './validation/dependency-validator.js';
export { BackendQualityValidator } from './validation/backend-quality-validator.js';
