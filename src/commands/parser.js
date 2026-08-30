/**
 * PIXEL CREW — Dual Input & Conversational Intent Parser
 * 
 * Handles tokenization of slash commands, shell-style arguments, and natural language
 * intent routing (e.g. oneshot creation, planning, or contextual follow-up refinement).
 */

export class InputParser {
  /**
   * Tokenizes an input string into arguments respecting quotes
   */
  static tokenize(input = '') {
    const tokens = [];
    let current = '';
    let inQuotes = false;
    let quoteChar = '';

    for (let i = 0; i < input.length; i++) {
      const char = input[i];

      if ((char === '"' || char === "'") && (!inQuotes || quoteChar === char)) {
        if (inQuotes) {
          inQuotes = false;
          quoteChar = '';
        } else {
          inQuotes = true;
          quoteChar = char;
        }
      } else if (char === ' ' && !inQuotes) {
        if (current.length > 0) {
          tokens.push(current);
          current = '';
        }
      } else {
        current += char;
      }
    }

    if (current.length > 0) {
      tokens.push(current);
    }

    return tokens;
  }

  /**
   * Parses raw user input into either a structured command or classified chat intent
   */
  static parse(rawInput = '') {
    const trimmed = (rawInput || '').trim();

    if (!trimmed) {
      return {
        type: 'empty',
        raw: ''
      };
    }

    // 1. Explicit Slash Command
    if (trimmed.startsWith('/')) {
      const tokens = this.tokenize(trimmed);
      const commandWithSlash = tokens[0] || '/';
      const commandName = commandWithSlash.slice(1).toLowerCase();
      const args = tokens.slice(1);

      return {
        type: 'command',
        command: commandName,
        args,
        raw: trimmed,
        fullArgsString: trimmed.slice(commandWithSlash.length).trim()
      };
    }

    // 2. Natural Language Chat & Intent Classification
    const intent = this.classifyIntent(trimmed);
    return {
      type: 'chat',
      content: trimmed,
      intent: intent.type,
      targetAgents: intent.targetAgents,
      suggestedCommand: intent.suggestedCommand,
      raw: trimmed
    };
  }

  /**
   * Classifies conversational chat into action intents
   */
  static classifyIntent(text = '') {
    const lower = text.toLowerCase();

    // Intent: Follow-up / Refinement
    if (
      lower.includes('more editorial') ||
      lower.includes('change color') ||
      lower.includes('make the hero') ||
      lower.includes('make hero') ||
      lower.includes('add section') ||
      lower.includes('refine typography') ||
      lower.includes('adjust animation')
    ) {
      return {
        type: 'refine',
        targetAgents: ['creativeDirector', 'frontend', 'animationSpecialist'],
        suggestedCommand: `/task "${text}"`
      };
    }

    // Intent: OneShot Generation
    if (
      lower.startsWith('build ') ||
      lower.startsWith('create ') ||
      lower.startsWith('generate ') ||
      lower.startsWith('make ') ||
      lower.includes('website for') ||
      lower.includes('portfolio for') ||
      lower.includes('landing page')
    ) {
      return {
        type: 'oneshot',
        targetAgents: ['creativeDirector', 'frontend', 'backend', 'qa'],
        suggestedCommand: `/oneshot ${text}`
      };
    }

    // Intent: Review / Quality
    if (lower.startsWith('review') || lower.startsWith('audit') || lower.includes('check for slop')) {
      return {
        type: 'review',
        targetAgents: ['qa', 'visualCritic'],
        suggestedCommand: `/review`
      };
    }

    // General Task
    return {
      type: 'task',
      targetAgents: ['frontend', 'backend'],
      suggestedCommand: `/task "${text}"`
    };
  }
}
