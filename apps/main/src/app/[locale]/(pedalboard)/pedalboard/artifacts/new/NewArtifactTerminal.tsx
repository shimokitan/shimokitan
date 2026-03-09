
"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import ArtifactForm from '../ArtifactForm';
import { createIndieVerificationAction } from '../../actions';
import { toast } from 'sonner';

type Protocol = 'archival' | 'resident' | null;

export default function NewArtifactTerminal({ entities, userRole }: { entities: any[], userRole?: string }) {
    const [protocol, setProtocol] = useState<Protocol>(null);
    const [step, setStep] = useState<'selection' | 'proofing' | 'form'>('selection');
    const [verificationId, setVerificationId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    // --- Resident Proofing Flow ---
    const handleProofSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsUploading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const result = await createIndieVerificationAction(formData);

            if (result.verificationId) {
                setVerificationId(result.verificationId);
                toast.success('Permission Proof Uploaded. Registry Unlocked.');
                setStep('form');
            }
        } catch (e) {
            toast.error('Protocol_Error: Verification Refused');
        } finally {
            setIsUploading(false);
        }
    };

    if (step === 'selection') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
                <button
                    onClick={() => { setProtocol('archival'); setStep('form'); }}
                    className="group bg-zinc-950 border border-zinc-900 p-8 text-left hover:border-zinc-500 transition-all"
                >
                    <Icon icon="lucide:library" className="text-zinc-500 mb-4 group-hover:text-zinc-200" width={32} />
                    <h2 className="text-sm font-black text-white uppercase mb-2">Archival_Registry</h2>
                    <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                        GENERAL CULTURAL ENTRIES (ANIME, FILMS, GAMES). INDEXED VIA PUBLIC METADATA.
                        NO RESIDENCY PERMIT REQUIRED.
                    </p>
                </button>

                <button
                    onClick={() => { setProtocol('resident'); setStep('proofing'); }}
                    className="group bg-zinc-950 border border-zinc-900 p-8 text-left hover:border-violet-600 transition-all"
                >
                    <Icon icon="lucide:user-check" className="text-zinc-500 mb-4 group-hover:text-violet-500" width={32} />
                    <h2 className="text-sm font-black text-white uppercase mb-2">Resident_Grant</h2>
                    <p className="text-[10px] text-zinc-500 font-mono leading-relaxed">
                        RECORDING ARTISTS AND CREATORS. REQUIRES MANDATORY ATTACHMENT OF HOSTING PERMIT (PDF/IMAGE).
                        CONSENT-FIRST ARCHIVING PROTOCOL ACTIVE.
                    </p>
                </button>
            </div>
        );
    }

    if (step === 'proofing') {
        return (
            <div className="max-w-xl mx-auto space-y-8 bg-zinc-950 border border-zinc-900 p-12 mt-8">
                <div className="space-y-2">
                    <h2 className="text-sm font-black text-white uppercase tracking-widest">Protocol_01: Resident_Authorization</h2>
                    <p className="text-[9px] text-zinc-500 font-mono uppercase">Upload your hosting permit or rights clearance document before establishing residency.</p>
                </div>

                <form onSubmit={handleProofSubmit} className="space-y-6">
                    <input type="hidden" name="context" value="artifacts" />
                    <div className="space-y-2">
                        <label className="text-[10px] font-mono text-zinc-400 uppercase">Clearance_Document</label>
                        <div className="relative border-2 border-dashed border-zinc-900 p-8 hover:border-violet-900/50 transition-colors flex flex-col items-center justify-center gap-4 bg-black/40">
                            <input
                                type="file"
                                name="file"
                                required
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    if (e.target.files?.[0]) toast.info(`File Selected: ${e.target.files[0].name}`);
                                }}
                            />
                            <Icon icon="lucide:upload-cloud" width={24} className="text-zinc-700" />
                            <span className="text-[10px] font-mono text-zinc-600 uppercase">Drop PDF or Image here</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={() => setStep('selection')}
                            className="bg-zinc-900 text-zinc-400 px-6 py-3 text-[10px] font-black uppercase hover:bg-zinc-800 transition-all"
                        >
                            Abort
                        </button>
                        <button
                            disabled={isUploading}
                            type="submit"
                            className="flex-1 bg-violet-600 text-black py-3 text-[10px] font-black uppercase hover:bg-white transition-all disabled:opacity-50"
                        >
                            {isUploading ? 'VERIFYING_ASSET...' : 'INITIATE_PROTOCOL'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <ArtifactForm
            entities={entities}
            userRole={userRole}
            initialArchival={protocol === 'archival'}
            verificationId={verificationId || undefined}
        />
    );
}
