/**
 * PIXEL CREW — Core Event Bus & Telemetry Stream
 * 
 * Provides unified pub/sub, append-only disk logging, and live SSE multiplexing.
 */

import { EventEmitter } from 'node:events';
import fs from 'node:fs/promises';
import fsSync from 'node:fs';
import path from 'node:path';
import { createEvent, serializeEvent, EVENT_TYPES } from '../protocol/event.js';

export class EventBus extends EventEmitter {
  constructor(options = {}) {
    super();
    this.maxHistory = options.maxHistory || 300;
    this.history = [];
    this.logFilePaths = options.logFilePaths || [];
    this.isPersisting = false;
    this.pendingWrites = [];
  }

  addLogFilePath(filePath) {
    if (filePath && !this.logFilePaths.includes(filePath)) {
      this.logFilePaths.push(filePath);
    }
  }

  /**
   * Publishes an event to memory, emits to listeners, and asynchronously writes to disk
   */
  async emitEvent(eventInput) {
    const event = eventInput?.id && eventInput?.timestamp ? eventInput : createEvent(eventInput);

    this.history.push(event);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    // Emit typed and generic events
    this.emit('event', event);
    this.emit(event.type || 'progress', event);

    // Queue for disk persistence
    if (this.logFilePaths.length > 0) {
      this.pendingWrites.push(serializeEvent(event) + '\n');
      this.flushLogs().catch(() => {});
    }

    return event;
  }

  getHistory(limit = 100) {
    return this.history.slice(-limit);
  }

  clearHistory() {
    this.history = [];
  }

  async flushLogs() {
    if (this.isPersisting || this.pendingWrites.length === 0) return;
    this.isPersisting = true;

    const chunk = this.pendingWrites.join('');
    this.pendingWrites = [];

    for (const logPath of this.logFilePaths) {
      try {
        await fs.mkdir(path.dirname(logPath), { recursive: true });
        await fs.appendFile(logPath, chunk, 'utf-8');
      } catch (err) {
        // Disk write fallback or ignore
      }
    }

    this.isPersisting = false;
    if (this.pendingWrites.length > 0) {
      setImmediate(() => this.flushLogs());
    }
  }

  async loadFromDisk(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n').filter(Boolean);
      for (const line of lines) {
        try {
          const evt = JSON.parse(line);
          this.history.push(evt);
        } catch {}
      }
      if (this.history.length > this.maxHistory) {
        this.history = this.history.slice(-this.maxHistory);
      }
    } catch {}
  }
}
