import { CircleAlertIcon, CircleCheckIcon, InfoIcon } from "lucide-react";
import { Clickable } from "#/components/atoms/clickable";
import { Toast, type ToastData } from "#/components/ui/toast";

// The toast stack's edges (Epic #166): a queue created outside React and
// given to the Provider (its `limit` 3, so a fourth toast is queued, hidden and
// inert, until one in front closes), a toast that never closes, long text
// that wraps, a high-priority alert, and every status palette. Switch the
// direction in the toolbar: the stack moves to the bottom left in RTL, and
// a swipe still dismisses towards the base's physical default.
const manager = Toast.createToastManager();

const PALETTES = [
    "palette-neutral",
    "palette-green",
    "palette-blue",
    "palette-purple",
    "palette-orange",
    "palette-rose",
    "palette-danger",
];

let count = 0;

function add(options: Parameters<typeof manager.add>[0]) {
    count += 1;
    manager.add({ ...options, title: `${options.title} #${count}` });
}

export default function ToastStack() {
    return (
        <div className="palette-surface flex flex-col gap-4 rounded-lg border border-palette-line bg-palette-base p-6 text-palette-contrast">
            <Toast.Provider toastManager={manager} limit={3}>
                <div className="flex flex-wrap gap-2">
                    <Clickable.Button
                        variant="outline"
                        onClick={() =>
                            add({
                                title: "Saved",
                                description: "Closes after 5 seconds.",
                                data: {
                                    icon: <CircleCheckIcon />,
                                    palette: "palette-green",
                                } satisfies ToastData,
                            })
                        }
                    >
                        Add a toast
                    </Clickable.Button>
                    <Clickable.Button
                        variant="outline"
                        onClick={() =>
                            add({
                                title: "Pinned",
                                description:
                                    "This one never closes by itself (timeout 0). Its text is long enough to wrap over several lines, so the stack's heights differ.",
                                timeout: 0,
                                data: {
                                    icon: <InfoIcon />,
                                    action: { label: "Got it" },
                                } satisfies ToastData,
                            })
                        }
                    >
                        Add a pinned toast
                    </Clickable.Button>
                    <Clickable.Button
                        variant="outline"
                        onClick={() =>
                            add({
                                title: "Connection lost",
                                priority: "high",
                                data: {
                                    icon: <CircleAlertIcon />,
                                    palette: "palette-danger",
                                } satisfies ToastData,
                            })
                        }
                    >
                        Add an alert
                    </Clickable.Button>
                    <Clickable.Button
                        variant="outline"
                        onClick={() => {
                            for (const palette of PALETTES) {
                                add({
                                    title: palette,
                                    description:
                                        "A status palette on the icon.",
                                    data: {
                                        icon: <CircleCheckIcon />,
                                        palette,
                                    } satisfies ToastData,
                                });
                            }
                        }}
                    >
                        Add every palette (queued past 3)
                    </Clickable.Button>
                    <Clickable.Button
                        variant="ghost"
                        onClick={() => manager.close()}
                    >
                        Close all
                    </Clickable.Button>
                </div>
                <Toast.Template.Simple />
            </Toast.Provider>
        </div>
    );
}
