import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const badgeVariants = cva(
    "px-2 py-0.5 rounded-sm text-[8px] font-mono border backdrop-blur-md tracking-tighter uppercase transition-colors whitespace-nowrap",
    {
        variants: {
            variant: {
                default: "bg-zinc-800/50 text-zinc-400 border-zinc-700/30",
                gold: "bg-amber-900/40 text-amber-400 border-amber-700/60",
                truth: "bg-emerald-900/40 text-emerald-400 border-emerald-700/60",
                distortion: "bg-rose-900/40 text-rose-400 border-rose-700/60",
                clean: "bg-violet-900/40 text-violet-400 border-violet-700/60",
                violet: "bg-violet-900/30 text-violet-200 border-violet-700/30",
                zinc: "bg-zinc-900/30 text-zinc-200 border-zinc-700/30",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <span
            className={cn(badgeVariants({ variant }), className)}
            {...props}
        />
    )
}

export { Badge, badgeVariants }
