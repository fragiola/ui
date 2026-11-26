"use client";

import { DropZone as DropZonePrimitive } from "@fragiola/primitives-react/drop-zone";
import { UploadCloudIcon } from "lucide-react";
import type * as React from "react";
import { file } from "#/families/file";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// DropZone — a target files are dropped on, pasted on (Ctrl or Cmd+V) or
// picked for in the browser's dialog, which a press (Enter, Space, a click)
// opens (spec/drop-zone.md). It reports the accepted (`accept`) and the
// rejected files (`onFileDrop`) and writes the app's `announcement` into a
// polite live region. It keeps no files: a list and a form value are a
// FileUpload.
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no drop
// zone, so this one shared file wraps Fragiola Primitives' on every base.
//
// The look is the `file` family's:
//   Root   the target, a button (`file.dropZone`): a dashed `line` box; while
//          files are dragged over it, the dashed `ring` drop outline. Its
//          content names it; an icon-only one takes an `aria-label`
//   Icon   the featured icon at its top (`file.icon`), an upload cloud by
//          default
//   Template.Simple  the icon, a line of copy (`children`, "Drop files here
//          or click to choose" by default) and an optional `hint`.

type P = typeof DropZonePrimitive;

function DropZoneRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <DropZonePrimitive.Root
                data-slot="drop-zone"
                className={cn(file.dropZone(), className as string)}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function DropZoneIcon({
    className,
    children,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="drop-zone-icon"
            aria-hidden="true"
            className={cn(file.icon(), className as string)}
            {...props}
        >
            {children ?? <UploadCloudIcon />}
        </span>
    );
}

/**
 * The common drop zone: the icon, a line of copy (`children`, "Drop files
 * here or click to choose" by default) and an optional `hint` below it
 * (the accepted types, a size limit). Every Root prop is forwarded; `className`
 * goes to the target.
 */
function DropZoneTemplateSimple({
    children,
    hint,
    ...props
}: PrimitivesProps<P["Root"], "div"> & { hint?: React.ReactNode }) {
    return (
        <DropZoneRoot {...props}>
            <DropZoneIcon />
            <span className={file.text()}>
                <span className={file.label()}>
                    {children ?? "Drop files here or click to choose"}
                </span>
                {hint ? <span className={file.meta()}>{hint}</span> : null}
            </span>
        </DropZoneRoot>
    );
}

export const DropZone = {
    Root: DropZoneRoot,
    Icon: DropZoneIcon,
    Template: { Simple: DropZoneTemplateSimple },
};
