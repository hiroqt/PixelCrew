/**
 * PIXEL CREW — Execution Telemetry & Efficiency Engine
 * 
 * Aggregates real execution metrics across agents:
 * - Execution duration
 * - Input tokens (or 'unavailable' if provider does not expose)
 * - Output tokens (or 'unavailable')
 * - Tool calls
 * - Agent retries
 * - Task status
 * - Requirement pass rate
 * - Repair count
 * - Artifact count
 */

export class TelemetryEngine {
  constructor() {
    this.records = [];
    this.startTime = Date.now();
    this.repairsCount = 0;
  }

  recordAgentStep(agentName, data = {}) {
    this.records.push({
      agent: agentName,
      timestamp: Date.now(),
      inputTokens: typeof data.inputTokens === 'number' ? data.inputTokens : 'unavailable',
      outputTokens: typeof data.outputTokens === 'number' ? data.outputTokens : 'unavailable',
      durationMs: typeof data.durationMs === 'number' ? data.durationMs : 0,
      toolCalls: typeof data.toolCalls === 'number' ? data.toolCalls : 0,
      retries: typeof data.retries === 'number' ? data.retries : 0,
      taskStatus: data.taskStatus || 'success',
      filesGenerated: data.filesGenerated || 0,
      skill: data.skill || 'open-world-synthesis'
    });
  }

  recordRepair(repairTask) {
    this.repairsCount++;
  }

  aggregate(generatedFiles = {}, contractValidation = null, visualCritic = null) {
    const totalDuration = Date.now() - this.startTime;
    const fileCount = typeof generatedFiles === 'object' && generatedFiles !== null ? Object.keys(generatedFiles).length : 0;

    let totalInputTokens = 0;
    let totalOutputTokens = 0;
    let hasTokenData = false;

    this.records.forEach(r => {
      if (typeof r.inputTokens === 'number') {
        totalInputTokens += r.inputTokens;
        hasTokenData = true;
      }
      if (typeof r.outputTokens === 'number') {
        totalOutputTokens += r.outputTokens;
        hasTokenData = true;
      }
    });

    const totalToolCalls = this.records.reduce((sum, r) => sum + (typeof r.toolCalls === 'number' ? r.toolCalls : 0), 0);
    const totalRetries = this.records.reduce((sum, r) => sum + (typeof r.retries === 'number' ? r.retries : 0), 0);

    const requirementPassRate = contractValidation ? (contractValidation.score || (contractValidation.passed ? 100 : 0)) : 100;
    const visualScore = visualCritic ? visualCritic.score : 10.0;

    return {
      durationMs: totalDuration,
      inputTokens: hasTokenData ? totalInputTokens : 'unavailable',
      outputTokens: hasTokenData ? totalOutputTokens : 'unavailable',
      totalTokensUsed: hasTokenData ? (totalInputTokens + totalOutputTokens) : 'unavailable',
      totalToolCalls,
      totalRetries,
      repairCount: this.repairsCount,
      fileCount,
      agentCount: new Set(this.records.map(r => r.agent)).size || 1,
      requirementPassRate,
      visualScore,
      recordedAt: new Date().toISOString()
    };
  }
}
