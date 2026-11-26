"use client";

import { type ReactNode, useState } from "react";
import { DropZone } from "#/components/ui/drop-zone";

// A contacts import in the default look: DropZone.Template.Simple takes CSV
// files dropped on it, pasted on it (Ctrl or Cmd+V while it has the focus)
// or picked in the dialog a press opens (Enter, Space, a click). It keeps no
// files: the app lists what it was given, and the zone announces the app's
// text to a screen reader. While files are dragged over it the zone shows
// the dashed `ring` drop outline. Then the states a reader needs: that
// drag-over look, held on for the reader to see, and a disabled zone.
export default function DropZoneDemo() {
    const [received, setReceived] = useState<string[]>([]);
    const [rejected, setRejected] = useState<string[]>([]);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-md flex-col gap-3">
                <DropZone.Template.Simple
                    accept=".csv"
                    hint="CSV files only"
                    onFileDrop={({ acceptedFiles, rejectedFiles }) => {
                        setReceived((all) => [
                            ...all,
                            ...acceptedFiles.map((file) => file.name),
                        ]);
                        setRejected(rejectedFiles.map((file) => file.name));
                    }}
                    announcement={({ acceptedFiles, rejectedFiles }) =>
                        `${acceptedFiles.length} imported, ${rejectedFiles.length} not a CSV file`
                    }
                >
                    Drop contacts here or click to choose
                </DropZone.Template.Simple>
                <ul className="flex flex-col gap-1 text-sm">
                    {received.map((name, index) => (
                        // biome-ignore lint/suspicious/noArrayIndexKey: the same file may be dropped twice
                        <li key={index}>Imported {name}</li>
                    ))}
                    {rejected.map((name, index) => (
                        <li
                            // biome-ignore lint/suspicious/noArrayIndexKey: two rejected files may share a name
                            key={index}
                            className="palette-danger text-palette-accent"
                        >
                            {name} is not a CSV file.
                        </li>
                    ))}
                    {received.length + rejected.length === 0 ? (
                        <li className="text-palette-accent/85">
                            No contacts imported yet.
                        </li>
                    ) : null}
                </ul>
            </div>

            <Row label="states">
                <DropZone.Template.Simple
                    className="w-60"
                    data-drop-target=""
                    hint="dragging files over it"
                >
                    Drag-over
                </DropZone.Template.Simple>
                <DropZone.Template.Simple
                    className="w-60"
                    disabled
                    hint="disabled"
                >
                    Uploads are paused
                </DropZone.Template.Simple>
            </Row>
        </div>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
                {children}
            </div>
        </div>
    );
}
