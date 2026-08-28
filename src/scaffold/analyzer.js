import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Deep static codebase analyzer that detects frameworks, database/ORMs,
 * architectures, languages, and directory layouts to tailor agent skills and permissions.
 */
export async function analyzeCodebase(targetDir = process.cwd()) {
  const profile = {
    projectName: path.basename(targetDir),
    languages: [],
    frameworks: [],
    backend: [],
    database: [],
    testing: [],
    auth: [],
    styling: [],
    packageManager: 'npm',
    directories: [],
    files: [],
    recommendedSkills: [],
    agentSpecializations: {}
  };

  // Helper to safely check if file or dir exists
  const exists = async (relPath) => {
    try {
      await fs.access(path.join(targetDir, relPath));
      return true;
    } catch {
      return false;
    }
  };

  // Helper to read and parse JSON
  const readJson = async (relPath) => {
    try {
      const data = await fs.readFile(path.join(targetDir, relPath), 'utf-8');
      return JSON.parse(data);
    } catch {
      return null;
    }
  };

  // Helper to read file text
  const readText = async (relPath) => {
    try {
      return await fs.readFile(path.join(targetDir, relPath), 'utf-8');
    } catch {
      return null;
    }
  };

  // 1. Scan Top-Level Directories
  try {
    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        profile.directories.push(entry.name);
      } else if (entry.isFile()) {
        profile.files.push(entry.name);
      }
    }
  } catch {
    // ignore
  }

  // 2. Node.js & JavaScript/TypeScript Ecosystem Detection
  const dirName = path.basename(targetDir);
  const GENERIC_NAMES = new Set([
    'next_temp', 'next-temp', 'nextjs-temp', 'my-app', 'next-app', 'react-app',
    'app', 'template', 'starter', 'boilerplate', 'untitled', 'temp', 'tmp', 'project',
    'create-next-app', 'vite-project', 'frontend', 'backend', 'demo', 'sample'
  ]);

  const pkg = await readJson('package.json');
  if (pkg && pkg.name && !GENERIC_NAMES.has(pkg.name.toLowerCase())) {
    profile.projectName = pkg.name;
  } else {
    profile.projectName = dirName;
  }

  if (pkg) {
    const allDeps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {})
    };

    // Languages
    if (allDeps.typescript || await exists('tsconfig.json')) {
      profile.languages.push('TypeScript');
    }
    profile.languages.push('JavaScript');

    // Frontend Frameworks
    if (allDeps.next) {
      const isAppRouter = (await exists('app')) || (await exists('src/app'));
      profile.frameworks.push(`Next.js (${isAppRouter ? 'App Router' : 'Pages Router'})`);
      profile.recommendedSkills.push('nextjs');
    }
    if (allDeps.react) {
      profile.frameworks.push('React');
      profile.recommendedSkills.push('react');
    }
    if (allDeps.vue) {
      profile.frameworks.push('Vue');
      profile.recommendedSkills.push('vue');
    }
    if (allDeps.svelte) {
      profile.frameworks.push('Svelte');
      profile.recommendedSkills.push('svelte');
    }
    if (allDeps.astro) {
      profile.frameworks.push('Astro');
      profile.recommendedSkills.push('astro');
    }

    // Styling
    if (allDeps.tailwindcss || await exists('tailwind.config.js') || await exists('tailwind.config.ts')) {
      profile.styling.push('TailwindCSS');
      profile.recommendedSkills.push('tailwind');
    }

    // Backend
    if (allDeps.express) {
      profile.backend.push('Express.js');
      profile.recommendedSkills.push('express');
      profile.recommendedSkills.push('api-architecture');
    }
    if (allDeps['@nestjs/core']) {
      profile.backend.push('NestJS');
      profile.recommendedSkills.push('nestjs');
    }
    if (allDeps.fastify) {
      profile.backend.push('Fastify');
      profile.recommendedSkills.push('fastify');
    }
    if (allDeps.hono) {
      profile.backend.push('Hono');
    }
    if (allDeps['@trpc/server']) {
      profile.backend.push('tRPC');
      profile.recommendedSkills.push('trpc');
    }
    if (allDeps.graphql) {
      profile.backend.push('GraphQL');
      profile.recommendedSkills.push('graphql');
    }

    // Database & ORMs
    if (allDeps['@prisma/client'] || await exists('prisma/schema.prisma')) {
      profile.database.push('Prisma ORM');
      profile.recommendedSkills.push('prisma');
      profile.recommendedSkills.push('query-optimization');

      // Check DB provider in prisma schema
      const schemaText = await readText('prisma/schema.prisma');
      if (schemaText) {
        if (schemaText.includes('provider = "postgresql"') || schemaText.includes('provider = "postgres"')) {
          profile.database.push('PostgreSQL');
          profile.recommendedSkills.push('postgresql');
        } else if (schemaText.includes('provider = "mysql"')) {
          profile.database.push('MySQL');
          profile.recommendedSkills.push('mysql');
        } else if (schemaText.includes('provider = "sqlite"')) {
          profile.database.push('SQLite');
          profile.recommendedSkills.push('sqlite');
        } else if (schemaText.includes('provider = "mongodb"')) {
          profile.database.push('MongoDB');
          profile.recommendedSkills.push('mongodb');
        }
      }
    }

    if (allDeps['drizzle-orm'] || await exists('drizzle.config.ts') || await exists('drizzle.config.js')) {
      profile.database.push('Drizzle ORM');
      profile.recommendedSkills.push('drizzle');
    }
    if (allDeps.typeorm) {
      profile.database.push('TypeORM');
      profile.recommendedSkills.push('typeorm');
    }
    if (allDeps.mongoose) {
      profile.database.push('Mongoose (MongoDB)');
      profile.recommendedSkills.push('mongodb');
    }
    if (allDeps.pg) {
      if (!profile.database.includes('PostgreSQL')) profile.database.push('PostgreSQL');
      profile.recommendedSkills.push('postgresql');
    }
    if (allDeps.redis || allDeps.ioredis || allDeps['@upstash/redis']) {
      profile.database.push('Redis');
      profile.recommendedSkills.push('redis-caching');
    }

    // Testing
    if (allDeps.vitest) {
      profile.testing.push('Vitest');
      profile.recommendedSkills.push('vitest');
    }
    if (allDeps.jest) {
      profile.testing.push('Jest');
      profile.recommendedSkills.push('jest');
    }
    if (allDeps['@playwright/test']) {
      profile.testing.push('Playwright');
      profile.recommendedSkills.push('playwright-e2e');
    }
    if (allDeps.cypress) {
      profile.testing.push('Cypress');
      profile.recommendedSkills.push('cypress-e2e');
    }

    // Auth
    if (allDeps['next-auth'] || allDeps['@auth/core']) {
      profile.auth.push('NextAuth / Auth.js');
      profile.recommendedSkills.push('auth-security');
    }
    if (allDeps['@clerk/nextjs'] || allDeps['@clerk/clerk-react']) {
      profile.auth.push('Clerk Auth');
    }
    if (allDeps['@supabase/supabase-js'] || allDeps['@supabase/ssr']) {
      profile.auth.push('Supabase Auth & DB');
      profile.recommendedSkills.push('supabase');
    }
  }

  // 3. Python Ecosystem Detection
  if (await exists('requirements.txt') || await exists('pyproject.toml') || await exists('Pipfile')) {
    profile.languages.push('Python');
    const reqText = (await readText('requirements.txt')) || (await readText('pyproject.toml')) || '';
    if (reqText.includes('django')) {
      profile.backend.push('Django');
      profile.recommendedSkills.push('django');
    }
    if (reqText.includes('fastapi')) {
      profile.backend.push('FastAPI');
      profile.recommendedSkills.push('fastapi');
      profile.recommendedSkills.push('api-architecture');
    }
    if (reqText.includes('sqlalchemy')) {
      profile.database.push('SQLAlchemy');
      profile.recommendedSkills.push('sqlalchemy');
    }
    if (reqText.includes('pytest')) {
      profile.testing.push('Pytest');
      profile.recommendedSkills.push('pytest');
    }
  }

  // 4. Go Ecosystem Detection
  if (await exists('go.mod')) {
    profile.languages.push('Go');
    const goMod = await readText('go.mod');
    if (goMod && goMod.includes('gin-gonic/gin')) profile.backend.push('Gin');
    if (goMod && goMod.includes('gorm.io/gorm')) profile.database.push('GORM');
    profile.recommendedSkills.push('go-architecture');
  }

  // 5. Rust Ecosystem Detection
  if (await exists('Cargo.toml')) {
    profile.languages.push('Rust');
    profile.recommendedSkills.push('rust-architecture');
  }

  // Fallbacks if empty
  if (profile.languages.length === 0) profile.languages.push('JavaScript');
  if (profile.frameworks.length === 0) profile.frameworks.push('Standard Web / DOM');
  if (profile.backend.length === 0) profile.backend.push('Node.js API');
  if (profile.database.length === 0) profile.database.push('SQL / Relational DB');
  if (profile.testing.length === 0) profile.testing.push('Unit & E2E Testing');

  // Always include core skills
  profile.recommendedSkills.push('codebase-intelligence', 'security-audit', 'performance-profiling', 'testing');
  profile.recommendedSkills = [...new Set(profile.recommendedSkills)];

  return profile;
}

