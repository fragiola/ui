"use client";

import {
    type FileRejection,
    FileUpload as FileUploadPrimitive,
} from "@fragiola/primitives-react/file-upload";
import { FileIcon, Trash2Icon, UploadCloudIcon } from "lucide-react";
import type * as React from "react";
import { clickable } from "#/atoms/clickable";
import { field } from "#/families/field";
import { file } from "#/families/file";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import {
    PrimitivesDirection,
    type PrimitivesProps,
} from "#/lib/primitives-backed";

// FileUpload — a form control holding a list of files (spec/file-upload.md):
// picked in the browser's dialog (the Trigger, the Label, the Dropzone),
// dropped or pasted on the Dropzone; each new file is checked (`accept`,
// `maxFiles`, `minFileSize`, `maxFileSize`, `validate`) into the value or
// the rejected list, with its reasons; the hidden file input submits the
// accepted files with the form. It does not upload: the app sends the files
// and shows their progress (the example simulates it with a Progress).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no file
// upload, so this one shared file wraps Fragiola Primitives' on every base.
//
// The look is the `file` family's, after Untitled UI's file upload:
//   Root              a column: the Label, the Dropzone, the list
//   Label             names the group (`field.label`'s type); a press opens
//                     the dialog
//   Dropzone          the Drop Zone's target (`file.dropZone`): the dashed
//                     `ring` drop outline while files are dragged over it
//   DropzoneIcon      its featured icon (`file.icon`)
//   Trigger           an outline Clickable that opens the dialog
//   HiddenInput       the form's file input, visually hidden
//   ItemGroup         the list (`file.list`)
//   Item              one file, a control box (`file.item`); a rejected one
//                     gets `palette-danger` from its state (`file.rejected`):
//                     a red stroke with red text
//   ItemPreview       an image's thumbnail (`file.preview`), rendered only for
//                     a file of its `type` ("image/*")
//   ItemPreviewImage  the image (`file.image`); give it an `alt`
//   ItemIcon          the type icon for any other file, the same square
//   ItemText          the name and the size beside the preview (`file.text`)
//   ItemName          the file's name (`file.name`)
//   ItemSizeText      its size in the locale's units (`file.meta`)
//   ItemError         a rejected file's reason, in place of its size
//                     (`file.meta`, red by the Item's palette)
//   ItemDeleteTrigger a ghost square Clickable (a bin); name it
//   ClearTrigger      a ghost Clickable that removes every file, hidden while
//                     there is none
//   Template.Simple   the Label, the Dropzone with its copy and `hint`, the
//                     hidden input, and every file (accepted, then rejected
//                     with its reason) with its delete button.

type P = typeof FileUploadPrimitive;

function FileUploadRoot({
    className,
    ...props
}: PrimitivesProps<P["Root"], "div">) {
    return (
        <PrimitivesDirection>
            <FileUploadPrimitive.Root
                data-slot="file-upload"
                className={cn(
                    "flex w-full flex-col gap-3",
                    className as string,
                )}
                {...props}
            />
        </PrimitivesDirection>
    );
}

function FileUploadLabel({
    className,
    ...props
}: PrimitivesProps<P["Label"], "label">) {
    return (
        <FileUploadPrimitive.Label
            data-slot="file-upload-label"
            className={cn(field.label(), "text-sm", className as string)}
            {...props}
        />
    );
}

function FileUploadDropzone({
    className,
    ...props
}: PrimitivesProps<P["Dropzone"], "div">) {
    return (
        <FileUploadPrimitive.Dropzone
            data-slot="file-upload-dropzone"
            className={cn(file.dropZone(), className as string)}
            {...props}
        />
    );
}

function FileUploadDropzoneIcon({
    className,
    children,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="file-upload-dropzone-icon"
            aria-hidden="true"
            className={cn(file.icon(), className as string)}
            {...props}
        >
            {children ?? <UploadCloudIcon />}
        </span>
    );
}

function FileUploadTrigger({
    className,
    ...props
}: PrimitivesProps<P["Trigger"], "button">) {
    return (
        <FileUploadPrimitive.Trigger
            data-slot="file-upload-trigger"
            className={cn(
                clickable({ variant: "outline", size: "sm" }),
                foundation.disabled(),
                className as string,
            )}
            {...props}
        />
    );
}

