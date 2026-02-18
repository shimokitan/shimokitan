
"use client"

import React from 'react';
import RegistryTable from '../../components/RegistryTable';
import { deleteZine } from '../../actions';

export default function ZineRegistry({ data }: { data: any[] }) {
    return (
        <RegistryTable
            data={data}
            onDelete={deleteZine}
            editUrl={(row) => `/pedalboard/zines/${row.id}`}
            columns={[
                { key: 'author', label: 'Author', render: (val) => <span className="font-bold text-white uppercase tracking-tight">{val}</span> },
                { key: 'artifact', label: 'Artifact', render: (val) => <span className="text-[10px] font-mono text-zinc-500 uppercase">{val?.title || '-'}</span> },
                { key: 'resonance', label: 'Resonance', render: (val) => <span className="text-emerald-500 font-black">{val}</span> }
            ]}
        />
    );
}
