import Link from "next/link";
import { Icon } from "@iconify/react";
import { signalIssues } from "@/lib/data";
import { StatusBadge } from "@/components/status-badge";

export default function Page() {
  const featuredIssue = signalIssues[0];
  const remainingIssues = signalIssues.slice(1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">

      <div className="mb-8 border-b border-border pb-6 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">signal.</h1>
          <p className="text-muted-foreground text-sm max-w-lg">
            High-contrast anomaly hub for the Shimokitan district. Same DNA, different mode.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-monitoring opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-status-monitoring"></span>
          </span>
          System Degraded
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">

        {/* System Status Bento Box */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 rounded-xl border border-border bg-card p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Active Load</span>
            <Icon icon="lucide:activity" className="text-muted-foreground w-4 h-4" />
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tighter">94%</div>
            <p className="text-xs text-muted-foreground mt-1 text-balance">Traffic routing through secondary nodes</p>
          </div>
        </div>

        {/* Featured Issue Bento Box */}
        {featuredIssue && (
          <Link
            href={`/issue/${featuredIssue.id}`}
            className="group block col-span-1 md:col-span-2 lg:col-span-2 row-span-2 rounded-xl border border-border bg-card hover:border-foreground/30 hover:shadow-md transition-all p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-foreground text-sm font-mono bg-muted px-2 py-0.5 rounded-md">{featuredIssue.id}</span>
                  <StatusBadge severity={featuredIssue.severity} />
                </div>
                <time className="text-muted-foreground text-sm whitespace-nowrap hidden sm:block">{featuredIssue.date}</time>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 group-hover:text-primary transition-colors text-balance">
                {featuredIssue.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base max-w-2xl">
                {featuredIssue.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 mt-8 pt-6 border-t border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <Icon icon="lucide:users" className="w-4 h-4" />
                <span><strong className="text-foreground">{featuredIssue.affectedUsers.toLocaleString()}</strong> affected</span>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                <Icon icon="lucide:message-square" className="w-4 h-4" />
                <span><strong className="text-foreground">{featuredIssue.feedbackSummary.length}</strong> reports</span>
              </div>
            </div>
          </Link>
        )}

        {/* User Impact Bento Box */}
        <div className="col-span-1 md:col-span-1 lg:col-span-1 row-span-1 rounded-xl border border-border bg-card p-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Impact Radius</span>
            <Icon icon="lucide:radar" className="text-muted-foreground w-4 h-4" />
          </div>
          <div>
            <div className="text-3xl font-bold text-status-critical tracking-tighter">14K+</div>
            <p className="text-xs text-muted-foreground mt-1 text-balance">Users experiencing degradation</p>
          </div>
        </div>

        {/* Small Analytics Box */}
        <div className="hidden lg:flex col-span-1 lg:col-span-1 row-span-1 rounded-xl border border-border bg-card p-6 flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Resolution Rate</span>
            <Icon icon="lucide:check-circle-2" className="text-muted-foreground w-4 h-4" />
          </div>
          <div>
            <div className="text-3xl font-bold tracking-tighter">99.2%</div>
            <p className="text-xs text-muted-foreground mt-1 text-balance">Rolling 30-day average</p>
          </div>
        </div>

        {/* Remaining Issues styled as standard boxes */}
        {remainingIssues.map((issue) => (
          <Link
            key={issue.id}
            href={`/issue/${issue.id}`}
            className="group block col-span-1 rounded-xl border border-border bg-card hover:border-foreground/20 hover:shadow-sm transition-all p-5 flex flex-col"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-muted-foreground text-xs font-mono">{issue.id}</span>
              <StatusBadge severity={issue.severity} />
            </div>

            <h2 className="text-base font-bold tracking-tight mb-2 group-hover:text-primary transition-colors leading-snug line-clamp-2">
              {issue.title}
            </h2>

            <div className="mt-auto pt-4 flex items-center justify-between">
              <time className="text-muted-foreground text-xs">{issue.date}</time>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-muted-foreground text-xs font-medium">
                  <Icon icon="lucide:users" className="w-3.5 h-3.5" />
                  <span>{issue.affectedUsers}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
