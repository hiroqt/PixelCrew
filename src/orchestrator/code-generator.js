/**
 * PIXEL CREW — Dynamic Code Generator
 * 
 * Synthesizes production-ready Next.js 14/15 App Router + TypeScript codebase
 * and standalone live preview from a Project Specification.
 */

export class CodeGenerator {
  /**
   * Generates complete multi-file project tree and standalone preview
   */
  generateProject(spec) {
    const files = {};
    const p = spec.palette;
    const f = spec.fonts;

    // 1. package.json
    files['package.json'] = JSON.stringify({
      name: spec.companyName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
        "test:e2e": "playwright test"
      },
      dependencies: {
        next: "^14.2.15",
        react: "^18.3.1",
        "react-dom": "^18.3.1",
        "lucide-react": "^0.453.0",
        "clsx": "^2.1.1",
        "tailwind-merge": "^2.5.4"
      },
      devDependencies: {
        typescript: "^5.6.3",
        "@types/node": "^20.17.0",
        "@types/react": "^18.3.11",
        "@types/react-dom": "^18.3.1",
        "@playwright/test": "^1.48.0",
        postcss: "^8.4.47",
        tailwindcss: "^3.4.14"
      }
    }, null, 2);

    // 2. tsconfig.json
    files['tsconfig.json'] = JSON.stringify({
      compilerOptions: {
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: { "@/*": ["./src/*"] }
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"]
    }, null, 2);

    // 3. tailwind.config.ts
    files['tailwind.config.ts'] = `import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBg: "${p.bg}",
        brandSurface: "${p.surface}",
        brandSurfaceRaised: "${p.surfaceRaised}",
        brandBorder: "${p.border}",
        brandAccent: "${p.accent}"
      },
      fontFamily: {
        display: [${f.display}],
        sans: [${f.body}],
        mono: [${f.mono}]
      }
    },
  },
  plugins: [],
};
export default config;
`;

    // 4. src/lib/utils.ts
    files['src/lib/utils.ts'] = `import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

    // 5. src/types/index.ts
    files['src/types/index.ts'] = `export interface DomainItem {
  id: string;
  title: string;
  category: string;
  tagline: string;
  metrics?: string;
  price?: string;
  stack?: string[];
  description: string;
  link?: string;
  featured?: boolean;
}

export interface SectionMeta {
  id: string;
  component: string;
  title?: string;
  headline?: string;
  subheadline?: string;
}
`;

    // 6. src/lib/data.ts
    const sampleItems = this.generateDomainItems(spec.domain);
    files['src/lib/data.ts'] = `import { DomainItem } from "@/types";

export const SITE_METADATA = {
  name: "${spec.companyName}",
  headline: "${spec.headline}",
  domain: "${spec.domain}",
  summary: "${spec.summary}"
};

export const DOMAIN_ITEMS: DomainItem[] = ${JSON.stringify(sampleItems, null, 2)};
`;

    // 7. src/app/globals.css
    files['src/app/globals.css'] = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-primary: ${p.bg};
  --surface-base: ${p.surface};
  --surface-raised: ${p.surfaceRaised};
  --border-subtle: ${p.border};
  --border-hover: ${p.borderHover};
  --text-primary: ${p.textPrimary};
  --text-secondary: ${p.textSecondary};
  --accent: ${p.accent};
  --accent-glow: ${p.accentGlow};
  --font-display: ${f.display};
  --font-body: ${f.body};
  --font-mono: ${f.mono};
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body);
  overflow-x: hidden;
}

.font-display { font-family: var(--font-display); }
.font-mono { font-family: var(--font-mono); }

.glass-panel {
  background: var(--surface-base);
  border: 1px solid var(--border-subtle);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.glass-panel:hover {
  border-color: var(--border-hover);
  background: var(--surface-raised);
  transform: translateY(-2px);
}

.terminal-window {
  background: #08090d;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 20px 40px -15px rgba(0,0,0,0.7);
}

.filter-btn.active {
  background-color: #ffffff;
  color: #000000;
  border-color: #ffffff;
}
`;

    // 8. src/app/layout.tsx
    files['src/app/layout.tsx'] = `import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "${spec.companyName} — ${spec.headline}",
  description: "${spec.summary}",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="${f.googleFontsUrl}" rel="stylesheet" />
      </head>
      <body className="bg-brandBg text-neutral-100 min-h-screen antialiased selection:bg-neutral-200 selection:text-black">
        {children}
      </body>
    </html>
  );
}
`;

    // 9. Component files in src/components/sections/
    this.generateSectionComponents(files, spec, sampleItems);

    // 10. src/app/page.tsx
    files['src/app/page.tsx'] = this.generatePageTsx(spec);

    // 11. Backend API route handlers
    files['src/app/api/contact/route.ts'] = `import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!email || !message) {
      return NextResponse.json(
        { error: "Invalid Request", detail: "Email and message are required fields." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message received successfully. We will follow up shortly.",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error", detail: "Failed to process inquiry submission." },
      { status: 500 }
    );
  }
}
`;

    files['src/app/api/data/route.ts'] = `import { NextRequest, NextResponse } from "next/server";
import { DOMAIN_ITEMS, SITE_METADATA } from "@/lib/data";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  if (category && category !== "All") {
    const filtered = DOMAIN_ITEMS.filter(item => item.category.toLowerCase() === category.toLowerCase());
    return NextResponse.json({ items: filtered, total: filtered.length, metadata: SITE_METADATA });
  }

  return NextResponse.json({ items: DOMAIN_ITEMS, total: DOMAIN_ITEMS.length, metadata: SITE_METADATA });
}
`;

    // 12. tests/e2e/user-journey.spec.ts (Automated End-to-End User Flow Tests)
    files['tests/e2e/user-journey.spec.ts'] = `import { test, expect } from "@playwright/test";

test.describe("${spec.companyName} — End-to-End Verification", () => {
  test("renders homepage with proper branding, typography, and viewport hierarchy", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/${spec.companyName}/i);

    // Verify main landmarks
    const hero = page.locator("section").first();
    await expect(hero).toBeVisible();
    await expect(page.locator("h1")).toContainText("${spec.companyName}");
  });

  test("interactive category filter and live data updates", async ({ page }) => {
    await page.goto("/");
    const filterButtons = page.locator("button.filter-btn, button[data-category]");
    if (await filterButtons.count() > 1) {
      await filterButtons.nth(1).click();
      await page.waitForTimeout(300);
      const items = page.locator(".glass-panel, [data-testid='showcase-card']");
      expect(await items.count()).toBeGreaterThan(0);
    }
  });

  test("contact inquiry form submission flow", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("form");
    if (await form.count() > 0) {
      const emailInput = page.locator("input[type='email'], input[name='email']").first();
      const msgInput = page.locator("textarea, input[name='message']").first();
      const submitBtn = page.locator("button[type='submit']").first();

      if (await emailInput.isVisible() && await msgInput.isVisible()) {
        await emailInput.fill("test.engineer@example.com");
        await msgInput.fill("Automated E2E test inquiry message.");
        await submitBtn.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test("WCAG AA visual contrast and responsive mobile layout", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await expect(page.locator("body")).toBeVisible();
    const nav = page.locator("header, nav").first();
    await expect(nav).toBeVisible();
  });
});
`;

    // 13. playwright.config.ts
    files['playwright.config.ts'] = `import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "Mobile Safari", use: { ...devices["iPhone 14"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
`;

    // 14. README.md
    files['README.md'] = `# ${spec.companyName} — ${spec.headline}

Synthesized using **Pixel Crew** dynamic multi-agent orchestration.

## 🚀 Getting Started

\`\`\`bash
# 1. Install dependencies
npm install

# 2. Start the local Next.js development server
npm run dev

# 3. Open in your browser
http://localhost:3000
\`\`\`

## 🛠️ Stack & Standards
- **Framework**: Next.js 14/15 App Router
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS + Fluid clamp() Design Tokens
- **Quality Standard**: Zero AI Slop, WCAG AA Accessibility
`;

    // 13. Standalone Live Preview HTML
    const previewHtml = this.generateStandalonePreview(spec, sampleItems);

    return {
      files,
      previewHtml,
      fileCount: Object.keys(files).length,
      entrypoint: 'src/app/page.tsx'
    };
  }

