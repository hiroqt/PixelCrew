/**
 * PIXEL CREW — Infrastructure Synthesizer
 * 
 * Synthesizes database client singletons, Dockerfile, docker-compose.yml,
 * and environment configuration templates.
 */

export class InfrastructureSynthesizer {
  /**
   * Synthesize infrastructure files
   * @param {object} architecture 
   * @returns {object} Map of filename -> content
   */
  static synthesize(architecture = {}) {
    const files = {};
    const dbType = architecture.database?.type || 'postgresql';
    const isPostgres = dbType === 'postgresql';

    // 1. Prisma Client Singleton
    files['src/infrastructure/database.ts'] = `import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
`;

    // 2. Dockerfile
    files['Dockerfile'] = `FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

FROM base AS runner
ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
`;

    // 3. Docker Compose (only if Postgres / Redis required)
    if (isPostgres) {
      files['docker-compose.yml'] = `version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/app_db?schema=public
      - NODE_ENV=production
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_db
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
`;
    }

    // 4. Environment Variables Template
    files['.env.example'] = `# Database Connection
DATABASE_URL="${isPostgres ? 'postgresql://postgres:postgres@localhost:5432/app_db?schema=public' : 'file:./dev.db'}"

# Application Security
SESSION_SECRET="change-this-to-a-secure-random-32-character-secret"
NODE_ENV="development"
PORT=3000
`;

    return files;
  }
}
