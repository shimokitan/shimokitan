"use client"

import React, { useRef, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';
import { cn } from "@shimokitan/ui";

/**
 * Converts rendered legal page HTML content to clean Markdown.
 * Processes headings, paragraphs, lists, links, bold text, and code elements.
 */
function htmlToMarkdown(element: HTMLElement): string {
    const lines: string[] = [];

    const walkNodes = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE) {
            return node.textContent || '';
        }

        if (node.nodeType !== Node.ELEMENT_NODE) return '';

        const el = node as HTMLElement;
        const tag = el.tagName.toLowerCase();

        switch (tag) {
            case 'h1':
                lines.push(`# ${el.textContent?.trim()}`);
                lines.push('');
                return;
            case 'h2':
                lines.push(`## ${el.textContent?.trim()}`);
                lines.push('');
                return;
            case 'h3':
                lines.push(`### ${el.textContent?.trim()}`);
                lines.push('');
                return;
            case 'hr':
                lines.push('---');
                lines.push('');
                return;
            case 'p': {
                const content = inlineContent(el);
                lines.push(content);
                lines.push('');
                return;
            }
            case 'ul': {
                Array.from(el.children).forEach((li) => {
                    const content = inlineContent(li as HTMLElement);
                    lines.push(`- ${content}`);
                });
                lines.push('');
                return;
            }
            case 'ol': {
                Array.from(el.children).forEach((li, i) => {
                    const content = inlineContent(li as HTMLElement);
                    lines.push(`${i + 1}. ${content}`);
                });
                lines.push('');
                return;
            }
            default:
                Array.from(el.childNodes).forEach(walkNodes);
        }
    };

    /** Processes inline content within a block element, preserving bold, links, and code. */
    const inlineContent = (el: HTMLElement): string => {
        let result = '';
        el.childNodes.forEach((child) => {
            if (child.nodeType === Node.TEXT_NODE) {
                result += child.textContent || '';
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                const childEl = child as HTMLElement;
                const tag = childEl.tagName.toLowerCase();

                if (tag === 'strong' || tag === 'b') {
                    result += `**${childEl.textContent?.trim()}**`;
                } else if (tag === 'em' || tag === 'i') {
                    result += `*${childEl.textContent?.trim()}*`;
                } else if (tag === 'a') {
                    const href = childEl.getAttribute('href') || '';
                    const text = childEl.textContent?.trim() || '';
                    result += `[${text}](${href})`;
                } else if (tag === 'code') {
                    result += `\`${childEl.textContent?.trim()}\``;
                } else if (tag === 'br') {
                    result += '\n';
                } else {
                    result += inlineContent(childEl);
                }
            }
        });
        return result;
    };

    Array.from(element.childNodes).forEach(walkNodes);

    return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}

interface CopyMarkdownWrapperProps {
    children: React.ReactNode;
}

export function CopyMarkdownWrapper({ children }: CopyMarkdownWrapperProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [copied, setCopied] = useState(false);

    const handleCopy = useCallback(async () => {
        if (!contentRef.current) return;

        const markdown = htmlToMarkdown(contentRef.current);

        try {
            await navigator.clipboard.writeText(markdown);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = markdown;
            textarea.style.position = 'fixed';
            textarea.style.opacity = '0';
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    }, []);

    return (
        <div className="flex flex-col">
            <div className="flex justify-end mb-8 relative z-10">
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 py-1 border-b border-zinc-800 hover:border-violet-500 text-zinc-400 hover:text-white text-[10px] font-mono uppercase tracking-[0.2em] transition-all cursor-pointer group/copy"
                    title="Copy page content as Markdown"
                >
                    <Icon
                        icon={copied ? 'lucide:check' : 'lucide:file-code'}
                        width={12}
                        height={12}
                        className={copied ? 'text-emerald-400' : 'text-zinc-500 group-hover/copy:text-violet-400 transition-colors'}
                    />
                    <span className={copied ? "text-emerald-400" : "group-hover/copy:text-violet-400"}>
                        {copied ? 'COPIED' : 'COPY'}
                    </span>
                </button>
            </div>
            <div ref={contentRef}>
                {children}
            </div>
        </div>
    );
}
