"use client";

import { useState } from "react";

type InstallCommandProps = {
    name: string;
};

export function InstallCommand({ name }: InstallCommandProps) {
    const [copied, setCopied] = useState(false);
    const command = `npx shadcn@latest add @fragiola/${name}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(command);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2 rounded-md border border-palette-line bg-palette-soft px-3 py-2">
            <code className="flex-1 text-sm font-mono text-palette-contrast">
                {command}
            </code>
            <button
                type="button"
                onClick={handleCopy}
                className="text-xs text-palette-accent/85 hover:text-palette-contrast transition-colors"
            >
                {copied ? "Copied!" : "Copy"}
            </button>
        </div>
    );
}
