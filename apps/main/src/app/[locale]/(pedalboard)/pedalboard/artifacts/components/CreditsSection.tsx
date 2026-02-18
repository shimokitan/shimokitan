
"use client"

import React from 'react';
import { Icon } from '@iconify/react';

interface Entity {
    id: string;
    name: string;
    type: string;
}

interface Credit {
    entityId: string;
    role: string;
}

interface CreditsSectionProps {
    entities: Entity[];
    credits: Credit[];
    updateCredit: (idx: number, field: keyof Credit, value: string) => void;
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
                    <div key={i} className="flex gap-2 items-center bg-zinc-900/20 p-2 rounded border border-zinc-900 transition-all hover:border-zinc-800">
                        <select
                            value={credit.entityId}
                            onChange={(e) => updateCredit(i, 'entityId', e.target.value)}
                            className="bg-black border border-zinc-800 p-2 text-[10px] font-mono uppercase text-zinc-400 flex-1 outline-none appearance-none"
                        >
                            <option value="">Select_Entity...</option>
                            {entities.map(e => (
                                <option key={e.id} value={e.id}>{e.name} ({e.type})</option>
                            ))}
                        </select>
                        <input
                            value={credit.role}
                            onChange={(e) => updateCredit(i, 'role', e.target.value)}
                            placeholder="Contribution (e.g. Lead Vocals)"
                            className="bg-black border border-zinc-800 p-2 text-[10px] font-mono text-zinc-300 w-1/2 outline-none focus:border-zinc-700"
                        />
                        <button
                            type="button"
                            onClick={() => removeCredit(i)}
                            className="p-2 text-zinc-700 hover:text-rose-500 transition-colors"
                        >
                            <Icon icon="lucide:x" width={12} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