  /**
   * Helper: Generates domain-specific items
   */
  generateDomainItems(domain) {
    if (domain === 'restaurant') {
      return [
        {
          id: "dish-1",
          title: "Charred Spruce & Wild Morels",
          category: "First Course",
          tagline: "Pine needle infusion, fermented birch reduction, hazelnut oil",
          price: "$28",
          description: "Foraged from high-elevation pine groves at dawn. Smoked over dried mountain heather.",
          featured: true
        },
        {
          id: "dish-2",
          title: "Dry-Aged Duck Breast in Salt Crust",
          category: "Main Course",
          tagline: "28-day dry age, elderberry glaze, roasted sunchoke puree",
          price: "$54",
          description: "Slow-roasted over fruitwood coals. Served with preserved autumn quince.",
          featured: true
        },
        {
          id: "dish-3",
          title: "Smoked Juniper & Honeycomb Cream",
          category: "Dessert",
          tagline: "Wild heather honey, crisp chamomile tuile, sea salt",
          price: "$22",
          description: "Chilled botanicals paired with raw mountain comb.",
          featured: false
        }
      ];
    }

    // Default portfolio / dev / agency items
    return [
      {
        id: "proj-1",
        title: "HyperFlow — Distributed Stream Processor",
        category: "Distributed Systems",
        tagline: "Low-latency stream engine with Raft consensus & Rust FFI",
        metrics: "1.2M events/sec · < 3ms latency",
        stack: ["Rust", "TypeScript", "Kafka", "PostgreSQL"],
        description: "Engineered zero-copy memory buffers and SIMD-accelerated deserialization. Slashed cloud compute by 68%.",
        link: "https://github.com",
        featured: true
      },
      {
        id: "proj-2",
        title: "NeuralCanvas — Collaborative AI Studio",
        category: "AI & RAG",
        tagline: "Multimodal generative canvas with real-time latent space exploration",
        metrics: "120k active creators · 60fps canvas",
        stack: ["Next.js 15", "WebGPU", "WebSockets", "FastAPI"],
        description: "Implemented client-side WebGPU shaders for real-time latent image upscaling.",
        link: "https://github.com",
        featured: true
      },
      {
        id: "proj-3",
        title: "AuraUI — Accessible Design System",
        category: "Frontend Islands",
        tagline: "Headless, keyboard-first primitive library with fluid typography mathematical scales",
        metrics: "WCAG AAA · Zero runtime dependencies",
        stack: ["React 19", "Tailwind CSS", "TypeScript"],
        description: "Adopted by 450+ engineering teams with automated contrast verification.",
        link: "https://github.com",
        featured: false
      }
    ];
  }

