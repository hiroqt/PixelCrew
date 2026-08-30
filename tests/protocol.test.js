import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createTask,
  validateTask,
  serializeTask,
  deserializeTask,
  TASK_STATUS
} from '../src/protocol/task.js';
import {
  AGENT_STATES,
  AGENT_EXPRESSIONS,
  AGENT_ROLES,
  normalizeCapabilities
} from '../src/protocol/agent.js';
import {
  createEvent,
  validateEvent,
  serializeEvent,
  deserializeEvent,
  EVENT_TYPES
} from '../src/protocol/event.js';
import {
  createSkill,
  validateSkill,
  SKILL_CATEGORIES
} from '../src/protocol/skill.js';

test('Universal Task Protocol creates and validates valid tasks', () => {
  const task = createTask({
    id: 'task-frontend-001',
    title: 'Build portfolio homepage',
    description: 'Create a responsive modern portfolio homepage',
    agent: 'frontend',
    skills: ['frontend/react', 'frontend/tailwind'],
    files: {
      read: ['src/**'],
      write: ['src/app/page.tsx']
    },
    dependencies: ['task-design-001']
  });

  assert.equal(task.id, 'task-frontend-001');
  assert.equal(task.agent, 'frontend');
  assert.equal(task.status, TASK_STATUS.QUEUED);
  assert.equal(task.dependencies.length, 1);
  assert.ok(validateTask(task));

  // Test Serialization & Deserialization
  const serialized = serializeTask(task);
  const deserialized = deserializeTask(serialized);
  assert.equal(deserialized.id, task.id);
  assert.deepEqual(deserialized.skills, task.skills);
  assert.deepEqual(deserialized.files, task.files);
});

test('Universal Task Protocol throws on invalid task schema', () => {
  assert.throws(() => validateTask(null), /non-null object/);
  assert.throws(() => validateTask({ title: 'No ID' }), /valid string id/);
  assert.throws(() => validateTask({ id: '123' }), /valid string title/);
  assert.throws(() => validateTask({ id: '123', title: 'T' }), /target agent/);
});

test('Universal Agent Protocol normalizes capabilities and defines roles', () => {
  const caps = normalizeCapabilities({ subagents: true });
  assert.equal(caps.subagents, true);
  assert.equal(caps.fileAccess, true);
  assert.equal(caps.terminalAccess, true);

  assert.ok(AGENT_ROLES.creativeDirector);
  assert.ok(AGENT_ROLES.frontend);
  assert.ok(AGENT_ROLES.backend);
  assert.equal(AGENT_STATES.WORKING, 'WORKING');
  assert.equal(AGENT_EXPRESSIONS.WORKING, '◉▂◉');
});

test('Universal Event Protocol creates and serializes telemetry events', () => {
  const event = createEvent({
    agent: 'frontend',
    type: EVENT_TYPES.TASK_COMPLETED,
    taskId: 'task-001',
    message: 'Finished layout component synthesis'
  });

  assert.ok(event.id.startsWith('evt-'));
  assert.equal(event.agent, 'frontend');
  assert.equal(event.type, EVENT_TYPES.TASK_COMPLETED);
  assert.ok(validateEvent(event));

  const line = serializeEvent(event);
  const parsed = deserializeEvent(line);
  assert.equal(parsed.id, event.id);
  assert.equal(parsed.message, event.message);
});

test('Universal Skill Protocol validates and categorizes skills', () => {
  const skill = createSkill({
    id: 'frontend/nextjs',
    name: 'Next.js App Router',
    category: SKILL_CATEGORIES.FRONTEND,
    description: 'Server components & SSR streaming',
    targetAgents: ['frontend']
  });

  assert.equal(skill.id, 'frontend/nextjs');
  assert.equal(skill.category, 'frontend');
  assert.ok(validateSkill(skill));
});
