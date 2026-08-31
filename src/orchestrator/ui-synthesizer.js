/**
 * PIXEL CREW — Open-World UI Synthesizer
 * 
 * Compiles ViewDefinition + EntityDefinition + DesignSpec into high-fidelity,
 * fully interactive React 18/19 Next.js App Router TSX components.
 * 
 * Works for ANY domain dynamically by composing universal UI primitives
 * (Collection, Table, Form, Timeline, Inspector, Search, Filter).
 */

import { LAYOUT_PRIMITIVES } from './ontology.js';

export class UISynthesizer {
  /**
   * Synthesize a complete TSX component file from a ViewDefinition and its target entities.
   */
  static synthesizeViewComponent(view, entities = [], designSpec = {}) {
    const compName = view.componentName || 'DynamicView';
    const targetEntityName = (view.targetEntities && view.targetEntities[0]) || (entities[0] ? entities[0].name : 'Item');
    const entity = entities.find(e => e.name === targetEntityName) || entities[0] || {
      name: targetEntityName,
      title: targetEntityName,
      fields: [
        { name: 'id', type: 'string', label: 'ID' },
        { name: 'name', type: 'string', label: 'Name' },
        { name: 'status', type: 'string', label: 'Status' }
      ],
      seedData: []
    };

    const fields = entity.fields || [];
    const seedData = entity.seedData || [];
    const layoutType = (view.layout && view.layout.type) || LAYOUT_PRIMITIVES.SPLIT;

    const isSplit = layoutType === LAYOUT_PRIMITIVES.SPLIT || layoutType === LAYOUT_PRIMITIVES.WORKSPACE;

    return `'use client';

import React, { useState } from 'react';
import { Search, Filter, Plus, ArrowUpRight, CheckCircle2, AlertCircle, RefreshCw, Download, Database } from 'lucide-react';

export interface ${entity.name}Record {
${fields.map(f => `  ${f.name}${f.required ? '' : '?'}: ${f.type === 'number' ? 'number' : (f.type === 'boolean' ? 'boolean' : 'string')};`).join('\n')}
}

const INITIAL_RECORDS: ${entity.name}Record[] = ${JSON.stringify(seedData, null, 2)};

export function ${compName}() {
  const [records, setRecords] = useState<${entity.name}Record[]>(INITIAL_RECORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedRecord, setSelectedRecord] = useState<${entity.name}Record | null>(INITIAL_RECORDS[0] || null);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const statuses = ['ALL', ...Array.from(new Set(records.map(r => r.status).filter(Boolean)))];

  const filteredRecords = records.filter(record => {
    const matchesSearch = !searchQuery || 
      (record.name && record.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.id && record.id.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = selectedStatus === 'ALL' || record.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const newEntry: ${entity.name}Record = {
      id: '${entity.name.toLowerCase()}-' + String(records.length + 1).padStart(3, '0'),
      name: newTitle.trim(),
      status: 'Active',
      createdAt: new Date().toISOString()
    };
    setRecords([newEntry, ...records]);
    setSelectedRecord(newEntry);
    setNewTitle('');
    setIsCreating(false);
  };

  return (
    <section id="${view.id || compName.toLowerCase()}" className="py-16 px-6 max-w-7xl mx-auto border-b border-white/10">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="text-xs font-mono text-neutral-400 uppercase tracking-widest mb-2">
            // ${entity.name.toUpperCase()} REGISTRY & WORKSPACE
          </div>
          <h2 className="font-display text-2xl md:text-3xl text-white font-normal">
            ${view.title || `${entity.title || entity.name} Console`}
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl font-light">
            ${view.purpose || `Manage, inspect, and track real-time telemetry across ${entity.plural || entity.name}.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black text-xs font-mono font-medium rounded-sm hover:bg-neutral-200 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New ${entity.name}
          </button>
        </div>
      </div>

      {/* Quick Action Modal / Create Form */}
      {isCreating && (
        <form onSubmit={handleCreate} className="mb-8 p-4 bg-brandSurface border border-brandBorder rounded-sm flex items-center gap-4">
          <input
            type="text"
            placeholder="Enter ${entity.name} identifier or name..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 bg-brandBg border border-brandBorder px-3 py-2 text-sm text-white rounded-sm focus:outline-none focus:border-white/40"
            autoFocus
          />
          <button
            type="submit"
            className="px-4 py-2 bg-emerald-500 text-black text-xs font-mono font-medium rounded-sm hover:bg-emerald-400 transition-colors"
          >
            Commit Entry
          </button>
          <button
            type="button"
            onClick={() => setIsCreating(false)}
            className="px-3 py-2 text-xs font-mono text-neutral-400 hover:text-white"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 p-3 bg-brandSurface/40 border border-brandBorder rounded-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brandBg/80 border border-brandBorder pl-9 pr-3 py-1.5 text-xs text-white rounded-sm focus:outline-none focus:border-white/30"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {statuses.map(st => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={\`px-2.5 py-1 text-xs font-mono rounded-sm transition-colors border \${selectedStatus === st ? 'bg-white text-black border-white font-medium' : 'bg-brandBg text-neutral-400 border-brandBorder hover:text-white'}\`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workspace / View Content */}
      <div className="${isSplit ? 'grid grid-cols-1 lg:grid-cols-12 gap-6' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'}">
        {/* Record List / Table */}
        <div className="${isSplit ? 'lg:col-span-7' : 'col-span-full'} space-y-3">
          {filteredRecords.length === 0 ? (
            <div className="p-8 text-center bg-brandSurface/20 border border-dashed border-brandBorder rounded-sm text-neutral-400 text-xs font-mono">
              No matching ${entity.plural || entity.name} records found.
            </div>
          ) : (
            filteredRecords.map(record => (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className={\`p-4 rounded-sm border transition-all cursor-pointer \${selectedRecord?.id === record.id ? 'bg-brandSurfaceRaised border-white/40 shadow-sm' : 'bg-brandSurface border-brandBorder hover:border-brandBorderHover'}\`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-neutral-500">{record.id}</span>
                    <h3 className="text-sm font-medium text-white">{record.name}</h3>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-sm bg-white/5 border border-white/10 text-neutral-300">
                    {record.status || 'Active'}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-neutral-400 font-mono">
                  ${fields.filter(f => f.name !== 'id' && f.name !== 'name' && f.name !== 'status').slice(0, 3).map(f => `
                  <div>
                    <span className="text-neutral-500 block text-[10px]">${f.label}:</span>
                    <span className="text-neutral-200">{String((record as any)['${f.name}'] || '—')}</span>
                  </div>`).join('\n')}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Inspector Detail Panel (if split layout) */}
        ${isSplit ? `
        <div className="lg:col-span-5 bg-brandSurface border border-brandBorder rounded-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
              <span className="text-xs font-mono text-neutral-400 uppercase tracking-wider">
                Telemetry Inspector
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                Live Data Link
              </span>
            </div>

            {selectedRecord ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-display text-white font-normal">{selectedRecord.name}</h4>
                  <span className="font-mono text-xs text-neutral-500 block mt-0.5">ID: {selectedRecord.id}</span>
                </div>

                <div className="space-y-3 pt-2">
                  ${fields.map(f => `
                  <div className="flex items-center justify-between text-xs py-1.5 border-b border-white/5">
                    <span className="text-neutral-400 font-mono">${f.label}</span>
                    <span className="text-neutral-200 font-medium">{String((selectedRecord as any)['${f.name}'] ?? '—')}</span>
                  </div>`).join('\n')}
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-neutral-500 text-xs font-mono">
                Select a record from the registry to inspect parameters.
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-white/10 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Verified Schema: ${entity.name}</span>
            <span>REST: /api/${entity.name.toLowerCase()}s</span>
          </div>
        </div>
        ` : ''}
      </div>
    </section>
  );
}
`;
  }
}
