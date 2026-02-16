
import React from 'react';
import { Badge } from '@shimokitan/ui';
import { Icon } from '@iconify/react';
import DeleteButton from './DeleteButton';

export default function AdminTable({
    data,
    columns,
    onDelete,
    editUrl,
    actions = true
}: {
    data: any[],
    columns: { key: string, label: string, render?: (val: any, row: any) => React.ReactNode }[],
    onDelete?: (id: string) => Promise<any>,
    editUrl?: (row: any) => string,
    actions?: boolean
}) {
    if (data.length === 0) {
        return (
            <div className="p-8 border border-dashed border-zinc-800 rounded bg-zinc-950/20 text-center text-zinc-500 font-mono text-xs">
                NO_DATA_FOUND
            </div>
        );
    }

    return (
        <div className="border border-zinc-800 rounded overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-zinc-900/50 text-zinc-400 font-mono text-[10px] uppercase tracking-wider">
                    <tr>
                        {columns.map(col => (
                            <th key={col.key} className="p-3 font-normal">{col.label}</th>
                        ))}
                        {actions && <th className="p-3 text-right">ACTIONS</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 bg-zinc-950/20">
                    {data.map((row, i) => (
                        <tr key={row.id || i} className="hover:bg-zinc-900/40 transition-colors group">
                            {columns.map(col => (
                                <td key={col.key} className="p-3 text-zinc-300">
                                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                                </td>
                            ))}
                            {actions && (
                                <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        {editUrl && (
                                            <a
                                                href={editUrl(row)}
                                                className="p-1.5 border border-zinc-800 bg-black text-zinc-400 hover:text-white hover:border-zinc-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Icon icon="lucide:pencil" width={14} />
                                            </a>
                                        )}
                                        {onDelete && <DeleteButton id={row.id} action={onDelete} />}
                                        <button className="text-zinc-600 hover:text-white transition-colors p-1.5">
                                            <Icon icon="lucide:more-horizontal" width={16} />
                                        </button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
