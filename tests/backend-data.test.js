import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { DataModeler } from '../src/backend/data/data-modeler.js';
import { SchemaGenerator } from '../src/backend/data/schema-generator.js';
import { IndexAnalyzer } from '../src/backend/data/index-analyzer.js';
import { QueryAnalyzer } from '../src/backend/data/query-analyzer.js';
import { TransactionAnalyzer } from '../src/backend/data/transaction-analyzer.js';

describe('Universal Data Architecture & Query Engine', () => {
  it('enriches entity models with primary keys, tenant boundaries, and timestamps', () => {
    const rawEntities = [
      {
        name: 'Project',
        fields: [{ name: 'name', type: 'string', required: true }]
      }
    ];

    const arch = { database: { tenantIsolation: true, softDelete: true } };
    const modeled = DataModeler.model(rawEntities, arch);

    assert.equal(modeled.length, 2); // Synthesized Organization + Project
    const proj = modeled.find(e => e.name === 'Project');
    assert.ok(proj);
    const fieldNames = proj.fields.map(f => f.name);
    assert.ok(fieldNames.includes('id'));
    assert.ok(fieldNames.includes('organizationId'));
    assert.ok(fieldNames.includes('createdAt'));
    assert.ok(fieldNames.includes('updatedAt'));
    assert.ok(fieldNames.includes('deletedAt'));
  });

  it('synthesizes query-derived compound and foreign key indexes', () => {
    const entities = [
      {
        name: 'Invoice',
        fields: [
          { name: 'id', type: 'string' },
          { name: 'organizationId', type: 'string' },
          { name: 'customerId', type: 'string' },
          { name: 'status', type: 'string' },
          { name: 'createdAt', type: 'datetime' }
        ]
      }
    ];

    const arch = { database: { tenantIsolation: true } };
    const indexMap = IndexAnalyzer.deriveIndexes(entities, arch);

    const invoiceIndexes = indexMap.Invoice || [];
    assert.ok(invoiceIndexes.some(idx => idx.fields.includes('customerId')));
    assert.ok(invoiceIndexes.some(idx => idx.fields.includes('organizationId') && idx.fields.includes('createdAt')));
  });

  it('generates clean, type-safe Prisma schema with relations and indexes', () => {
    const entities = [
      {
        name: 'Order',
        fields: [
          { name: 'id', type: 'string', isPrimaryKey: true },
          { name: 'customerId', type: 'string', required: true },
          { name: 'totalAmount', type: 'number', required: true },
          { name: 'createdAt', type: 'datetime', required: true, default: 'now()' }
        ],
        relationships: [
          { type: 'belongsTo', targetEntity: 'Customer', foreignKey: 'customerId' }
        ]
      },
      {
        name: 'Customer',
        fields: [
          { name: 'id', type: 'string', isPrimaryKey: true },
          { name: 'email', type: 'string', required: true, unique: true },
          { name: 'name', type: 'string', required: true }
        ],
        relationships: [
          { type: 'hasMany', targetEntity: 'Order' }
        ]
      }
    ];

    const prismaSchema = SchemaGenerator.generatePrismaSchema(entities, { database: { type: 'postgresql' } });
    assert.ok(prismaSchema.includes('model Order {'));
    assert.ok(prismaSchema.includes('model Customer {'));
    assert.ok(prismaSchema.includes('@relation(fields: [customerId], references: [id]'));
    assert.ok(prismaSchema.includes('@@index([customerId])'));
  });

  it('identifies transaction boundaries across mutating workflows', () => {
    const workflows = [
      { id: 'wf-checkout', name: 'Order Checkout & Payment', steps: ['Validate Cart', 'Create Order', 'Charge Payment'] }
    ];

    const boundaries = TransactionAnalyzer.identifyBoundaries(workflows, []);
    assert.equal(boundaries.length, 1);
    assert.equal(boundaries[0].requiresTransaction, true);
    assert.equal(boundaries[0].isolationLevel, 'ReadCommitted');
  });
});