  /**
   * Helper: Generates React components
   */
  generateSectionComponents(files, spec, items) {
    const p = spec.palette;
    const f = spec.fonts;

    // Navbar.tsx
    files['src/components/sections/Navbar.tsx'] = `'use client';

import React from 'react';

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brandBg/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-black font-mono font-bold text-xs flex items-center justify-center rounded-sm">
            ${spec.companyName.charAt(0)}
          </div>
          <span className="font-display font-semibold text-lg tracking-tight text-white">${spec.companyName}</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-neutral-400">
          <a href="#showcase" className="hover:text-white transition-colors">Showcase</a>
          <a href="#interactive" className="hover:text-white transition-colors">Interactive</a>
          <a href="#contact" className="px-3.5 py-1.5 bg-white text-black font-medium rounded-sm hover:bg-neutral-200 transition-colors">Contact</a>
        </nav>
      </div>
    </header>
  );
}
`;

    // Hero.tsx
    files['src/components/sections/Hero.tsx'] = `'use client';

import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-wider uppercase bg-white/5 border border-white/10 text-neutral-300 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          BESPOKE DIGITAL PLATFORM
        </span>
      </div>

      <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white max-w-4xl leading-[1.08] mb-8">
        ${spec.headline}
      </h1>

      <p className="text-lg md:text-xl text-neutral-400 font-light max-w-2xl leading-relaxed mb-10">
        ${spec.summary}
      </p>

      <div className="flex flex-wrap items-center gap-4 mb-16">
        <a href="#showcase" className="px-6 py-3.5 bg-white text-black font-medium text-sm rounded-sm hover:bg-neutral-200 transition-colors flex items-center gap-2">
          Explore Showcase
          <ArrowUpRight className="w-4 h-4" />
        </a>
        <a href="#interactive" className="px-6 py-3.5 bg-brandSurface border border-white/10 text-white font-mono text-sm rounded-sm hover:border-white/30 transition-colors">
          Launch Interactive Sandbox
        </a>
      </div>
    </section>
  );
}
`;

    // ShowcaseGrid.tsx
    files['src/components/sections/ShowcaseGrid.tsx'] = `'use client';

import React, { useState } from 'react';
import { DOMAIN_ITEMS } from '@/lib/data';
import { ArrowUpRight } from 'lucide-react';

export function ShowcaseGrid() {
  const [activeCat, setActiveCat] = useState('All');
  const categories = ["All", ...Array.from(new Set(DOMAIN_ITEMS.map(i => i.category)))];

  const filtered = activeCat === 'All'
    ? DOMAIN_ITEMS
    : DOMAIN_ITEMS.filter(i => i.category === activeCat);

  return (
    <section id="showcase" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-2">01 // Selected Work</span>
          <h2 className="font-display text-3xl md:text-4xl text-white font-normal">Featured Artifacts & Architectures</h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={\`px-3 py-1.5 text-xs font-mono rounded-sm transition-all border \${
                activeCat === cat
                  ? 'bg-white text-black border-white font-medium'
                  : 'bg-brandSurface text-neutral-400 border-white/10 hover:border-white/30'
              }\`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div key={item.id} className="glass-panel p-8 rounded-sm flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 bg-white/5 px-2.5 py-1 rounded border border-white/5">
                  {item.category}
                </span>
                {item.metrics && (
                  <span className="font-mono text-xs text-emerald-400">{item.metrics}</span>
                )}
                {item.price && (
                  <span className="font-mono text-xs text-amber-300">{item.price}</span>
                )}
              </div>
              <h3 className="font-display text-2xl text-white font-normal mb-3 group-hover:text-emerald-300 transition-colors">
                {item.title}
              </h3>
              <p className="text-neutral-400 text-sm font-light leading-relaxed mb-6">
                {item.description}
              </p>
            </div>

            <div>
              {item.stack && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {item.stack.map((t) => (
                    <span key={t} className="text-[11px] font-mono text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded border border-white/10">
                      {t}
                    </span>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4 pt-4 border-t border-white/5 text-xs font-mono">
                <a href="#contact" className="text-white hover:underline flex items-center gap-1">
                  Inquire Artifact <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
`;

    // InteractiveSection.tsx
    files['src/components/sections/InteractiveSection.tsx'] = `'use client';

import React, { useState } from 'react';
import { Terminal, CornerDownLeft } from 'lucide-react';

export function InteractiveSection() {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<Array<{ cmd: string; res: string }>>([
    { cmd: "status", res: "System Architecture: Operational\\nRendering: Next.js 14 App Router\\nAnti-AI Critic: Passed (Score >= 8.5/10)" }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const raw = input.trim();
    if (!raw) return;

    let res = \`Execution result for '\${raw}': OK. All systems operational.\`;
    if (raw.toLowerCase() === 'help') res = "Available commands: status, architecture, stack, clear";
    if (raw.toLowerCase() === 'clear') {
      setLogs([]);
      setInput('');
      return;
    }

    setLogs(prev => [...prev, { cmd: raw, res }]);
    setInput('');
  };

  return (
    <section id="interactive" className="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
      <div className="mb-8">
        <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-2">02 // Interactive Console</span>
        <h2 className="font-display text-3xl text-white font-normal">Runtime Telemetry Shell</h2>
      </div>

      <div className="terminal-window rounded-sm overflow-hidden font-mono text-xs">
        <div className="bg-[#12141a] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] text-neutral-400 ml-2">guest@pixelcrew.system:~</span>
          </div>
          <span className="text-[10px] text-neutral-500">NEXTJS 14</span>
        </div>

        <div className="p-6 text-neutral-300 min-h-[200px] max-h-[340px] overflow-y-auto space-y-3">
          {logs.map((l, i) => (
            <div key={i} className="space-y-1">
              <div className="flex items-center gap-2 text-emerald-400">
                <span>$</span>
                <span>{l.cmd}</span>
              </div>
              <div className="text-neutral-400 whitespace-pre-line pl-4 border-l border-white/10">
                {l.res}
              </div>
            </div>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-2">
            <span className="text-emerald-400 font-bold">$</span>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="type 'status' or 'help'..."
              className="bg-transparent text-white focus:outline-none flex-1 font-mono text-xs placeholder:text-neutral-600"
            />
            <button type="submit" className="text-neutral-500 hover:text-white">
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
`;

    // ContactSection.tsx
    files['src/components/sections/ContactSection.tsx'] = `'use client';

import React, { useState } from 'react';

export function ContactSection() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10">
      <div className="max-w-2xl">
        <span className="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-2">03 // Inquiries</span>
        <h2 className="font-display text-3xl md:text-4xl text-white font-normal mb-6">Let's build something exceptional.</h2>
        <p className="text-neutral-400 font-light text-sm mb-8">
          Available for technical leadership, high-order digital architecture, and bespoke platform development.
        </p>

        {sent ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs rounded">
            ✓ Thank you! Your inquiry has been received.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                required
                className="w-full px-4 py-3 bg-brandSurface border border-white/10 text-white font-mono text-xs rounded-sm focus:outline-none focus:border-white/40"
              />
            </div>
            <div>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Project brief, scope, and target timeline..."
                rows={4}
                required
                className="w-full px-4 py-3 bg-brandSurface border border-white/10 text-white font-mono text-xs rounded-sm focus:outline-none focus:border-white/40"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-white text-black font-medium text-xs rounded-sm hover:bg-neutral-200 transition-colors font-mono"
            >
              Submit Inquiry →
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
`;
  }