function FileUploadHiddenInput(
    props: PrimitivesProps<P["HiddenInput"], "input">,
) {
    return (
        <FileUploadPrimitive.HiddenInput
            data-slot="file-upload-hidden-input"
            {...props}
        />
    );
}

function FileUploadItemGroup({
    className,
    ...props
}: PrimitivesProps<P["ItemGroup"], "ul">) {
    return (
        <FileUploadPrimitive.ItemGroup
            data-slot="file-upload-item-group"
            className={cn(file.list(), className as string)}
            {...props}
        />
    );
}

type ItemState = { rejected: boolean };

function FileUploadItem({
    className,
    ...props
}: PrimitivesProps<P["Item"], "li">) {
    // A palette is a plain class, which a variant cannot switch: the item
    // adds `palette-danger` from its state (as Grid Layout's refused drop).
    return (
        <FileUploadPrimitive.Item
            data-slot="file-upload-item"
            className={(state: ItemState) =>
                cn(
                    file.item(),
                    state.rejected && file.rejected(),
                    typeof className === "function"
                        ? (className as (s: ItemState) => string)(state)
                        : (className as string),
                )
            }
            {...props}
        />
    );
}

function FileUploadItemPreview({
    className,
    ...props
}: PrimitivesProps<P["ItemPreview"], "div">) {
    return (
        <FileUploadPrimitive.ItemPreview
            data-slot="file-upload-item-preview"
            className={cn(file.preview(), className as string)}
            {...props}
        />
    );
}

function FileUploadItemPreviewImage({
    className,
    ...props
}: PrimitivesProps<P["ItemPreviewImage"], "img">) {
    return (
        <FileUploadPrimitive.ItemPreviewImage
            data-slot="file-upload-item-preview-image"
            className={cn(file.image(), className as string)}
            {...props}
        />
    );
}

function FileUploadItemIcon({
    className,
    children,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="file-upload-item-icon"
            aria-hidden="true"
            className={cn(file.preview(), className as string)}
            {...props}
        >
            {children ?? <FileIcon />}
        </span>
    );
}

function FileUploadItemText({
    className,
    ...props
}: React.ComponentProps<"div">) {
    return (
        <div
            data-slot="file-upload-item-text"
            className={cn(file.text(), className as string)}
            {...props}
        />
    );
}

function FileUploadItemName({
    className,
    ...props
}: PrimitivesProps<P["ItemName"], "span">) {
    return (
        <FileUploadPrimitive.ItemName
            data-slot="file-upload-item-name"
            className={cn(file.name(), className as string)}
            {...props}
        />
    );
}

function FileUploadItemSizeText({
    className,
    ...props
}: PrimitivesProps<P["ItemSizeText"], "span">) {
    return (
        <FileUploadPrimitive.ItemSizeText
            data-slot="file-upload-item-size-text"
            className={cn(file.meta(), className as string)}
            {...props}
        />
    );
}

function FileUploadItemError({
    className,
    ...props
}: React.ComponentProps<"span">) {
    return (
        <span
            data-slot="file-upload-item-error"
            className={cn(file.meta(), className as string)}
            {...props}
        />
    );
}

function FileUploadItemDeleteTrigger({
    className,
    children,
    ...props
}: PrimitivesProps<P["ItemDeleteTrigger"], "button">) {
    return (
        <FileUploadPrimitive.ItemDeleteTrigger
            data-slot="file-upload-item-delete-trigger"
            className={cn(
                clickable({ variant: "ghost", shape: "square", size: "sm" }),
                foundation.disabled(),
                foundation.secondary(),
                "shrink-0",
                className as string,
            )}
            {...props}
        >
            {children ?? <Trash2Icon />}
        </FileUploadPrimitive.ItemDeleteTrigger>
    );
}

function FileUploadClearTrigger({
    className,
    ...props
}: PrimitivesProps<P["ClearTrigger"], "button">) {
    return (
        <FileUploadPrimitive.ClearTrigger
            data-slot="file-upload-clear-trigger"
            className={cn(
                clickable({ variant: "ghost", size: "sm" }),
                foundation.disabled(),
                "self-start",
                className as string,
            )}
            {...props}
        />
    );
}

