/**
 * PIXEL CREW — Universal Event Protocol
 * 
 * Standardized telemetry, lifecycle, and progress events across all agent providers.
 */

export const EVENT_TYPES = {
  AGENT_STARTED: 'agent.started',
  AGENT_THINKING: 'agent.thinking',
  SKILL_ACTIVATED: 'skill.activated',
  TOOL_INVOKED: 'tool.invoked',
  PROGRESS: 'progress',
  TASK_COMPLETED: 'task.completed',
  TASK_FAILED: 'task.failed',
  ORCHESTRATION_STARTED: 'orchestration.started',
  ORCHESTRATION_COMPLETED: 'orchestration.completed',
  ORCHESTRATION_FAILED: 'orchestration.failed',
  STATE_CHANGE: 'state.change'
};

/**
 * Creates and validates a standardized AgentEvent object
 */
export function createEvent(options = {}) {
  const event = {
    id: options.id || `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: options.timestamp || Date.now(),
    agent: options.agent || 'orchestrator',
    type: options.type || EVENT_TYPES.PROGRESS,
    taskId: options.taskId || null,
    taskName: options.taskName || null,
    skill: options.skill || null,
    message: String(options.message || ''),
    provider: options.provider || 'generic',
    data: typeof options.data === 'object' && options.data !== null ? { ...options.data } : {}
  };

  validateEvent(event);
  return event;
}

/**
 * Validates that an AgentEvent object satisfies contract
 */
export function validateEvent(event) {
  if (!event || typeof event !== 'object') {
    throw new Error('Event must be a non-null object');
  }
  if (!event.id || typeof event.id !== 'string') {
    throw new Error('Event must have a valid string id');
  }
  if (typeof event.timestamp !== 'number') {
    throw new Error('Event must have a numeric timestamp');
  }
  if (!event.agent || typeof event.agent !== 'string') {
    throw new Error('Event must have a valid agent name');
  }
  if (!event.type || typeof event.type !== 'string') {
    throw new Error('Event must have a valid event type');
  }
  return true;
}

/**
 * Serializes event for JSONL log line
 */
export function serializeEvent(event) {
  validateEvent(event);
  return JSON.stringify(event);
}

/**
 * Deserializes an event from JSON string or object
 */
export function deserializeEvent(raw) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  return createEvent(data);
}
