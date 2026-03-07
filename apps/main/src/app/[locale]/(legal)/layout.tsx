import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LegalSidebar } from '@/components/layout/LegalSidebar';
import { MobileNavRibbon } from '@/components/layout/MobileNavRibbon';
import { CopyMarkdownWrapper } from '@/components/CopyMarkdownWrapper';
import { CyberpunkShell } from '@shimokitan/ui';
import { getDictionary, Locale } from "@shimokitan/utils";

export default async function LegalLayout({ children, params }: { children: React.ReactNode, params: Promise<{ locale: string }> }) {
    const locale = (await params).locale as Locale;
    const dict = getDictionary(locale);
    const l = dict.legal;

    const labels = {
        privacy: l.privacy.title,
        terms: l.terms.title,
        community: l.community.title,
        copyright: l.copyright.title,
        cookies: l.cookies.title,
        affiliate: l.affiliate.title,
        faq: l.faq.title,
        sidebarTitle: l.sidebar_title,
        helpTitle: l.help_title,
        helpText: l.help_text
    };

    const links = [
        { href: `/privacy`, label: labels.privacy },
        { href: `/terms`, label: labels.terms },
        { href: `/community-guidelines`, label: labels.community },
        { href: `/copyright`, label: labels.copyright },
        { href: `/cookies`, label: labels.cookies },
        { href: `/affiliate-disclosure`, label: labels.affiliate },
        { href: `/faq`, label: labels.faq },
    ];

    return (
        <CyberpunkShell>
            <div className="bg-black text-zinc-300 flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200 h-screen overflow-hidden">
                {/* Dynamic Background Mesh */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-900/5 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-900/5 rounded-full blur-[120px]" />
                </div>

                <Navbar />

                <div className="relative z-10 flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto px-6 py-6 lg:py-12 gap-8 lg:gap-24 overflow-hidden">
                    {/* Mobile Ribbon Navigation */}
                    <MobileNavRibbon links={links} />

                    {/* Sticky Sidebar */}
                    <aside className="hidden lg:block sticky top-24 self-start">
                        <LegalSidebar locale={locale} labels={labels} />
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 w-full max-w-3xl overflow-y-auto custom-scroll pr-4">
                        <article className="prose prose-invert prose-zinc max-w-none 
                            prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:italic prose-headings:text-white
                            
                            prose-h1:text-4xl md:prose-h1:text-6xl prose-h1:mb-10 prose-h1:pb-8 prose-h1:border-b prose-h1:border-zinc-800
                            prose-h1:leading-none
                            
                            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-6 prose-h2:text-white font-mono prose-h2:uppercase
                            prose-h2:border-l-4 prose-h2:border-violet-500 prose-h2:pl-6 prose-h2:relative
                            
                            /* Make numbered sections stand out if possible */
                            /* We can't easily target '1.' without JS or content changes, but we can make h2 distinctive */
                            
                            prose-p:text-zinc-400 prose-p:text-lg prose-p:leading-relaxed prose-p:mb-6
                            prose-p:font-light prose-p:tracking-wide
                            
                            prose-strong:text-zinc-100 prose-strong:font-bold
                            
                            prose-a:text-violet-400 prose-a:no-underline hover:prose-a:text-violet-300 transition-colors border-b border-violet-500/30 hover:border-violet-400
                            
                            prose-li:text-zinc-400 prose-li:text-lg prose-li:mb-4
                            prose-ul:list-none prose-ul:pl-0 prose-ul:space-y-4
                            prose-li:before:content-['//'] prose-li:before:text-violet-500 prose-li:before:mr-3 prose-li:before:font-mono prose-li:before:text-sm">
                            <CopyMarkdownWrapper>
                                {children}
                            </CopyMarkdownWrapper>
                        </article>
                    </main>
                </div>

                <Footer />
            </div>
        </CyberpunkShell>
    );
}
