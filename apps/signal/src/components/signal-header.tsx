import Link from "next/link";
import { Icon } from "@iconify/react";

export function SignalHeader() {
    return (
        <header className="flex w-full items-center justify-between py-6 border-b border-border/40">
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="font-bold text-xl tracking-tighter">shimokitan.</div>
                    <div className="bg-foreground text-background text-xs font-mono font-bold px-1.5 py-0.5 rounded-sm tracking-widest mt-0.5">
                        SIGNAL
                    </div>
                </Link>
            </div>

            <a
                href="https://shimokitan.com"
                className="text-sm font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors group"
            >
                Back to main site
                <Icon icon="lucide:arrow-up-right" className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
            </a>
        </header>
    );
}