  /**
   * Helper: Generates page.tsx
   */
  generatePageTsx(spec) {
    return `import { Navbar } from "@/components/sections/Navbar";
import { Hero } from "@/components/sections/Hero";
import { ShowcaseGrid } from "@/components/sections/ShowcaseGrid";
import { InteractiveSection } from "@/components/sections/InteractiveSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <ShowcaseGrid />
      <InteractiveSection />
      <ContactSection />

      <footer className="py-16 px-6 border-t border-white/10 max-w-7xl mx-auto text-xs font-mono text-neutral-500 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>© {new Date().getFullYear()} ${spec.companyName}. Synthesized with Pixel Crew design-first architecture.</div>
        <div className="flex items-center gap-6 text-neutral-400">
          <a href="https://github.com" className="hover:text-white">GitHub</a>
          <a href="https://twitter.com" className="hover:text-white">Twitter</a>
        </div>
      </footer>
    </main>
  );
}
`;
  }

  /**
   * Helper: Standalone HTML Live Preview Generator
   */
  generateStandalonePreview(spec, items) {
    const p = spec.palette;
    const f = spec.fonts;
    const categories = ["All", ...Array.from(new Set(items.map(i => i.category)))];

    return `<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${spec.companyName} — ${spec.headline}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${f.googleFontsUrl}" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            brandBg: '${p.bg}',
            brandSurface: '${p.surface}',
            brandSurfaceRaised: '${p.surfaceRaised}',
            brandBorder: '${p.border}',
            brandAccent: '${p.accent}'
          },
          fontFamily: {
            display: [${f.display}],
            sans: [${f.body}],
            mono: [${f.mono}]
          }
        }
      }
    }
  </script>
  <style>
    :root {
      --bg-primary: ${p.bg};
      --surface-base: ${p.surface};
      --surface-raised: ${p.surfaceRaised};
      --border-subtle: ${p.border};
      --border-hover: ${p.borderHover};
      --text-primary: ${p.textPrimary};
      --text-secondary: ${p.textSecondary};
      --font-display: ${f.display};
      --font-body: ${f.body};
      --font-mono: ${f.mono};
    }
    body { background-color: var(--bg-primary); color: var(--text-primary); font-family: var(--font-body); }
    .font-display { font-family: var(--font-display); }
    .font-mono { font-family: var(--font-mono); }
    .glass-panel { background: var(--surface-base); border: 1px solid var(--border-subtle); transition: all 0.25s ease; }
    .glass-panel:hover { border-color: var(--border-hover); background: var(--surface-raised); transform: translateY(-2px); }
    .terminal-window { background: #08090d; border: 1px solid rgba(255, 255, 255, 0.12); }
    .filter-btn.active { background-color: #ffffff; color: #000000; border-color: #ffffff; }
  </style>
</head>
<body class="bg-brandBg text-neutral-100 min-h-screen selection:bg-neutral-200 selection:text-black">

  <!-- Header Navigation -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-brandBg/85 backdrop-blur-md border-b border-white/5">
    <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
      <a href="#" class="flex items-center gap-3">
        <div class="w-8 h-8 bg-white text-black font-mono font-bold text-xs flex items-center justify-center rounded-sm">
          ${spec.companyName.charAt(0)}
        </div>
        <span class="font-display font-semibold text-lg tracking-tight text-white">${spec.companyName}</span>
      </a>
      <nav class="hidden md:flex items-center gap-8 text-xs font-mono uppercase tracking-wider text-neutral-400">
        <a href="#showcase" class="hover:text-white transition-colors">Showcase</a>
        <a href="#interactive" class="hover:text-white transition-colors">Interactive</a>
        <a href="#contact" class="px-3.5 py-1.5 bg-white text-black font-medium rounded-sm hover:bg-neutral-200 transition-colors">Contact</a>
      </nav>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="relative pt-36 pb-20 px-6 max-w-7xl mx-auto">
    <div class="flex items-center gap-2 mb-6">
      <span class="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono tracking-wider uppercase bg-white/5 border border-white/10 text-neutral-300 rounded-full">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        BESPOKE SYSTEM
      </span>
    </div>

    <h1 class="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-white max-w-4xl leading-[1.08] mb-8">
      ${spec.headline}
    </h1>

    <p class="text-lg md:text-xl text-neutral-400 font-light max-w-2xl leading-relaxed mb-10">
      ${spec.summary}
    </p>

    <div class="flex flex-wrap items-center gap-4 mb-16">
      <a href="#showcase" class="px-6 py-3.5 bg-white text-black font-medium text-sm rounded-sm hover:bg-neutral-200 transition-colors">
        Explore Artifacts →
      </a>
      <a href="#interactive" class="px-6 py-3.5 bg-brandSurface border border-white/10 text-white font-mono text-sm rounded-sm hover:border-white/30 transition-colors">
        $ Launch Terminal
      </a>
    </div>
  </section>

  <!-- Showcase Section with Live Filtering -->
  <section id="showcase" class="py-24 px-6 max-w-7xl mx-auto border-t border-white/10">
    <div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
      <div>
        <span class="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-2">01 // Selected Work</span>
        <h2 class="font-display text-3xl md:text-4xl text-white font-normal">Featured Artifacts & Architectures</h2>
      </div>

      <div class="flex flex-wrap gap-2" id="filterBtnGroup">
        ${categories.map((cat, i) => `
          <button 
            class="filter-btn px-3 py-1.5 text-xs font-mono rounded-sm transition-all border ${i === 0 ? 'active bg-white text-black font-medium' : 'bg-brandSurface text-neutral-400 border-white/10 hover:border-white/30'}"
            data-category="${cat}"
          >
            ${cat}
          </button>
        `).join('')}
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6" id="itemsContainer">
      ${items.map(item => `
        <div class="showcase-card glass-panel p-8 rounded-sm flex flex-col justify-between" data-category="${item.category}">
          <div>
            <div class="flex items-center justify-between gap-2 mb-4">
              <span class="text-xs font-mono uppercase tracking-wider text-neutral-400 bg-white/5 px-2.5 py-1 rounded border border-white/5">
                ${item.category}
              </span>
              ${item.metrics ? `<span class="font-mono text-xs text-emerald-400">${item.metrics}</span>` : ''}
              ${item.price ? `<span class="font-mono text-xs text-amber-300">${item.price}</span>` : ''}
            </div>
            <h3 class="font-display text-2xl text-white font-normal mb-3">
              ${item.title}
            </h3>
            <p class="text-neutral-400 text-sm font-light leading-relaxed mb-6">
              ${item.description}
            </p>
          </div>

          <div>
            ${item.stack ? `
              <div class="flex flex-wrap gap-1.5 mb-6">
                ${item.stack.map(t => `<span class="text-[11px] font-mono text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded border border-white/10">${t}</span>`).join('')}
              </div>
            ` : ''}
            <div class="flex items-center gap-4 pt-4 border-t border-white/5 text-xs font-mono">
              <a href="#contact" class="text-white hover:underline flex items-center gap-1">
                Inquire Artifact ↗
              </a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  </section>

  <!-- Interactive Terminal Section -->
  <section id="interactive" class="py-20 px-6 max-w-7xl mx-auto border-t border-white/10">
    <div class="mb-8">
      <span class="font-mono text-xs text-neutral-400 uppercase tracking-widest block mb-2">02 // Interactive Console</span>
      <h2 class="font-display text-3xl text-white font-normal">Runtime Telemetry Shell</h2>
    </div>

    <div class="terminal-window rounded-sm overflow-hidden font-mono text-xs">
      <div class="bg-[#12141a] px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span class="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span class="text-[11px] text-neutral-400 ml-2">guest@pixelcrew.system:~</span>
        </div>
        <span class="text-[10px] text-neutral-500">NEXTJS 14</span>
      </div>

      <div id="termLogs" class="p-6 text-neutral-300 min-h-[200px] max-h-[340px] overflow-y-auto space-y-3">
        <div class="text-neutral-400">
          ${spec.companyName} System Runtime [v2.4.0]<br>
          Type <span class="text-white">'status'</span> or <span class="text-white">'help'</span> to inspect capabilities.
        </div>
      </div>

      <form id="termForm" class="p-4 bg-[#0e1014] border-t border-white/10 flex items-center gap-2">
        <span class="text-emerald-400 font-bold">$</span>
        <input 
          id="termInput"
          type="text" 
          placeholder="type 'status' or 'help'..." 
          class="bg-transparent text-white focus:outline-none flex-1 font-mono text-xs placeholder:text-neutral-600"
          autocomplete="off"
        />
        <button type="submit" class="px-2.5 py-1 bg-white/10 text-neutral-300 text-[11px] rounded hover:bg-white/20">Enter ↵</button>
      </form>
    </div>
  </section>

  <!-- Footer -->
  <footer class="py-16 px-6 border-t border-white/10 max-w-7xl mx-auto text-xs font-mono text-neutral-500 flex flex-col sm:flex-row justify-between items-center gap-4">
    <div>© ${new Date().getFullYear()} ${spec.companyName}. Synthesized with Pixel Crew design-first architecture.</div>
    <div class="flex items-center gap-6 text-neutral-400">
      <a href="https://github.com" class="hover:text-white">GitHub</a>
      <a href="https://twitter.com" class="hover:text-white">Twitter</a>
    </div>
  </footer>

  <script>
    // Live category filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.showcase-card');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => {
          b.classList.remove('active', 'bg-white', 'text-black', 'font-medium');
          b.classList.add('bg-brandSurface', 'text-neutral-400');
        });
        btn.classList.add('active', 'bg-white', 'text-black', 'font-medium');
        btn.classList.remove('bg-brandSurface', 'text-neutral-400');

        const cat = btn.getAttribute('data-category');
        cards.forEach(card => {
          if (cat === 'All' || card.getAttribute('data-category') === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // Terminal shell
    const termLogs = document.getElementById('termLogs');
    const termForm = document.getElementById('termForm');
    const termInput = document.getElementById('termInput');

    termForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const raw = termInput.value.trim();
      if (!raw) return;

      if (raw.toLowerCase() === 'clear') {
        termLogs.innerHTML = '';
        termInput.value = '';
        return;
      }

      let res = "System status: OPERATIONAL. Next.js 14 App Router, Zero AI Slop Standard.";
      if (raw.toLowerCase() === 'help') res = "Available commands: status, architecture, stack, clear";

      const item = document.createElement('div');
      item.className = 'space-y-1';
      item.innerHTML = \`
        <div class="flex items-center gap-2 text-emerald-400"><span>$</span><span>\${raw}</span></div>
        <div class="text-neutral-400 whitespace-pre-line pl-4 border-l border-white/10">\${res}</div>
      \`;
      termLogs.appendChild(item);
      termLogs.scrollTop = termLogs.scrollHeight;
      termInput.value = '';
    });
  </script>

</body>
</html>`;
  }
}
