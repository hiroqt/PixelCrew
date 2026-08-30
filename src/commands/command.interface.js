/**
 * PIXEL CREW — Universal Command Interface
 * 
 * Defines standard contract for slash commands and execution contexts.
 */

export class PixelCommand {
  constructor(options = {}) {
    if (!options.name) {
      throw new Error('Command must have a name');
    }
    this.name = options.name.replace(/^\//, '');
    this.aliases = Array.isArray(options.aliases) ? options.aliases.map(a => a.replace(/^\//, '')) : [];
    this.description = options.description || '';
    this.usage = options.usage || `/${this.name}`;
    this.category = options.category || 'general';
  }

  /**
   * Executes the command with the provided context and parsed arguments
   * @param {object} context
   * @param {string[]} args
   * @returns {Promise<{ success: boolean, message?: string, data?: any, output?: string }>}
   */
  async execute(context, args) {
    throw new Error(`execute() not implemented for command: /${this.name}`);
  }
}
