"use client";

import { RotateCwIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { FileUpload } from "#/components/ui/file-upload";
import { Progress } from "#/components/ui/progress";

// The app's side of an upload: FileUpload checks and holds the files, the
// app sends them. Here the transport is simulated: every new file climbs to
// 100% on a timer, and a file named "*-fail.*" fails, so each state shows.
type Upload = { progress: number; failed: boolean };

const keyOf = (file: File) => `${file.name}:${file.size}:${file.lastModified}`;

// A small image, so the seeded list shows a real thumbnail.
const HERO_ART =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#dbeafe"/><circle cx="28" cy="12" r="5" fill="#f59e0b"/><path d="M0 40 L14 20 L26 32 L32 26 L40 34 V40 Z" fill="#2563eb"/></svg>';

// Files already in the list when the page opens: one done, one uploading,
// one that failed (a real app would get them from its own state).
const SEEDED = [
    new File([new Uint8Array(1_800_000)], "brand-guidelines.pdf", {
        type: "application/pdf",
        lastModified: 1,
    }),
    new File([HERO_ART], "hero-art.svg", {
        type: "image/svg+xml",
        lastModified: 2,
    }),
    new File([new Uint8Array(96_000)], "pricing-fail.pdf", {
        type: "application/pdf",
        lastModified: 3,
    }),
];

const REASONS: Record<string, string> = {
    "invalid-type": "Only images and PDFs are accepted.",
    "too-large": "Larger than 5 MB.",
    "too-many": "Up to 5 files.",
};

// A project's attachments in the default look, after Untitled UI's file
// upload: a press, Enter or Space on the drop zone opens the dialog, files
// dropped on it are checked (images and PDFs, up to 5 MB, 5 files), and
// while files are dragged over it the zone shows the dashed `ring` drop
// outline. Each file is a row: its preview or icon, its name, the simulated
// upload's progress (a Progress, on the `track` family), "Complete", or the
// error, which is `palette-danger` (a rejected file by its state, a failed
// upload by its class) with a retry. The delete button removes a file and
// moves the focus on.
export default function FileUploadDemo() {
    const [files, setFiles] = useState<File[]>(SEEDED);
    const [uploads, setUploads] = useState<Record<string, Upload>>({
        [keyOf(SEEDED[0] as File)]: { progress: 100, failed: false },
        [keyOf(SEEDED[1] as File)]: { progress: 40, failed: false },
        [keyOf(SEEDED[2] as File)]: { progress: 60, failed: true },
    });

    // the simulated transport: every running upload moves on
    useEffect(() => {
        const timer = window.setInterval(() => {
            setUploads((all) => {
                let changed = false;
                const next = { ...all };
                for (const file of files) {
                    const key = keyOf(file);
                    const upload = next[key] ?? { progress: 0, failed: false };
                    if (upload.failed || upload.progress >= 100) continue;
                    const progress = Math.min(100, upload.progress + 8);
                    next[key] = {
                        progress,
                        failed: file.name.includes("-fail") && progress >= 60,
                    };
                    changed = true;
                }
                return changed ? next : all;
            });
        }, 400);
        return () => window.clearInterval(timer);
    }, [files]);

    const retry = (file: File) =>
        setUploads((all) => ({
            ...all,
            [keyOf(file)]: { progress: 0, failed: false },
        }));

    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <FileUpload.Root
                name="attachments"
                className="max-w-md"
                value={files}
                onValueChange={setFiles}
                accept={["image/*", ".pdf"]}
                maxFiles={5}
                maxFileSize={5_000_000}
                announcement={({ acceptedFiles, rejectedFiles }) =>
                    `${acceptedFiles.length} added, ${rejectedFiles.length} rejected`
                }
            >
                {({ value, rejectedFiles }) => (
                    <>
                        <FileUpload.Label>Attachments</FileUpload.Label>
                        <FileUpload.Dropzone>
                            <FileUpload.DropzoneIcon />
                            <FileUpload.ItemText className="items-center">
                                <span className="font-medium text-palette-contrast">
                                    Click to upload or drag and drop
                                </span>
                                <span className="text-xs">
                                    Images or PDF, up to 5 MB each
                                </span>
                            </FileUpload.ItemText>
                        </FileUpload.Dropzone>
                        <FileUpload.HiddenInput />
                        <FileUpload.ItemGroup>
                            {value.map((file) => {
                                const upload = uploads[keyOf(file)] ?? {
                                    progress: 0,
                                    failed: false,
                                };
                                return (
                                    <FileUpload.Item
                                        key={keyOf(file)}
                                        file={file}
                                        className={
                                            upload.failed
                                                ? "palette-danger"
                                                : undefined
                                        }
                                    >
                                        <Preview file={file} />
                                        <FileUpload.ItemText>
                                            <FileUpload.ItemName />
                                            {upload.failed ? (
                                                <FileUpload.ItemError>
                                                    Upload failed.
                                                </FileUpload.ItemError>
                                            ) : upload.progress < 100 ? (
                                                <Progress.Root
                                                    value={upload.progress}
                                                    aria-label={`Uploading ${file.name}`}
                                                    className="gap-1"
                                                >
                                                    <Progress.Track>
                                                        <Progress.Indicator />
                                                    </Progress.Track>
                                                </Progress.Root>
                                            ) : (
                                                <span className="flex gap-1.5">
                                                    <FileUpload.ItemSizeText />
                                                    <span className="text-xs text-palette-accent/85">
                                                        · Complete
                                                    </span>
                                                </span>
                                            )}
                                        </FileUpload.ItemText>
                                        {upload.failed ? (
                                            <Clickable.Button
                                                variant="ghost"
                                                shape="square"
                                                size="sm"
                                                aria-label={`Retry ${file.name}`}
                                                onClick={() => retry(file)}
                                            >
                                                <RotateCwIcon />
                                            </Clickable.Button>
                                        ) : null}
                                        <FileUpload.ItemDeleteTrigger
                                            aria-label={`Delete ${file.name}`}
                                        />
                                    </FileUpload.Item>
                                );
                            })}
                            {rejectedFiles.map(({ file, reasons }) => (
                                <FileUpload.Item
                                    key={`rejected:${keyOf(file)}`}
                                    file={file}
                                >
                                    <Preview file={file} />
                                    <FileUpload.ItemText>
                                        <FileUpload.ItemName />
                                        <FileUpload.ItemError>
                                            {REASONS[reasons[0] ?? ""] ??
                                                "This file was not added."}
                                        </FileUpload.ItemError>
                                    </FileUpload.ItemText>
                                    <FileUpload.ItemDeleteTrigger
                                        aria-label={`Dismiss ${file.name}`}
                                    />
                                </FileUpload.Item>
                            ))}
                        </FileUpload.ItemGroup>
                    </>
                )}
            </FileUpload.Root>
        </div>
    );
}

// An image's thumbnail, else the file's icon.
function Preview({ file }: { file: File }) {
    return file.type.startsWith("image/") ? (
        <FileUpload.ItemPreview>
            <FileUpload.ItemPreviewImage alt="" />
        </FileUpload.ItemPreview>
    ) : (
        <FileUpload.ItemIcon />
    );
}
