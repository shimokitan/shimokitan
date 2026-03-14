"use client"

import React from 'react';
import RegistryTable from '@/components/RegistryTable';
import { deleteWork, purgeWork, restoreWork } from '../../actions/works';

export default function WorkRegistry({ data, isTrash = false }: { data: any[], isTrash?: boolean }) {
    return (
        <RegistryTable
            data={data}
            onDelete={isTrash ? purgeWork : deleteWork}
            onRestore={isTrash ? restoreWork : undefined}
            deleteProps={isTrash ? {
                confirmMessage: 'PERMANENT_PURGE_WARNING: THIS_IP_ANCHOR_WILL_BE_ERASED_FROM_ALL_LEDGERS. CONTINUE?',
                title: 'PURGE_PERMANENTLY'
            } : undefined}
            editUrl={(row) => `/works/${row.id}`}
            columns={[
                { key: 'title', label: 'Title', render: (val) => <span className="font-bold text-white uppercase tracking-tight italic">{val}</span> },
                { key: 'category', label: 'Sector', render: (val) => <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-300">{val}</span> },
                { key: 'slug', label: 'Identifier', render: (val) => <span className="text-[10px] font-mono text-zinc-500">{val}</span> },
            ]}
        />
    );
}
