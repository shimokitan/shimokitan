import React from "react";

/**
 * Renders a string with inline markdown bold (**text**) as React elements.
 * Converts **bold** syntax into <strong> elements while keeping plain text as-is.
 * Intended for rendering legal page content where markdown bold is used in i18n strings.
 */
export function InlineMarkdown({ text }: { text: string }) {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return (
        <>
            {parts.map((part: string, index: number) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return <strong key={index}>{part.slice(2, -2)}</strong>;
                }
                return <React.Fragment key={index}>{part}</React.Fragment>;
            })}
        </>
    );
}
