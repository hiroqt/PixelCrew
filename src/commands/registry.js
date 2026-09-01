/**
 * PIXEL CREW — Command Registry & Dispatcher
 * 
 * Manages command registration, fuzzy autocomplete matching, and execution dispatch.
 */

import path from 'node:path';
import fs from 'node:fs/promises';
import { InputParser } from './parser.js';
import { MasterPixelCrewCommand } from './pixelcrew.js';
import { AssembleCommand } from './assemble.js';
import { BlueprintCommand } from './blueprint.js';
import { BossFightCommand } from './boss-fight.js';
import { RetrofitCommand } from './retrofit.js';
import { ManifestCommand } from './manifest.js';
import { RenderCommand } from './render.js';
import { EightBitCommand } from './eight-bit.js';
import { ChromaticCommand } from './chromatic.js';
import { BentoCommand } from './bento.js';
import { DeSlopCommand } from './de-slop.js';
import { SentinelCommand } from './sentinel.js';
import { WarpCommand } from './warp.js';
import { CalibrateCommand } from './calibrate.js';
import { OfficeCommand } from './office.js';
import { RosterCommand } from './roster.js';
import { CraftCommand } from './craft.js';
import { ShapeCommand } from './shape.js';
import { DocumentCommand } from './document.js';
import { ExtractCommand } from './extract.js';
import { CritiqueCommand } from './critique.js';
import { AuditCommand } from './audit.js';
import { PolishCommand } from './polish.js';
import { BolderCommand } from './bolder.js';
import { QuieterCommand } from './quieter.js';
import { DistillCommand } from './distill.js';
import { HardenCommand } from './harden.js';
import { OnboardCommand } from './onboard.js';
import { AnimateCommand } from './animate.js';
import { ColorizeCommand } from './colorize.js';
import { TypesetCommand } from './typeset.js';
import { LayoutCommand } from './layout.js';
import { DelightCommand } from './delight.js';
import { OverdriveCommand } from './overdrive.js';
import { ClarifyCommand } from './clarify.js';
import { AdaptCommand } from './adapt.js';
import { OptimizeCommand } from './optimize.js';
import { LiveCommand } from './live.js';
import { PlanCommand } from './plan.js';
import { RecapCommand } from './recap.js';

import { BuildCommand } from './build.js';
import { CrewCommand } from './crew.js';
import { SkillsCommand } from './skills.js';
import { StatusCommand } from './status.js';
import { ReviewCommand } from './review.js';
import { FixCommand } from './fix.js';
import { DoctorCommand } from './doctor.js';
import { StopCommand, ResumeCommand } from './stop.js';
import { DeployCommand } from './deploy.js';
import { AddCommand } from './add.js';
import { SyncCommand } from './sync.js';
import { InstallCommand } from './install.js';

export class CommandRegistry {
  constructor() {
    this.commands = new Map();
    this.aliases = new Map();

    // 1. Register master dispatcher
    const master = new MasterPixelCrewCommand(this);
    this.register(master);

    // 2. Register Floor 42 Themed Swarm Commands
    this.register(new AssembleCommand());
    this.register(new BlueprintCommand());
    this.register(new BossFightCommand());
    this.register(new RetrofitCommand());
    this.register(new ManifestCommand());
    this.register(new RenderCommand());
    this.register(new EightBitCommand());
    this.register(new ChromaticCommand());
    this.register(new BentoCommand());
    this.register(new DeSlopCommand());
    this.register(new SentinelCommand());
    this.register(new WarpCommand());
    this.register(new CalibrateCommand());
    this.register(new OfficeCommand());
    this.register(new RosterCommand());

    // 3. Register Core & Aesthetic Tuning Commands
    this.register(new TypesetCommand());
    this.register(new OverdriveCommand());
    this.register(new AuditCommand());
    this.register(new PolishCommand());
    this.register(new OnboardCommand());
    this.register(new AnimateCommand());
    this.register(new BolderCommand());
    this.register(new QuieterCommand());
    this.register(new DistillCommand());
    this.register(new PlanCommand());
    this.register(new BuildCommand());
    this.register(new SkillsCommand());
    this.register(new StatusCommand());

    this.register(new DoctorCommand());
    this.register(new StopCommand());
    this.register(new ResumeCommand());
    this.register(new DeployCommand());
    this.register(new AddCommand());
    this.register(new SyncCommand());
    this.register(new InstallCommand());

    // 4. Inspection & Recap
    this.register(new RecapCommand());
  }




  register(command) {
    if (!command?.name) {
      throw new Error('Command must have a name');
    }
    this.commands.set(command.name.toLowerCase(), command);
    if (Array.isArray(command.aliases)) {
      for (const alias of command.aliases) {
        this.aliases.set(alias.toLowerCase(), command.name.toLowerCase());
      }
    }
  }

