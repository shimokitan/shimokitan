"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { searchWorks } from '../../actions/works';
import { debounce } from 'lodash';

interface Work {
    id: string;
    title: string;
    category: string;
}

interface WorkSearchPickerProps {
    label: string;
    value?: string | null; // workId
    onSelect: (work: Work | null) => void;
    placeholder?: string;
    initialTitle?: string | null;
}

export default function WorkSearchPicker({
    label,
    value,
    onSelect,
    placeholder = "Link to a Work (IP Anchor)...",
    initialTitle
}: WorkSearchPickerProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Work[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState(initialTitle || '');

    useEffect(() => {
        if (initialTitle) setSelectedTitle(initialTitle);
    }, [initialTitle]);

    const fetchWorks = useCallback(
        debounce(async (q: string) => {
            if (!q.trim()) {
                setResults([]);
                return;
            }
            setIsLoading(true);
            try {
                const data = await searchWorks(q);
                setResults(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        if (isOpen) {
            fetchWorks(query);
        }
    }, [query, isOpen, fetchWorks]);

    return (
        <div className="space-y-1 relative">
            <label className="text-[9px] font-mono uppercase text-zinc-600">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    value={isOpen ? query : selectedTitle || ''}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full bg-black border border-zinc-900 p-3 text-xs text-white focus:border-rose-600 outline-none transition-colors rounded-lg"
                    placeholder={selectedTitle || placeholder}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    {isLoading && <Icon icon="lucide:loader-2" className="animate-spin text-zinc-600" width={12} />}
                    <Icon
                        icon={isOpen ? "lucide:chevron-up" : "lucide:chevron-down"}
                        className="text-zinc-600 cursor-pointer"
                        width={14}
                        onClick={() => setIsOpen(!isOpen)}
                    />
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-black border border-zinc-800 shadow-2xl max-h-60 overflow-y-auto rounded-lg">
                    <div className="p-1">
                        <button
                            type="button"
                            onClick={() => {
                                onSelect(null);
                                setSelectedTitle('');
                                setIsOpen(false);
                                setQuery('');
                            }}
                            className="w-full text-left p-2 hover:bg-zinc-900 flex items-center justify-between group border-b border-zinc-900"
                        >
                            <span className="text-[10px] text-zinc-500 uppercase font-black italic">No_Anchor (Detach)</span>
                        </button>
                        {results.length > 0 ? (
                            results.map((work) => (
                                <button
                                    key={work.id}
                                    type="button"
                                    onClick={() => {
                                        onSelect(work);
                                        setSelectedTitle(work.title);
                                        setIsOpen(false);
                                        setQuery('');
                                    }}
                                    className="w-full text-left p-2 hover:bg-zinc-900 flex items-center justify-between group"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-xs text-zinc-300 group-hover:text-white uppercase font-bold italic">{work.title}</span>
                                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter">{work.category} // {work.id}</span>
                                    </div>
                                    <Icon icon="lucide:arrow-right" className="text-zinc-800 group-hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all" width={12} />
                                </button>
                            ))
                        ) : (
                            !isLoading && query.trim() && (
                                <div className="p-4 text-center text-[9px] text-zinc-700 uppercase">
                                    No works found / Create one first
                                </div>
                            )
                        )}
                    </div>
                </div>
            )}

            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
