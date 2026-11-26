"use client";

import {
    CircleAlertIcon,
    CircleCheckIcon,
    CloudUploadIcon,
    InfoIcon,
} from "lucide-react";
import { Clickable } from "#/components/atoms/clickable";
import { Toast, type ToastData } from "#/components/ui/toast";

// An editor's notifications: saving shows a toast with an Undo action,
// publishing shows one that waits for the upload and then says how it went,
// and losing the connection is announced assertively. The stack sits in the
// corner; hovering it (or F6) spreads it out and pauses the timers. A toast
// is a neutral card: its status is only the palette class on its icon.
// The last row shows the same toast with each status palette.
const STATUSES = [
    { palette: "palette-neutral", icon: <InfoIcon /> },
    { palette: "palette-green", icon: <CircleCheckIcon /> },
    { palette: "palette-blue", icon: <CloudUploadIcon /> },
    { palette: "palette-orange", icon: <CircleAlertIcon /> },
    { palette: "palette-danger", icon: <CircleAlertIcon /> },
];

function Actions() {
    const toasts = Toast.useToastManager<ToastData>();
    return (
        <div className="flex flex-col items-start gap-4">
            <div className="flex flex-wrap gap-2">
                <Clickable.Button
                    className="palette-neutral"
                    onClick={() =>
                        toasts.add({
                            title: "Draft saved",
                            description:
                                "Your changes to “Q3 report” were saved.",
                            data: {
                                icon: <CircleCheckIcon />,
                                palette: "palette-green",
                                action: { label: "Undo" },
                            },
                        })
                    }
                >
                    Save draft
                </Clickable.Button>
                <Clickable.Button
                    variant="outline"
                    onClick={() =>
                        toasts.promise(
                            new Promise((resolve) => setTimeout(resolve, 1500)),
                            {
                                loading: {
                                    title: "Publishing…",
                                    description: "Uploading 3 files.",
                                    data: {
                                        icon: <CloudUploadIcon />,
                                        palette: "palette-blue",
                                    },
                                },
                                success: {
                                    title: "Published",
                                    description: "The report is live.",
                                    data: {
                                        icon: <CircleCheckIcon />,
                                        palette: "palette-green",
                                    },
                                },
                                error: {
                                    title: "Publishing failed",
                                    data: {
                                        icon: <CircleAlertIcon />,
                                        palette: "palette-danger",
                                    },
                                },
                            },
                        )
                    }
                >
                    Publish
                </Clickable.Button>
                <Clickable.Button
                    variant="outline"
                    onClick={() =>
                        toasts.add({
                            title: "Connection lost",
                            description: "Retrying in 5 seconds.",
                            priority: "high",
                            data: {
                                icon: <CircleAlertIcon />,
                                palette: "palette-danger",
                            },
                        })
                    }
                >
                    Go offline
                </Clickable.Button>
            </div>
            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    palettes
                </span>
                <div className="flex flex-wrap gap-2">
                    {STATUSES.map(({ palette, icon }) => (
                        <Clickable.Button
                            key={palette}
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                toasts.add({
                                    title: palette,
                                    description:
                                        "The icon carries the palette.",
                                    data: { icon, palette },
                                })
                            }
                        >
                            {palette.replace("palette-", "")}
                        </Clickable.Button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function ToastDemo() {
    return (
        <div className="palette-surface bg-palette-base text-palette-contrast">
            <Toast.Provider>
                <Actions />
                <Toast.Template.Simple />
            </Toast.Provider>
        </div>
    );
}
