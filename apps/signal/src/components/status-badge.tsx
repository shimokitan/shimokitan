import { cn } from "@shimokitan/ui";
import { Severity } from "../lib/data";

interface StatusBadgeProps {
    severity: Severity;
    className?: string;
}

export function StatusBadge({ severity, className }: StatusBadgeProps) {
    const isCritical = severity === "Critical";
    const isHigh = severity === "High";
    const isMonitoring = severity === "Monitoring";
    const isResolved = severity === "Resolved";

    return (
        <div
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
                isCritical && "bg-[var(--status-critical)]/10 text-[var(--status-critical)] border border-[var(--status-critical)]/20",
                isHigh && "bg-[var(--status-high)]/10 text-[var(--status-high)] border border-[var(--status-high)]/20",
                isMonitoring && "bg-[var(--status-monitoring)]/10 text-[var(--status-monitoring)] border border-[var(--status-monitoring)]/20",
                isResolved && "bg-[var(--status-resolved)]/10 text-[var(--status-resolved)] border border-[var(--status-resolved)]/20",
                className
            )}
        >
            <div
                className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    isCritical && "bg-[var(--status-critical)] animate-[pulse_2s_ease-in-out_infinite]",
                    isHigh && "bg-[var(--status-high)]",
                    isMonitoring && "bg-[var(--status-monitoring)]",
                    isResolved && "bg-[var(--status-resolved)]"
                )}
            />
            {severity}
        </div>
    );
}
