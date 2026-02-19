"use client"

import * as React from "react"
import { Icon } from "@iconify/react"
import { cn } from "@shimokitan/ui"

export interface PasswordInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    accentColor?: "violet" | "rose"
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ className, accentColor = "violet", ...props }, ref) => {
        const [showPassword, setShowPassword] = React.useState(false)

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword)
        }

        const accentBorder = accentColor === "violet" ? "focus:border-violet-600" : "focus:border-rose-600"

        return (
            <div className="relative flex items-center w-full group/pass">
                <input
                    {...props}
                    type={showPassword ? "text" : "password"}
                    className={cn(
                        "bg-transparent border-b border-zinc-800 transition-colors w-full outline-none pr-10",
                        accentBorder,
                        className
                    )}
                    ref={ref}
                />
                <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-white transition-all focus:outline-none p-1 group-hover/pass:text-zinc-500"
                    title={showPassword ? "Hide password" : "Show password"}
                >
                    <Icon
                        icon={showPassword ? "lucide:eye-off" : "lucide:eye"}
                        width={18}
                        height={18}
                        className="transition-transform active:scale-95"
                    />
                </button>
            </div>
        )
    }
)
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
