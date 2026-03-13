
"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { searchArtifacts } from '../../actions/artifacts';
import { toast } from 'sonner';
import { debounce } from 'lodash';

interface Artifact {
    id: string;
    title: string;
    category: string;
}

interface ArtifactSearchPickerProps {
    label: string;
    value?: string | null; // artifactId
    onSelect: (artifact: Artifact | null) => void;
    placeholder?: string;
    initialTitle?: string | null;
}

export default function ArtifactSearchPicker({
    label,
    value,
    onSelect,
    placeholder = "Search for original artifact...",
    initialTitle
}: ArtifactSearchPickerProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Artifact[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState(initialTitle || '');

    useEffect(() => {
        if (initialTitle) setSelectedTitle(initialTitle);
    }, [initialTitle]);

    const fetchArtifacts = useCallback(
        debounce(async (q: string) => {
            if (!q.trim()) {
                setResults([]);
                return;
            }
            setIsLoading(true);
            try {
                const data = await searchArtifacts(q);
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
            fetchArtifacts(query);
        }
    }, [query, isOpen, fetchArtifacts]);

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
                    className="w-full bg-black border border-zinc-800 p-2 text-xs text-white focus:border-violet-600 outline-none transition-colors"
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
                <div className="absolute z-50 w-full mt-1 bg-black border border-zinc-800 shadow-2xl max-h-60 overflow-y-auto">
                    {results.length > 0 ? (
                        <div className="p-1">
                            {results.map((art) => (
                                <button
                                    key={art.id}
                                    type="button"
                                    onClick={() => {
                                        onSelect(art);
                                        setSelectedTitle(art.title);
                                        setIsOpen(false);
                                        setQuery('');
                                    }}
                                    className="w-full text-left p-2 hover:bg-zinc-900 flex items-center justify-between group"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-xs text-zinc-300 group-hover:text-white">{art.title}</span>
                                        <span className="text-[8px] font-mono text-zinc-600 uppercase tracking-tighter">{art.category} // {art.id}</span>
                                    </div>
                                    <Icon icon="lucide:arrow-right" className="text-zinc-800 group-hover:text-violet-500 opacity-0 group-hover:opacity-100 transition-all" width={10} />
                                </button>
                            ))}
                        </div>
                    ) : (
                        !isLoading && query.trim() && (
                            <div className="p-4 text-center text-[9px] text-zinc-700 uppercase">
                                No records found for "{query}"
                            </div>
                        )
                    )}
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
