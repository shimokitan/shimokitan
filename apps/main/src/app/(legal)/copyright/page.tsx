export default function CopyrightPage() {
    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter border-b border-zinc-800 pb-4">Copyright & Content Policy</h1>
                <p className="text-[10px] font-mono text-zinc-500 uppercase mt-2">Last Revision: February 16, 2026</p>
            </header>

            <section className="space-y-4">
                <h2 className="text-xl font-bold uppercase tracking-tight">1. Aggregation Model</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    Shimokitan operates as a curated archival index for the Japanese creative ecosystem. Our primary function is the discovery and organization of public media fragments.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold uppercase tracking-tight">2. No-Host Policy</h2>
                <p className="text-sm text-zinc-400 leading-relaxed font-semibold">
                    We do not host restricted audiovisual media assets on our servers without explicit authorization.
                </p>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    All video and audio playback is powered strictly by official third-party embeds (including YouTube, Bilibili, and Niconico). By viewing content on this platform, you are accessing the official streams provided by the original creators, supporting their respective platforms and analytics directly.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold uppercase tracking-tight">3. Platform Terms (YouTube TOS)</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    Usage of this platform acknowledges the Terms of Service of our integrated providers. Content sourced via YouTube API Services adheres to the <a href="https://www.youtube.com/t/terms" className="text-rose-500 underline" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a> and Google Privacy Policy.
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-xl font-bold uppercase tracking-tight">4. Removal Requests</h2>
                <p className="text-sm text-zinc-400 leading-relaxed">
                    We respect the &quot;Right to be Forgotten&quot; and the moral rights of creators. If you are the owner of a work indexed here and wish for it to be removed from our archival stream, please submit a formal request.
                </p>
                <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-sm">
                    <p className="text-xs font-mono uppercase text-zinc-500 mb-2">Registry_Contact</p>
                    <p className="text-sm text-white">
                        Email: <a href="mailto:registry@shimokitan.com" className="hover:text-rose-500 transition-colors">registry@shimokitan.com</a>
                    </p>
                </div>
            </section>

            <section className="space-y-4 border-t border-zinc-900 pt-8">
                <p className="text-[10px] font-mono text-zinc-600 uppercase leading-relaxed">
                    Disclaimer: Shimokitan is an independent archival project. We are not affiliated with, endorsed by, or sponsored by any of the platforms or entities indexed within this database.
                </p>
            </section>
        </div>
    );
}
