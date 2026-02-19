
"use client"

import React from 'react';
import RegistryTable from '../../components/RegistryTable';
import { deleteZine, purgeZine, restoreZine } from '../../actions';

export default function ZineRegistry({ data, isTrash = false }: { data: any[], isTrash?: boolean }) {
    return (
        <RegistryTable
            data={data}
            onDelete={isTrash ? purgeZine : deleteZine}
            onRestore={isTrash ? restoreZine : undefined}
            deleteProps={isTrash ? {
                confirmMessage: 'PERMANENT_PURGE_WARNING: THIS_ZINE_DATA_WILL_BE_LOST_FOREVER. CONTINUE?',
                title: 'PURGE_PERMANENTLY'
            } : undefined}
            editUrl={(row) => `/pedalboard/zines/${row.id}`}
            columns={[
                { key: 'author', label: 'Author', render: (val) => <span className="font-bold text-white uppercase tracking-tight">{val}</span> },
                { key: 'artifact', label: 'Artifact', render: (val) => <span className="text-[10px] font-mono text-zinc-500 uppercase">{val?.title || '-'}</span> },
                { key: 'resonance', label: 'Resonance', render: (val) => <span className="text-emerald-500 font-black">{val}</span> }
            ]}
        />
    );
}
