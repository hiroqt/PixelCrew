# Universal Token Efficiency & Context Conservation Guide

## 1. Slashing Token Consumption by 50% to 75%

Across all AI coding assistants (Claude Code, Google Antigravity, Cursor, Kiro, Copilot), context window exhaustion degrades reasoning quality and inflates cost.

### Strategy 1: AST Symbol-Graph Extraction Over Full-File Dumps
Extract only the necessary interface declarations, type definitions, and function signatures rather than transmitting full 1,000-line implementation files.

### Strategy 2: Prompt Caching Maximization
Order context with **Static System Directives first** and **Dynamic User Prompts last**. This enables LLM providers to cache 80–90% of prefix tokens.

### Strategy 3: Surgical Diff-Only Delivery
Emit concise unified diffs for modifications instead of regenerating entire multi-hundred-line source files.
