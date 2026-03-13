"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function InterceptedClose() {
    const router = useRouter();
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") router.back();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [router]);
    return null;
}
