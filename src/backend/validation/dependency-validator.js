/**
 * PIXEL CREW — Dependency Validator
 * 
 * Verifies package.json dependencies for minimal weight and bloat elimination.
 */

export class DependencyValidator {
  static validate(packageJson = {}) {
    const deps = Object.keys(packageJson.dependencies || {});
    const bloatList = ['express', 'lodash', 'moment', 'request'];
    const detectedBloat = deps.filter(d => bloatList.includes(d));

    return {
      valid: detectedBloat.length === 0,
      score: detectedBloat.length === 0 ? 100 : 80,
      detectedBloat,
      dependencyCount: deps.length
    };
  }
}
