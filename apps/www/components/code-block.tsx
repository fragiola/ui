"use client";

import { useState } from "react";

type CodeBlockProps = {
    code: string;
    language?: string;
};

export function CodeBlock({ code, language = "tsx" }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative rounded-md border border-palette-line bg-palette-soft overflow-hidden">
            <div className="flex items-center justify-between border-b border-palette-line px-3 py-1.5">
                <span className="text-xs text-palette-accent/85 font-mono">
                    {language}
                </span>
                <button
                    type="button"
                    onClick={handleCopy}
                    className="text-xs text-palette-accent/85 hover:text-palette-contrast transition-colors"
                >
                    {copied ? "Copied!" : "Copy"}
                </button>
            </div>
            <pre className="p-4 overflow-x-auto text-sm font-mono text-palette-contrast">
                <code>{code}</code>
            </pre>
        </div>
    );
}