/** A rejection's first reason, in English. */
const REASONS: Record<string, string> = {
    "invalid-type": "This file type is not accepted.",
    "too-large": "This file is too large.",
    "too-small": "This file is too small.",
    "too-many": "Too many files.",
};

function reasonText(reasons: readonly string[]): string {
    const reason = reasons[0] ?? "";
    return REASONS[reason] ?? reason;
}

/** One file of the template: its preview or icon, name, size or reason. */
function TemplateItem({
    file: item,
    reasons,
}: {
    file: File;
    reasons?: readonly string[];
}) {
    return (
        <FileUploadItem file={item}>
            {item.type.startsWith("image/") ? (
                <FileUploadItemPreview>
                    <FileUploadItemPreviewImage alt="" />
                </FileUploadItemPreview>
            ) : (
                <FileUploadItemIcon />
            )}
            <FileUploadItemText>
                <FileUploadItemName />
                {reasons ? (
                    <FileUploadItemError>
                        {reasonText(reasons)}
                    </FileUploadItemError>
                ) : (
                    <FileUploadItemSizeText />
                )}
            </FileUploadItemText>
            <FileUploadItemDeleteTrigger aria-label={`Delete ${item.name}`} />
        </FileUploadItem>
    );
}

/**
 * The common file upload: the Label (`label`), the Dropzone with its icon,
 * "Click to upload or drag and drop" and `hint`, the hidden input, and every
 * file (accepted, then rejected with its reason in English) with its delete
 * button ("Delete <name>"). Every Root prop is forwarded; `className` goes
 * to the root.
 */
function FileUploadTemplateSimple({
    label,
    hint,
    ...props
}: Omit<PrimitivesProps<P["Root"], "div">, "children"> & {
    label?: React.ReactNode;
    hint?: React.ReactNode;
}) {
    return (
        <FileUploadRoot {...props}>
            {({
                value,
                rejectedFiles,
            }: {
                value: File[];
                rejectedFiles: FileRejection<File>[];
            }) => (
                <>
                    {label ? <FileUploadLabel>{label}</FileUploadLabel> : null}
                    <FileUploadDropzone>
                        <FileUploadDropzoneIcon />
                        <FileUploadItemText>
                            <span className={file.label()}>
                                Click to upload or drag and drop
                            </span>
                            {hint ? (
                                <span className={file.meta()}>{hint}</span>
                            ) : null}
                        </FileUploadItemText>
                    </FileUploadDropzone>
                    <FileUploadHiddenInput />
                    {value.length + rejectedFiles.length ? (
                        <FileUploadItemGroup>
                            {value.map((item) => (
                                <TemplateItem
                                    key={`${item.name}:${item.size}:${item.lastModified}`}
                                    file={item}
                                />
                            ))}
                            {rejectedFiles.map(({ file: item, reasons }) => (
                                <TemplateItem
                                    key={`rejected:${item.name}:${item.size}:${item.lastModified}`}
                                    file={item}
                                    reasons={reasons}
                                />
                            ))}
                        </FileUploadItemGroup>
                    ) : null}
                </>
            )}
        </FileUploadRoot>
    );
}

export const FileUpload = {
    Root: FileUploadRoot,
    Label: FileUploadLabel,
    Dropzone: FileUploadDropzone,
    DropzoneIcon: FileUploadDropzoneIcon,
    Trigger: FileUploadTrigger,
    HiddenInput: FileUploadHiddenInput,
    ItemGroup: FileUploadItemGroup,
    Item: FileUploadItem,
    ItemPreview: FileUploadItemPreview,
    ItemPreviewImage: FileUploadItemPreviewImage,
    ItemIcon: FileUploadItemIcon,
    ItemText: FileUploadItemText,
    ItemName: FileUploadItemName,
    ItemSizeText: FileUploadItemSizeText,
    ItemError: FileUploadItemError,
    ItemDeleteTrigger: FileUploadItemDeleteTrigger,
    ClearTrigger: FileUploadClearTrigger,
    Template: { Simple: FileUploadTemplateSimple },
};
