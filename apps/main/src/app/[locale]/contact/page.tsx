"use client"

import React, { useState } from 'react';
import { Icon } from '@iconify/react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@shimokitan/ui';

import { toast } from 'sonner';
import { useParams } from 'next/navigation';
import { getDictionary, Locale } from '@shimokitan/utils';

export default function ContactPage({ params, searchParams }: { params: Promise<{ locale: string }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const { locale } = React.use(params) as { locale: Locale };
    const dict = getDictionary(locale);

    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [subject, setSubject] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message'),
            subject: subject || 'General Inquiry',
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || dict.contact.error_toast);
            }

            setSubmitted(true);
            toast.success(dict.contact.success_toast);
        } catch (error) {
            console.error('Submission error:', error);
            toast.error(dict.contact.error_toast);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="flex-1 relative z-10 flex items-center justify-center p-6">
            <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-24 items-start">

                {/* Contact Info */}
                <div className="flex-1 space-y-8 mt-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white mb-4">
                            {dict.contact.title.split(' ')[0]}<br />
                            {dict.contact.title.split(' ')[1]}
                        </h1>
                        <p className="text-zinc-400 text-lg leading-relaxed max-w-md">
                            {dict.contact.description}
                        </p>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="flex-1 w-full relative">
                    <div className="absolute inset-0 bg-violet-500/5 blur-3xl -z-10 rounded-full" />
                    <div className="bg-zinc-950/50 border border-zinc-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl relative overflow-hidden group hover:border-zinc-700/50 transition-colors">
                        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />

                        {submitted ? (
                            <div className="h-96 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 mb-2">
                                    <Icon icon="lucide:check" className="text-emerald-500 w-8 h-8" />
                                </div>
                                <h3 className="text-2xl font-bold text-white">{dict.contact.transmission_sent}</h3>
                                <p className="text-zinc-400 max-w-xs">
                                    {dict.contact.transmission_sent_description}
                                </p>
                                <button
                                    onClick={() => {
                                        setSubmitted(false);
                                        setSubject("");
                                    }}
                                    className="mt-6 text-sm font-mono uppercase tracking-wider text-violet-400 hover:text-white transition-colors"
                                >
                                    {dict.contact.send_another}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div>
                                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-2 block">{dict.contact.identity}</label>
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder={dict.contact.identity_placeholder}
                                        required
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-2 block">{dict.contact.comms_channel}</label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder={dict.contact.comms_channel_placeholder}
                                        required
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-2 block">{dict.contact.encryption_subject}</label>
                                    <Select value={subject} onValueChange={setSubject}>
                                        <SelectTrigger className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 h-auto text-sm text-white focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all">
                                            <SelectValue placeholder={dict.contact.select_topic} />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border border-zinc-700 text-zinc-200">
                                            <SelectItem value="general">{dict.contact.topics.general}</SelectItem>
                                            <SelectItem value="support">{dict.contact.topics.support}</SelectItem>
                                            <SelectItem value="partnership">{dict.contact.topics.partnership}</SelectItem>
                                            <SelectItem value="bug">{dict.contact.topics.bug}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold mb-2 block">{dict.contact.transmission}</label>
                                    <textarea
                                        name="message"
                                        rows={5}
                                        placeholder={dict.contact.transmission_placeholder}
                                        required
                                        className="w-full bg-zinc-900/50 border border-zinc-800 rounded-md px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all resize-none"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-md transition-all flex items-center justify-center gap-2 group/btn"
                                >
                                    {submitting ? (
                                        <>
                                            <Icon icon="lucide:loader-2" className="animate-spin" />
                                            <span>{dict.contact.transmitting}</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>{dict.contact.send_transmission}</span>
                                            <Icon icon="lucide:arrow-right" className="group-hover/btn:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}
