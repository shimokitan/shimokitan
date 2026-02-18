
"use client"

import React from 'react';
import RegistryTable from '../../components/RegistryTable';
import { deleteArtifact } from '../../actions';

export default function ArtifactRegistry({ data }: { data: any[] }) {
    return (
        <RegistryTable
            data={data}
            onDelete={deleteArtifact}
            editUrl={(row) => `/pedalboard/artifacts/${row.id}`}
            columns={[
                { key: 'title', label: 'TITLE_IDENTIFIER', render: (val) => <span className="font-bold text-white uppercase tracking-tight">{val}</span> },
                { key: 'category', label: 'CATEGORY', render: (val) => <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-400">{val}</span> },
                {
                    key: 'status', label: 'STATUS', render: (val) => (
                        <span className={`text-[10px] font-black uppercase ${val === 'back_alley' ? 'text-emerald-500' : val === 'the_pit' ? 'text-amber-500' : 'text-zinc-600'}`}>
                            {val === 'back_alley' ? 'PUBLISHED' : val === 'the_pit' ? 'DRAFT' : val}
                        </span>
                    )
                },
                { key: 'score', label: 'HEAT', render: (val) => <span className="text-zinc-500 font-mono">[{val}]</span> }
            ]}
        />
    );
}
