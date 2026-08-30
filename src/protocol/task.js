/**
 * PIXEL CREW — Universal Task Protocol
 * 
 * Standardized task definition, validation, and serialization.
 * Translates between Pixel Crew Core and Provider Adapters.
 */

export const TASK_STATUS = {
  PENDING: 'pending',
  QUEUED: 'queued',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled'
};

/**
 * Creates a standardized AgentTask object
 */
export function createTask(options = {}) {
  const {
    id = `task-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title = 'Untitled Task',
    description = '',
    agent = 'frontend',
    skills = [],
    files = { read: [], write: [] },
    dependencies = [],
    status = TASK_STATUS.QUEUED,
    assignedProvider = null,
    metadata = {}
  } = options;

  const task = {
    id: String(id),
    title: String(title),
    description: String(description),
    agent: String(agent),
    skills: Array.isArray(skills) ? [...skills] : [],
    files: {
      read: Array.isArray(files?.read) ? [...files.read] : [],
      write: Array.isArray(files?.write) ? [...files.write] : []
    },
    dependencies: Array.isArray(dependencies) ? [...dependencies] : [],
    status: Object.values(TASK_STATUS).includes(status) ? status : TASK_STATUS.QUEUED,
    assignedProvider: assignedProvider ? String(assignedProvider) : null,
    metadata: typeof metadata === 'object' && metadata !== null ? { ...metadata } : {},
    createdAt: options.createdAt || Date.now(),
    updatedAt: options.updatedAt || Date.now(),
    result: options.result || null,
    error: options.error || null
  };

  validateTask(task);
  return task;
}

/**
 * Validates that an AgentTask satisfies the required contract
 */
export function validateTask(task) {
  if (!task || typeof task !== 'object') {
    throw new Error('Task must be a non-null object');
  }
  if (!task.id || typeof task.id !== 'string') {
    throw new Error('Task must have a valid string id');
  }
  if (!task.title || typeof task.title !== 'string') {
    throw new Error('Task must have a valid string title');
  }
  if (!task.agent || typeof task.agent !== 'string') {
    throw new Error('Task must have a target agent specified');
  }
  if (!Array.isArray(task.skills)) {
    throw new Error('Task skills must be an array');
  }
  if (!task.files || typeof task.files !== 'object') {
    throw new Error('Task files must be an object with read and write arrays');
  }
  if (!Array.isArray(task.dependencies)) {
    throw new Error('Task dependencies must be an array of task IDs');
  }
  return true;
}

/**
 * Serializes task to JSON format with formatting
 */
export function serializeTask(task) {
  validateTask(task);
  return JSON.stringify(task, null, 2);
}

/**
 * Parses task from JSON string or object
 */
export function deserializeTask(raw) {
  const data = typeof raw === 'string' ? JSON.parse(raw) : raw;
  return createTask(data);
}
