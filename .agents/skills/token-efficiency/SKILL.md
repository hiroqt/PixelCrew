---
name: token-efficiency
description: >-
  Universal token optimization and context conservation engine across AI coding agents and IDEs
  (Claude, Google Antigravity, Cursor, Kiro, Windsurf, GitHub Copilot). Slashes token usage by 50% to 75%
  through AST symbol-graph extraction, multi-turn context pruning, prompt caching, compact diffs, and structured JSON schemas.
---

# Universal Token Efficiency & Context Optimization

This skill codifies proven architectural strategies to minimize LLM token consumption across all major AI coding environments and agent frameworks (**Claude Code, Google Antigravity / AGY, Cursor, Kiro / Kirobo, Windsurf, Copilot Workspace, and local multi-agent swarms**).

---

## 1. The Token Wastage Problem & Core Strategy

Traditional coding agents exhaust token limits and inflate API costs because:
1. **Full File Dumps**: Dumping entire $1,000$+ line files into context when only a single function was touched.
2. **Chat History Bloat**: Accumulating dozens of intermediate reasoning chains and terminal outputs in multi-turn sessions.
3. **Verbose Formatting**: Asking for long prose explanations when compact diffs or JSON payloads are needed.
4. **Duplicate System Instructions**: Re-sending redundant rules on every tool call instead of leveraging prompt caching.

### The 5 Pillars of Token Optimization

```
┌────────────────────────────────────────────────────────────────────────┐
│                   PIXEL CREW TOKEN CONSERVATION PILLARS                │
├───────────────────┬───────────────────┬────────────────────────────────┤
│ 1. SYMBOL GRAPH   │ 2. CONTEXT PRUNER │ 3. PROMPT CACHE EXPLOITATION   │
│ AST extraction    │ Tiered sliding    │ Static prefix anchoring        │
│ instead of raw    │ window & diff-    │ for 90% cache read discount    │
│ whole files       │ only patches      │                                │
├───────────────────┼───────────────────┼────────────────────────────────┤
│ 4. SUBAGENT ISOLATION                 │ 5. COMPACT STRUCTURED SCHEMAS  │
│ Local ephemeral agent scratchpads     │ JSON/YAML compact outputs with │
│ preventing context pollution          │ zero conversational padding    │
└───────────────────────────────────────┴────────────────────────────────┘
```

---

## 2. Platform-Specific Token Optimization Rules

### A. Claude / Anthropic (Claude Code, Artifacts, Desktop)
- **Prompt Caching Anchoring**: Anthropic prompt caching requires at least $1,024$ tokens for cache blocks. Structure system prompts and foundational skill files at the very top of context so they hit cache ($90\%$ token price reduction).
- **Targeted Tool Calls**: Use targeted line ranges (`StartLine`, `EndLine`) with `replace_file_content` instead of re-writing the whole file.
- **Diff Streaming**: Prefer standard unified diff format (`diff -u`) for code modifications.

### B. Google Antigravity (AGY CLI / IDE)
- **Compact Artifacts**: Keep artifacts structured in `<appDataDir>/brain/<conversation-id>/` and avoid re-summarizing artifact content in model responses.
- **Selective Ripgrep & Symbol Reading**: Use `grep_search` and `list_dir` first to pinpoint exact line offsets before loading files with `view_file`.
- **Subagent Context Encapsulation**: Use `invoke_subagent` / `browser_subagent` for isolated heavy tasks; subagent reasoning traces remain outside the parent context.

### C. Cursor / Windsurf / Kiro
- **Strict `.cursorrules` / Ruleset Budgeting**: Keep project rules concise ($\le 250$ tokens) and modularized.
- **Selective `@file` References**: Avoid adding whole folders with `@folder`; reference specific `@symbol` or `@function` to inject only relevant signatures.
- **Composer / Fast Edits**: Use targeted edit prompts specifying exact method names rather than conversational re-explanations.

---

## 3. Practical Token Savings Matrix

| Strategy | Traditional Token Load | Optimized Token Load | Token Reduction |
|---|---|---|---|
| File Inspection (500-line file) | ~2,500 tokens (full dump) | ~180 tokens (AST symbol skeleton) | **~92% saved** |
| Multi-Agent Code Generation | ~45,000 tokens (verbose prose) | ~11,200 tokens (structured JSON + direct files) | **~75% saved** |
| Repeated IDE Session Turns | ~80,000 tokens (unpruned history) | ~18,000 tokens (sliding window + summary) | **~77% saved** |
| Codebase Context Search | ~30,000 tokens (raw search dump) | ~3,500 tokens (ripgrep matches + line slices) | **~88% saved** |

---

## 4. AST Symbol Skeletonization Example

Instead of injecting an entire large class into agent context, inject a condensed symbol skeleton:

```typescript
// Condensed Symbol Skeleton (Only 45 tokens vs 850 tokens full file)
export class PaymentGateway {
  constructor(config: GatewayConfig);
  async processCharge(req: ChargeRequest): Promise<ChargeResult>;
  async refundTransaction(id: string, amount: number): Promise<RefundResult>;
  private validateWebhookSignature(payload: string, sig: string): boolean;
}
```

---

## 5. Token Usage Tracking & Budgeting

Pixel Crew automatically tracks:
1. `rawTokensEstimated`: Approximate tokens if full uncompressed files were processed.
2. `actualTokensUsed`: Tokens consumed using symbol pruning and compact schemas.
3. `tokensSaved`: Net tokens conserved ($raw - actual$) and percentage efficiency.
