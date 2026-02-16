"use client"

import React, { useRef, useState, useCallback } from 'react';
import { Icon } from '@iconify/react';

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
        <div className="relative">
            <button
                onClick={handleCopy}
                className="absolute top-0 right-0 flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300 text-[10px] font-mono uppercase tracking-widest transition-all cursor-pointer backdrop-blur-sm"
                title="Copy page content as Markdown"
            >
                <Icon
                    icon={copied ? 'lucide:check' : 'lucide:clipboard-copy'}
                    width={12}
                    height={12}
                    className={copied ? 'text-emerald-400' : ''}
                />
                {copied ? 'Copied' : 'Copy .md'}
            </button>
            <div ref={contentRef}>
                {children}
            </div>
        </div>
    );
}