/**
 * Generates tailored agent configurations and skills mapped to the analyzed codebase
 */
export function buildAdaptedConfig(profile, options = {}) {
  const isTypeScript = profile.languages.includes('TypeScript');
  const hasPrisma = profile.database.includes('Prisma ORM');
  const hasNext = profile.frameworks.some(f => f.includes('Next.js'));

  // Detect directories present in project for permissions
  const srcPrefix = profile.directories.includes('src') ? 'src/' : '';

  return {
    version: "0.1.0",
    project: profile.projectName,
    codebaseProfile: {
      languages: profile.languages,
      frameworks: profile.frameworks,
      backend: profile.backend,
      database: profile.database,
      testing: profile.testing,
      auth: profile.auth,
      styling: profile.styling
    },
    orchestrator: {
      enabled: true,
      maxConcurrentAgents: 4,
      autoDecompose: true,
      logEvents: true
    },
    agents: {
      frontend: {
        name: "Frontend Agent",
        role: `${profile.frameworks[0] || 'UI/UX'} & Component Engineering`,
        sprite: "frontend",
        color: "#00f0ff",
        enabled: true,
        maxTasks: 2,
        skills: profile.recommendedSkills.filter(s => ['react', 'nextjs', 'vue', 'svelte', 'astro', 'tailwind', 'ui-optimization'].includes(s)),
        permissions: {
          read: [`${srcPrefix}components/**`, `${srcPrefix}pages/**`, `${srcPrefix}app/**`, `${srcPrefix}styles/**`, "public/**"],
          write: [`${srcPrefix}components/**`, `${srcPrefix}pages/**`, `${srcPrefix}app/**`, `${srcPrefix}styles/**`]
        }
      },
      backend: {
        name: "Backend Agent",
        role: `${profile.backend[0] || 'API'} Architecture & Business Logic`,
        sprite: "backend",
        color: "#ff007f",
        enabled: true,
        maxTasks: 2,
        skills: profile.recommendedSkills.filter(s => ['api-architecture', 'node', 'express', 'nestjs', 'fastify', 'trpc', 'graphql', 'fastapi', 'django', 'go-architecture', 'auth-security'].includes(s)),
        permissions: {
          read: [`${srcPrefix}api/**`, `${srcPrefix}server/**`, `${srcPrefix}routes/**`, `${srcPrefix}controllers/**`, `${srcPrefix}lib/**`],
          write: [`${srcPrefix}api/**`, `${srcPrefix}server/**`, `${srcPrefix}routes/**`, `${srcPrefix}controllers/**`]
        }
      },
      database: {
        name: "Database Agent",
        role: `${profile.database[0] || 'Database'} & Data Modeling Architect`,
        sprite: "database",
        color: "#ffd700",
        enabled: true,
        maxTasks: 1,
        skills: profile.recommendedSkills.filter(s => ['postgresql', 'prisma', 'drizzle', 'typeorm', 'mongodb', 'mysql', 'sqlite', 'query-optimization', 'indexing', 'redis-caching'].includes(s)),
        permissions: {
          read: ["prisma/**", "db/**", "migrations/**", "models/**", "drizzle/**"],
          write: ["prisma/**", "db/**", "migrations/**", "drizzle/**"]
        }
      },
      security: {
        name: "Security Agent",
        role: "OWASP & Vulnerability Hardening",
        sprite: "security",
        color: "#ff3344",
        enabled: true,
        maxTasks: 1,
        skills: ["security-audit", "codebase-intelligence", "auth-security"],
        permissions: {
          read: ["**/*"],
          write: ["security/**", ".env.example"]
        }
      },
      performance: {
        name: "Performance Agent",
        role: "Core Web Vitals & Runtime Profiling",
        sprite: "performance",
        color: "#39ff14",
        enabled: true,
        maxTasks: 1,
        skills: ["performance-profiling", "lcp-optimization", "memory-profiling"],
        permissions: {
          read: ["**/*"],
          write: [`${srcPrefix}**/*`]
        }
      },
      qa: {
        name: "QA Agent",
        role: `${profile.testing[0] || 'Testing'} Automation Lead`,
        sprite: "qa",
        color: "#b026ff",
        enabled: true,
        maxTasks: 1,
        dependsOn: ["frontend", "backend", "database"],
        skills: profile.recommendedSkills.filter(s => ['testing', 'vitest', 'jest', 'playwright-e2e', 'cypress-e2e', 'pytest'].includes(s)),
        permissions: {
          read: ["**/*"],
          write: ["tests/**", "__tests__/**", "cypress/**", "playwright/**", "e2e/**"]
        }
      }
    },
    dashboard: {
      enabled: true,
      port: 4747,
      theme: "pixel",
      crtEffect: true,
      soundEffects: true
    }
  };
}
