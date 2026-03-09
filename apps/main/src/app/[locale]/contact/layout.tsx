import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CyberpunkShell } from '@shimokitan/ui';

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return (
        <CyberpunkShell>
            <div className="h-screen w-full bg-black text-zinc-300 flex flex-col font-sans selection:bg-violet-500/30 selection:text-violet-200 overflow-hidden">
                {/* Dynamic Background Mesh */}
                <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-900/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[20%] left-[-10%] w-[30%] h-[30%] bg-blue-900/10 rounded-full blur-[100px]" />
                </div>

                <Navbar />

                <main className="flex-1 min-h-0 overflow-y-auto custom-scroll">
                    {children}
                    <Footer />
                </main>
            </div>
        </CyberpunkShell>
    );
}
