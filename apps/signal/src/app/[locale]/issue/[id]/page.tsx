import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@iconify/react";
import { signalIssues } from "@/lib/data";
import { StatusBadge } from "@/components/status-badge";

export default async function IssuePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const issue = signalIssues.find((i) => i.id === id);

    if (!issue) {
        notFound();
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col gap-8 max-w-3xl mx-auto w-full">

            {/* Back navigation */}
            <div>
                <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
                >
                    <Icon icon="lucide:arrow-left" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Feed
                </Link>
            </div>

            {/* Header */}
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-muted-foreground text-sm font-mono">{issue.id}</span>
                        <StatusBadge severity={issue.severity} />
                    </div>
                    <time className="text-muted-foreground text-sm">{issue.date}</time>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                    {issue.title}
                </h1>

                <div className="flex items-center gap-6 mt-2 border-b border-border/40 pb-6">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                        <Icon icon="lucide:users" className="w-4 h-4" />
                        <span>{issue.affectedUsers.toLocaleString()} affected users</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                        <Icon icon="lucide:message-square" className="w-4 h-4" />
                        <span>{issue.feedbackSummary.length} reports</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-10">

                {/* Description */}
                <section className="flex flex-col gap-3">
                    <h2 className="text-lg font-bold tracking-tight">Issue Description</h2>
                    <p className="text-foreground/80 leading-relaxed">
                        {issue.description}
                    </p>
                </section>

                {/* Feedback Summary */}
                <section className="flex flex-col gap-4">
                    <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                        <Icon icon="lucide:list-tree" className="w-5 h-5 text-muted-foreground" />
                        Collective Feedback
                    </h2>
                    <ul className="flex flex-col gap-3">
                        {issue.feedbackSummary.map((feedback, idx) => (
                            <li
                                key={idx}
                                className="bg-muted/50 border border-border/50 rounded-lg p-3 sm:p-4 text-sm text-foreground/90 flex gap-3"
                            >
                                <Icon icon="lucide:quote" className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                                {feedback}
                            </li>
                        ))}
                    </ul>
                </section>

                {/* Timeline */}
                <section className="flex flex-col gap-4 pt-4">
                    <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                        <Icon icon="lucide:clock" className="w-5 h-5 text-muted-foreground" />
                        Status Timeline
                    </h2>

                    <div className="flex flex-col relative pl-4 sm:pl-0">
                        {/* Timeline Line for desktop */}
                        <div className="hidden sm:block absolute left-[120px] top-3 bottom-5 w-px bg-border/60" />
                        {/* Timeline Line for mobile */}
                        <div className="sm:hidden absolute left-0 top-3 bottom-5 w-px bg-border/60" />

                        {issue.statusTimeline.map((tl, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-6 relative py-4 sm:py-3">

                                {/* Mobile dot */}
                                <div className="sm:hidden absolute -left-[4.5px] top-[22px] w-2.5 h-2.5 rounded-full bg-border ring-4 ring-background" />

                                <time className="sm:w-[120px] shrink-0 text-xs sm:text-sm font-medium text-muted-foreground sm:text-right sm:pt-0.5">
                                    {tl.timestamp}
                                </time>

                                {/* Desktop dot */}
                                <div className="hidden sm:block absolute left-[120px] -translate-x-[4px] top-[18px] w-2.5 h-2.5 rounded-full bg-border ring-4 ring-background" />

                                <div className="bg-card border border-border rounded-lg px-4 py-2 text-sm font-medium shadow-sm w-full sm:w-auto">
                                    {tl.state}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
