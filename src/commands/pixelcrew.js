/**
 * PIXEL CREW — Master /pixelcrew Command Dispatcher
 * 
 * Routes subcommands under `/pixelcrew <subcommand> [args]` (e.g. `/pixelcrew craft`, `/pixelcrew critique`, `/pixelcrew bolder`).
 */

import { PixelCommand } from './command.interface.js';

export class MasterPixelCrewCommand extends PixelCommand {
  constructor(commandRegistry) {
    super({
      name: 'pixelcrew',
      aliases: ['pixel', 'impeccable'],
      description: 'Master PixelCrew swarm orchestrator and 23-command execution suite',
      usage: '/pixelcrew <subcommand> [args]',
      category: 'orchestration'
    });
    this.registry = commandRegistry;
  }

  setRegistry(registry) {
    this.registry = registry;
  }

  async execute(context, args = []) {
    const subcommandName = args[0]?.toLowerCase()?.replace(/^\//, '');

    if (!subcommandName || subcommandName === 'help') {
      const allCommands = this.registry ? this.registry.getAllCommands().filter(c => c.name !== 'pixelcrew') : [];
      const lines = [
        '╔══════════════════════════════════════════════════════════════════╗',
        '║   PIXEL CREW — FLOOR 42 MULTI-AGENT COMMAND SUITE               ║',
        '║   Autonomous Retro Tech Startup Office & Engineering Swarm       ║',
        '╚══════════════════════════════════════════════════════════════════╝',
        '',
        '\x1b[1m🚀 FLOOR 42 CREATION & ARCHITECTURE:\x1b[0m',
        '  /assemble [prompt]      Full shape-then-build multi-agent sprint pipeline',
        '  /blueprint [prompt]     Plan UX topologies, wireframes & dynamic DAG task graph',
        '  /boss-fight <issue>     Targeted swarm bug blitz to isolate and conquer errors',
        '  /manifest [--dry-run]   Generate root DESIGN.md and PRODUCT.md blueprints',
        '  /retrofit [--dry-run]   Harvest components and tokens into design system',
        '  /init [--dry-run]       Initialize .pixel-crew/ workspace and context',
        '',
        '\x1b[1m🎨 RETRO AESTHETIC & ANTI-AI DIRECTION:\x1b[0m',
        '  /render                 6-dimension Anti-AI design & UX audit (Score >= 8.5/10)',
        '  /8bit                   Inject retro arcade Web Audio chimes & CRT scanlines',
        '  /overdrive              Engage GPU WebGL shaders & interactive terminal shell',
        '  /chromatic [palette]    Strategic HSL color token calibration & dark mode',
        '  /typeset [preset]       Mathematical fluid clamp() typography scales',
        '  /bento [section]        Asymmetric Bento grid reorganization & fluid gutters',
        '  /de-slop [section]      Strip AI cliché copy with grounded technical specs',
        '  /bolder / /quieter      Amplify visual punch or restore calm minimalist balance',
        '',
        '\x1b[1m🛡️ PRODUCTION HARDENING & SRE:\x1b[0m',
        '  /sentinel               Defensive security: OWASP audit, RFC 7807 envelopes',
        '  /audit                  SRE quality benchmark: a11y WCAG AA/AAA, Core Web Vitals',
        '  /warp                   Full-stack performance tuning & AST prompt token caching',
        '  /polish                 Final shipping readiness pass & strict type check',
        '  /calibrate [viewport]   Multi-viewport calibration (360px mobile to 4K desktop)',
        '  /onboard                Synthesize first-run onboarding & interactive empty states',
        '',
        '\x1b[1m🏢 FLOOR 42 OPERATIONS:\x1b[0m',
        '  /office [--port 4747]   Launch live retro pixel startup office dashboard',
        '  /roster [list|spawn]    Inspect active agent workstations and task assignments',
        '  /sync [--dry-run]       Sync skills across detected IDEs (.claude, .cursor, etc.)',
        '  /doctor                 Diagnose environment, LLM keys & provider runtimes',
        ''
      ];

      return {
        success: true,
        message: 'PixelCrew Floor 42 Command Suite',
        output: lines.join('\n')
      };

    }

    if (!this.registry) {
      return {
        success: false,
        message: `Command registry not attached for /pixelcrew ${subcommandName}`
      };
    }

    const targetCmd = this.registry.getCommand(subcommandName);
    if (!targetCmd || targetCmd === this) {
      return {
        success: false,
        message: `Unknown subcommand: "/pixelcrew ${subcommandName}". Type "/pixelcrew help" to view all 23 commands.`,
        output: `\x1b[31mUnknown subcommand:\x1b[0m /pixelcrew ${subcommandName}\nRun \x1b[36m/pixelcrew help\x1b[0m to list available commands.`
      };
    }

    return await targetCmd.execute(context, args.slice(1));
  }
}
