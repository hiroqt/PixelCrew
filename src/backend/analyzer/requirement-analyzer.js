/**
 * PIXEL CREW — System Requirement Analyzer
 * 
 * Analyzes natural language intent and project AST to extract a structured,
 * machine-verifiable SystemRequirementsModel without domain hardcoding.
 */

export class RequirementAnalyzer {
  /**
   * Extract comprehensive backend requirements from prompt & AST
   * @param {string} prompt 
   * @param {object} ast 
   * @returns {object} SystemRequirementsModel
   */
  static analyze(prompt = '', ast = {}) {
    const rawPrompt = String(prompt).toLowerCase();
    const domain = (ast.domain || '').toLowerCase();
    const entities = ast.entities || [];
    const workflows = ast.workflows || [];
    const operations = ast.operations || [];

    // 1. Application Scale & Multi-tenancy Inferences
    const isMultiTenant = Boolean(
      rawPrompt.includes('tenant') ||
      rawPrompt.includes('organization') ||
      rawPrompt.includes('workspace') ||
      rawPrompt.includes('b2b') ||
      rawPrompt.includes('team') ||
      entities.some(e => ['Organization', 'Workspace', 'Tenant', 'Team', 'Account'].includes(e.name))
    );

    const isHighScale = Boolean(
      rawPrompt.includes('high throughput') ||
      rawPrompt.includes('streaming') ||
      rawPrompt.includes('million') ||
      rawPrompt.includes('distributed') ||
      rawPrompt.includes('large scale') ||
      rawPrompt.includes('real-time analytics')
    );

    const scale = isHighScale ? 'high' : (isMultiTenant ? 'medium' : 'low');

    // 2. User & Authentication Inferences
    const hasAuth = Boolean(
      rawPrompt.includes('login') ||
      rawPrompt.includes('auth') ||
      rawPrompt.includes('user') ||
      rawPrompt.includes('account') ||
      rawPrompt.includes('sign in') ||
      rawPrompt.includes('permission') ||
      rawPrompt.includes('role') ||
      isMultiTenant ||
      (ast.actors && ast.actors.length > 1)
    );

    const hasRoles = Boolean(
      rawPrompt.includes('role') ||
      rawPrompt.includes('admin') ||
      rawPrompt.includes('rbac') ||
      rawPrompt.includes('permission') ||
      (ast.actors && ast.actors.length > 1)
    );

    // 3. Data Inferences
    const hasTransactions = Boolean(
      rawPrompt.includes('payment') ||
      rawPrompt.includes('checkout') ||
      rawPrompt.includes('transfer') ||
      rawPrompt.includes('order') ||
      rawPrompt.includes('booking') ||
      rawPrompt.includes('reservation') ||
      rawPrompt.includes('inventory') ||
      rawPrompt.includes('financial') ||
      rawPrompt.includes('ledger') ||
      rawPrompt.includes('atomic') ||
      workflows.some(w => /pay|order|book|reserve|transfer|transact/i.test(w.name || ''))
    );

    const hasSearch = Boolean(
      rawPrompt.includes('search') ||
      rawPrompt.includes('filter') ||
      rawPrompt.includes('catalog') ||
      rawPrompt.includes('browse') ||
      operations.some(op => (op.path || '').includes('search'))
    );

    // 4. API Inferences
    const isPublicAPI = Boolean(
      rawPrompt.includes('public api') ||
      rawPrompt.includes('webhook') ||
      rawPrompt.includes('developer platform') ||
      rawPrompt.includes('sdk')
    );

    const rateLimiting = Boolean(
      hasAuth ||
      isPublicAPI ||
      rawPrompt.includes('rate limit') ||
      isMultiTenant
    );

    // 5. Security Inferences
    const hasSensitiveData = Boolean(
      rawPrompt.includes('health') ||
      rawPrompt.includes('patient') ||
      rawPrompt.includes('emr') ||
      rawPrompt.includes('payment') ||
      rawPrompt.includes('credit card') ||
      rawPrompt.includes('pii') ||
      rawPrompt.includes('contract') ||
      rawPrompt.includes('legal') ||
      rawPrompt.includes('secret') ||
      rawPrompt.includes('password')
    );

    const auditLogging = Boolean(
      isMultiTenant ||
      hasSensitiveData ||
      hasTransactions ||
      rawPrompt.includes('audit') ||
      rawPrompt.includes('compliance')
    );

    // 6. Performance & Asynchronous Jobs Inferences
    const isReadHeavy = !rawPrompt.includes('write intensive') && !rawPrompt.includes('ingest');
    const isRealTime = Boolean(
      rawPrompt.includes('realtime') ||
      rawPrompt.includes('real-time') ||
      rawPrompt.includes('websocket') ||
      rawPrompt.includes('live') ||
      rawPrompt.includes('chat') ||
      rawPrompt.includes('collaboration')
    );

    const backgroundJobs = Boolean(
      rawPrompt.includes('job') ||
      rawPrompt.includes('queue') ||
      rawPrompt.includes('worker') ||
      rawPrompt.includes('email') ||
      rawPrompt.includes('export') ||
      rawPrompt.includes('import') ||
      rawPrompt.includes('report') ||
      rawPrompt.includes('video') ||
      rawPrompt.includes('transcription') ||
      rawPrompt.includes('render') ||
      rawPrompt.includes('batch') ||
      rawPrompt.includes('notification')
    );

    return {
      application: {
        name: ast.appName || 'Application',
        domain: domain || 'general',
        type: isMultiTenant ? 'multi-tenant SaaS' : (isHighScale ? 'high-throughput system' : 'modular application'),
        expectedScale: scale,
        availability: isHighScale ? '99.99%' : (isMultiTenant ? '99.9%' : '99.5%')
      },
      users: {
        authentication: hasAuth,
        strategy: hasAuth ? (isMultiTenant ? 'session' : 'session') : 'none',
        roles: hasRoles,
        organizations: isMultiTenant
      },
      data: {
        relational: true,
        transactions: hasTransactions,
        search: hasSearch,
        softDelete: isMultiTenant || hasSensitiveData,
        auditLog: auditLogging
      },
      api: {
        style: 'REST',
        versioning: true,
        public: isPublicAPI,
        rateLimiting,
        errorFormat: 'RFC-7807'
      },
      security: {
        sensitiveData: hasSensitiveData,
        tenantIsolation: isMultiTenant,
        auditLogging,
        strictValidation: true,
        denyByDefault: true
      },
      performance: {
        readHeavy: isReadHeavy,
        realTime: isRealTime,
        caching: hasSearch || isReadHeavy || isMultiTenant,
        paginationStrategy: (isHighScale || hasSearch) ? 'cursor' : 'offset'
      },
      backgroundJobs: {
        required: backgroundJobs,
        tasks: this.extractJobTasks(rawPrompt)
      }
    };
  }

  /**
   * Helper: Extracts discrete background job types
   */
  static extractJobTasks(prompt) {
    const tasks = [];
    if (prompt.includes('email') || prompt.includes('notification')) tasks.push('send-notifications');
    if (prompt.includes('export') || prompt.includes('report')) tasks.push('generate-reports');
    if (prompt.includes('import') || prompt.includes('csv')) tasks.push('batch-import');
    if (prompt.includes('video') || prompt.includes('image') || prompt.includes('transcription')) tasks.push('media-processing');
    if (prompt.includes('webhook')) tasks.push('webhook-dispatch');
    if (tasks.length === 0 && (prompt.includes('worker') || prompt.includes('queue'))) {
      tasks.push('async-task-worker');
    }
    return tasks;
  }
}
