/**
 * PIXEL CREW — Adapters Index
 */

export * from './adapter.interface.js';
export * from './generic.js';
export * from './claude-code.js';
export * from './codex.js';
export * from './cursor.js';
export * from './kiro.js';
export * from './antigravity.js';
export * from './registry.js';

import { ProviderRegistry } from './registry.js';
export const defaultProviderRegistry = new ProviderRegistry();
