
"use client"

import React from 'react';
import RegistryTable from '../../components/RegistryTable';
import { deleteTag } from '../../actions';

export default function TagRegistry({ data }: { data: any[] }) {
    return (
        <RegistryTable
            data={data}
            onDelete={deleteTag}
            editUrl={(row) => `/pedalboard/tags/${row.id}`}
            columns={[
                { key: 'name_en', label: 'English', render: (val) => <span className="font-bold text-white">{val}</span> },
                { key: 'name_id', label: 'Indonesian' },
                { key: 'name_jp', label: 'Japanese' },
                { key: 'category', label: 'Category', render: (val) => <span className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-800 rounded uppercase">{val}</span> },
            ]}
        />
    );
}