  getCommand(nameOrAlias) {
    if (!nameOrAlias) return null;
    const clean = nameOrAlias.replace(/^\//, '').toLowerCase();
    if (this.commands.has(clean)) {
      return this.commands.get(clean);
    }
    if (this.aliases.has(clean)) {
      const canonical = this.aliases.get(clean);
      return this.commands.get(canonical);
    }
    return null;
  }

  getAllCommands() {
    return Array.from(this.commands.values());
  }

  /**
   * Returns autocomplete suggestions based on partial input query (e.g. "/" or "/on")
   */
  getAutocompleteSuggestions(query = '') {
    const clean = query.replace(/^\//, '').toLowerCase().trim();
    const suggestions = [];

    for (const cmd of this.commands.values()) {
      if (!clean || cmd.name.startsWith(clean) || cmd.aliases.some(a => a.startsWith(clean))) {
        suggestions.push({
          name: `/${cmd.name}`,
          description: cmd.description,
          usage: cmd.usage,
          category: cmd.category
        });
      }
    }

    return suggestions;
  }

  /**
   * Helper to broadcast command telemetry to local engine, daemon server, and events.jsonl
   */
  async _emitTelemetry(context, event) {
    // 1. Direct Engine Broadcast
    if (context.engine?.emitEvent) {
      try {
        await context.engine.emitEvent(event);
      } catch {}
    }

    // 2. Persist to events.jsonl
    const targetDir = context.targetDir || process.cwd();
    const possiblePaths = [
      path.join(targetDir, '.pixel-crew', 'events.jsonl'),
      path.join(targetDir, '.pixel-agents', 'events.jsonl')
    ];

    for (const p of possiblePaths) {
      try {
        const parent = path.dirname(p);
        const parentExists = await fs.access(parent).then(() => true).catch(() => false);
        if (parentExists) {
          await fs.appendFile(p, JSON.stringify(event) + '\n', 'utf-8');
        }
      } catch {}
    }

    // 3. Notify Running Dashboard Daemon if active
    try {
      const daemonPaths = [
        path.join(targetDir, '.pixel-crew', 'daemon.json'),
        path.join(targetDir, '.pixel-agents', 'daemon.json')
      ];
      for (const dPath of daemonPaths) {
        try {
          const raw = await fs.readFile(dPath, 'utf-8');
          const info = JSON.parse(raw);
          if (info?.url) {
            await fetch(`${info.url}/api/emit`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(event),
              signal: AbortSignal.timeout(400)
            });
            break;
          }
        } catch {}
      }
    } catch {}
  }

  _inferAgentFromCommand(cmdName) {
    const c = (cmdName || '').toLowerCase();
    if (['assemble', 'craft', 'oneshot', 'init', 'manifest', 'recap'].includes(c)) return 'orchestrator';
    if (['blueprint', 'shape', 'plan'].includes(c)) return 'uxPlanner';
    if (['render', 'critique', 'review'].includes(c)) return 'creativeDirector';
    if (['typeset', 'bento', 'chromatic', 'colorize', 'retrofit'].includes(c)) return 'designSystem';
    if (['bolder', 'quieter', 'de-slop', 'clarify', '8bit', 'delight', 'overdrive', 'build'].includes(c)) return 'frontend';
    if (['sentinel', 'harden'].includes(c)) return 'security';
    if (['audit', 'polish', 'boss-fight', 'fix'].includes(c)) return 'qa';
    if (['warp', 'optimize', 'calibrate', 'adapt'].includes(c)) return 'performance';
    return 'orchestrator';
  }

  /**
   * Dispatches execution from raw input string or structured command
   */
  async execute(input, context = {}) {
    const parsed = typeof input === 'string' ? InputParser.parse(input) : input;

    if (parsed.type === 'empty') {
      return { success: false, message: 'Empty command or message' };
    }

    if (parsed.type === 'command') {
      const cmd = this.getCommand(parsed.command);
      if (!cmd) {
        return {
          success: false,
          message: `Unknown command: "/${parsed.command}". Type "/" to see available commands.`
        };
      }

      const agentPersona = this._inferAgentFromCommand(cmd.name);
      const now = Date.now();

      // Emit Start Event to Dashboard
      await this._emitTelemetry(context, {
        agent: agentPersona,
        type: 'tool',
        skill: cmd.name,
        message: `[/${cmd.name}] Executing command${parsed.args?.length ? `: ${parsed.args.join(' ')}` : ''}`,
        timestamp: now,
        metadata: {
          command: cmd.name,
          args: parsed.args,
          source: 'command_execution'
        }
      });

      const res = await cmd.execute(context, parsed.args || []);

      // Emit Completion Event to Dashboard
      await this._emitTelemetry(context, {
        agent: agentPersona,
        type: res?.success === false ? 'error' : 'complete',
        skill: cmd.name,
        message: `[/${cmd.name}] ${res?.message || (res?.success === false ? 'Command failed' : 'Execution completed')}`,
        timestamp: Date.now(),
        metadata: {
          command: cmd.name,
          success: res?.success !== false
        }
      });

      return res;
    }

    // Natural Language Chat Routing
    if (parsed.intent === 'oneshot') {
      const oneshotCmd = this.getCommand('oneshot');
      return await oneshotCmd.execute(context, [parsed.content]);
    } else if (parsed.intent === 'plan') {
      const planCmd = this.getCommand('plan');
      return await planCmd.execute(context, [parsed.content]);
    } else if (parsed.intent === 'review') {
      const reviewCmd = this.getCommand('review');
      return await reviewCmd.execute(context, []);
    } else {
      // General task execution
      if (context.engine?.submitTask) {
        const res = await context.engine.submitTask(parsed.content, context.options || {});
        return {
          success: true,
          message: `Task executed: "${parsed.content}"`,
          data: res
        };
      }
      return {
        success: true,
        message: `Processed intent: ${parsed.intent}`,
        data: parsed
      };
    }
  }
}

