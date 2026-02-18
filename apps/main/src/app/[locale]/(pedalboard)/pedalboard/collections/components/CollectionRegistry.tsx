
"use client"

import React from 'react';
import RegistryTable from '../../components/RegistryTable';
import { deleteCollection } from '../../actions';

export default function CollectionRegistry({ data }: { data: any[] }) {
    return (
        <RegistryTable
            data={data}
            onDelete={deleteCollection}
            editUrl={(row) => `/pedalboard/collections/${row.id}`}
            columns={[
                { key: 'title', label: 'Title', render: (val) => <span className="font-bold text-white uppercase tracking-tight">{val}</span> },
                { key: 'coverImage', label: 'Cover', render: (val) => val ? <img src={val} className="w-8 h-8 rounded border border-zinc-800 object-cover" /> : <div className="w-8 h-8 bg-zinc-900 border border-zinc-800 rounded" /> }
            ]}
        />
    );
}
