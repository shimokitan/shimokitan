
"use client"

import React from 'react';
import { Icon } from '@iconify/react';
import EntitySearchPicker from './EntitySearchPicker';

interface Entity {
    id: string;
    name: string;
    type: string;
}

interface Credit {
    entityId: string;
    role: string;
    displayRole?: string;
    contributorClass: 'author' | 'collaborator' | 'staff';
    isPrimary: boolean;
    position: number;
}

interface CreditsSectionProps {
    entities: Entity[];
    credits: Credit[];
    updateCredit: (idx: number, field: keyof Credit, value: any) => void;
    addCredit: () => void;
    removeCredit: (idx: number) => void;
}

export default function CreditsSection({
    entities,
    credits,
    updateCredit,
    addCredit,
    removeCredit
}: CreditsSectionProps) {
    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-900 pb-2 mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">04 // Contribution_Ledger</span>
                <button
                    type="button"
                    onClick={addCredit}
                    className="text-[10px] uppercase font-bold text-zinc-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                    <Icon icon="lucide:plus" width={12} /> Add_Contributor
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {credits.map((credit, i) => (
                    <div key={i} className="flex flex-col gap-2 bg-zinc-950 p-4 border border-zinc-900 rounded-sm">
                        <div className="flex gap-2 items-center">
                            <EntitySearchPicker
                                label=""
                                type="individual"
                                value={credit.entityId}
                                onSelect={(entity) => updateCredit(i, 'entityId', entity?.id || '')}
                                placeholder="Search residency..."
                                entities={entities}
                            />
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => updateCredit(i, 'isPrimary', !credit.isPrimary)}
                                    className={`p-2 border transition-all ${credit.isPrimary ? 'bg-amber-600/20 border-amber-600 text-amber-500' : 'bg-black border-zinc-800 text-zinc-700'}`}
                                    title="Set as Primary"
                                >
                                    <Icon icon={credit.isPrimary ? "lucide:star" : "lucide:star-off"} width={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeCredit(i)}
                                    className="p-2 bg-black border border-zinc-800 text-zinc-700 hover:text-rose-500 hover:border-rose-900 transition-all"
                                >
                                    <Icon icon="lucide:trash-2" width={14} />
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <input
                                value={credit.role}
                                onChange={(e) => updateCredit(i, 'role', e.target.value)}
                                placeholder="Functional Role (e.g. Lead Vocals)"
                                className="bg-black border border-zinc-900 p-2 text-[10px] font-mono text-zinc-400 outline-none focus:border-violet-500/50"
                            />
                            <input
                                value={credit.displayRole || ''}
                                onChange={(e) => updateCredit(i, 'displayRole', e.target.value)}
                                placeholder="Display Role (e.g. Center)"
                                className="bg-black border border-zinc-900 p-2 text-[10px] font-mono text-zinc-400 outline-none focus:border-violet-500/50"
                            />
                        </div>

                        <div className="flex gap-2">
                            <select
                                value={credit.contributorClass}
                                onChange={(e) => updateCredit(i, 'contributorClass', e.target.value)}
                                className="bg-zinc-900 border border-zinc-800 p-2 text-[10px] font-mono text-zinc-500 outline-none flex-1"
                            >
                                <option value="author">Class: Author</option>
                                <option value="collaborator">Class: Collaborator</option>
                                <option value="staff">Class: Staff</option>
                            </select>
                            <input
                                type="number"
                                value={credit.position}
                                onChange={(e) => updateCredit(i, 'position', parseInt(e.target.value) || 0)}
                                placeholder="Pos"
                                className="bg-zinc-900 border border-zinc-800 p-2 text-[10px] font-mono text-zinc-500 w-16 outline-none"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
