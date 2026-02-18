
"use client"

import React from 'react';
import RegistryTable from '../../components/RegistryTable';
import { deleteEntity } from '../../actions';

export default function EntityRegistry({ data }: { data: any[] }) {
    return (
        <RegistryTable
            data={data}
            onDelete={deleteEntity}
            editUrl={(row) => `/pedalboard/entities/${row.id}`}
            columns={[
                { key: 'name', label: 'Name', render: (val) => <span className="font-bold text-white uppercase tracking-tight">{val}</span> },
                { key: 'type', label: 'Type', render: (val) => <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded-sm text-zinc-400">{val}</span> },
                { key: 'avatarUrl', label: 'Avatar', render: (val) => val ? <img src={val} className="w-8 h-8 rounded-full border border-zinc-800" /> : <div className="w-8 h-8 bg-zinc-900 rounded-full border border-zinc-800" /> }
            ]}
        />
    );
}
