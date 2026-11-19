import { DicesIcon, ExternalLinkIcon, RotateCcwIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Tooltip } from "#/components/ui/tooltip";
import { Customizer } from "../customizer/customizer";
import {
    type Design,
    type DesignMessage,
    INITIAL,
    isPreviewReady,
    randomize,
    resolve,
} from "../design/design";
import { GetCode } from "../output/get-code";

// The Create page: fragiola.com serves it full-page at /ui/create/ (contract
// v1.6). It is drawn like the docs — a frame, the customizer on the frame
// where the docs sidebar sits, and an inset panel above it — and the page
// itself never scrolls: the inset holds the preview, which scrolls inside.
//
// The preview is another document (create-preview.html in an iframe), so a
// design reaches only it: an axis is a `data-*` on <html>, and this
// document's <html> is never written. Its scheme follows the host's theme
// message (src/theme.ts); the preview's scheme is a design option.

// The site's root, from the embed app's base: `/ui/embed/react/` → `/ui/`.
const BASE = import.meta.env.BASE_URL;
const SITE = BASE.replace(/embed\/react\/?$/, "");
const PREVIEW = `${BASE}create-preview.html`;
const REPOSITORY = "https://github.com/fragiola/ui";

export function CreateShell() {
    const [design, setDesign] = useState<Design>(INITIAL);
    const resolved = useMemo(() => resolve(design), [design]);
    const frame = useRef<HTMLIFrameElement>(null);
    const set = (patch: Partial<Design>) =>
        setDesign((d) => ({ ...d, ...patch }));

    // Send the design to the preview on every change, and whenever it says
    // it is (again) ready — a reload of the frame asks for the design anew.
    const latest = useRef(resolved);
    latest.current = resolved;
    useEffect(() => {
        frame.current?.contentWindow?.postMessage(
            {
                type: "fragiola:create:design",
                resolved,
            } satisfies DesignMessage,
            window.location.origin,
        );
    }, [resolved]);
    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) return;
            if (event.source !== frame.current?.contentWindow) return;
            if (!isPreviewReady(event.data)) return;
            frame.current?.contentWindow?.postMessage(
                {
                    type: "fragiola:create:design",
                    resolved: latest.current,
                } satisfies DesignMessage,
                window.location.origin,
            );
        };
        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, []);

    // R randomizes, unless the reader is typing or a popup is open.
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.key !== "r" || event.metaKey || event.ctrlKey) return;
            const target = event.target as HTMLElement | null;
            if (
                target?.closest(
                    "input, textarea, select, [role=listbox], [role=menu]",
                )
            ) {
                return;
            }
            setDesign((d) => randomize(d));
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <Tooltip.Provider>
            <div className="palette-surface flex h-dvh flex-col overflow-hidden bg-[color-mix(in_oklab,var(--color-palette-soft)_55%,var(--color-palette-base))] text-palette-contrast">
                <header className="flex h-12 shrink-0 items-center gap-3 px-4">
                    <a
                        href={SITE}
                        target="_top"
                        className="text-sm font-semibold text-palette-contrast"
                    >
                        Fragiola UI
                    </a>
                    <span className="text-sm text-palette-accent/85">/</span>
                    <span className="text-sm font-medium">Create</span>
                    <nav className="ms-4 hidden items-center gap-1 md:flex">
                        <Clickable.Link
                            href={`${SITE}docs/getting-started/introduction`}
                            target="_top"
                            variant="ghost"
                            size="sm"
                        >
                            Docs
                        </Clickable.Link>
                        <Clickable.Link
                            href={`${SITE}examples`}
                            target="_top"
                            variant="ghost"
                            size="sm"
                        >
                            Examples
                        </Clickable.Link>
                        <Clickable.Link
                            href={REPOSITORY}
                            target="_blank"
                            rel="noreferrer"
                            variant="ghost"
                            size="sm"
                        >
                            GitHub
                            <ExternalLinkIcon />
                        </Clickable.Link>
                    </nav>
                    <div className="ms-auto flex items-center gap-1.5">
                        <Action
                            label="Randomize (R)"
                            onClick={() => setDesign((d) => randomize(d))}
                        >
                            <DicesIcon />
                        </Action>
                        <Action
                            label="Reset"
                            onClick={() =>
                                setDesign((d) => ({
                                    ...INITIAL,
                                    scheme: d.scheme,
                                    dir: d.dir,
                                }))
                            }
                        >
                            <RotateCcwIcon />
                        </Action>
                        <GetCode resolved={resolved} />
                    </div>
                </header>

                <div className="flex min-h-0 flex-1 flex-col md:flex-row">
                    <aside
                        aria-label="Customize the theme"
                        className="max-h-[38dvh] shrink-0 overflow-auto px-4 pb-4 md:max-h-none md:w-72 md:pt-2"
                    >
                        <Customizer design={design} set={set} />
                    </aside>
                    <main className="min-h-0 min-w-0 flex-1 p-2 pt-0 md:ps-0">
                        <div className="h-full overflow-hidden rounded-xl border border-palette-line bg-palette-base shadow-sm">
                            <iframe
                                ref={frame}
                                title="Theme preview"
                                src={PREVIEW}
                                className="block size-full border-0"
                            />
                        </div>
                    </main>
                </div>
            </div>
        </Tooltip.Provider>
    );
}

function Action({
    label,
    onClick,
    children,
}: {
    label: string;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <Tooltip.Root>
            <Tooltip.Trigger
                render={
                    <Clickable.Button
                        variant="icon"
                        shape="square"
                        size="sm"
                        aria-label={label}
                        onClick={onClick}
                    />
                }
            >
                {children}
            </Tooltip.Trigger>
            <Tooltip.Content>{label}</Tooltip.Content>
        </Tooltip.Root>
    );
}
