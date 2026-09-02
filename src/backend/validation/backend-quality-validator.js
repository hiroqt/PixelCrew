/**
 * PIXEL CREW — Universal Backend Quality Score & Anti-Slop Validator
 * 
 * Computes composite Backend Quality Score (0–100):
 * - Security: 25%
 * - Architecture: 20%
 * - Correctness: 20%
 * - Performance: 15%
 * - Scalability: 10%
 * - Observability: 5%
 * - Maintainability: 5%
 */

import { ArchitectureValidator } from './architecture-validator.js';
import { SecurityValidator } from './security-validator.js';
import { PerformanceValidator } from './performance-validator.js';

export class BackendQualityValidator {
  /**
   * Validate full backend synthesis and compute Quality Score
   * @param {object} files 
   * @param {object} architecture 
   * @returns {object} Quality Report
   */
  static evaluate(files = {}, architecture = {}) {
    const archResult = ArchitectureValidator.validate(files);
    const secResult = SecurityValidator.validate(files, architecture);
    const perfResult = PerformanceValidator.validate(files, architecture);

    const securityScore = secResult.score;
    const architectureScore = archResult.score;
    const correctnessScore = (secResult.valid && archResult.valid) ? 98 : 80;
    const performanceScore = perfResult.score;
    const scalabilityScore = architecture.tier === 'high' ? 95 : 90;
    const observabilityScore = files['src/infrastructure/logger.ts'] && files['src/app/api/health/route.ts'] ? 95 : 75;
    const maintainabilityScore = files['docs/architecture/ADR-001-selected-architecture-style.md'] || Object.keys(files).some(k => k.includes('ADR-')) ? 96 : 80;

    // Weighted Overall Score calculation
    const totalScore = Math.round(
      securityScore * 0.25 +
      architectureScore * 0.20 +
      correctnessScore * 0.20 +
      performanceScore * 0.15 +
      scalabilityScore * 0.10 +
      observabilityScore * 0.05 +
      maintainabilityScore * 0.05
    );

    const allViolations = [
      ...archResult.violations,
      ...secResult.violations,
      ...perfResult.violations
    ];

    return {
      totalScore,
      passed: totalScore >= 85 && secResult.valid,
      breakdown: {
        security: securityScore,
        architecture: architectureScore,
        correctness: correctnessScore,
        performance: performanceScore,
        scalability: scalabilityScore,
        observability: observabilityScore,
        maintainability: maintainabilityScore
      },
      violations: allViolations,
      summary: `Backend Quality Score: ${totalScore}/100 (Security: ${securityScore}, Architecture: ${architectureScore}, Performance: ${performanceScore}).`
    };
  }
}
