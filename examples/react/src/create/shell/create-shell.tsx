import { DicesIcon, ExternalLinkIcon, RotateCcwIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Clickable } from "#/components/atoms/clickable";
import { Separator } from "#/components/ui/separator";
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
import { usePreviewPromotion } from "./preview-promotion";

// The Create page: fragiola.com serves it full-page at /ui/create/ (contract
// v1.6). It is drawn like the docs — a frame, the panel on the frame where
// the docs sidebar sits, and an inset panel beside it (www's
// `.docs-inset-panel`: a 0.5rem margin, a 0.75rem radius) — and the page
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

const hostScheme = (): Design["scheme"] =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light";

export function CreateShell() {
    // The preview opens in the reader's scheme: the host's theme, which
    // src/theme.ts keeps on this document's <html>. It follows the host until
    // the reader picks a scheme in the customizer; Reset hands it back.
    const [design, setDesign] = useState<Design>(() => ({
        ...INITIAL,
        scheme: hostScheme(),
    }));
    const schemeChosen = useRef(false);
    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (schemeChosen.current) return;
            setDesign((d) =>
                d.scheme === hostScheme() ? d : { ...d, scheme: hostScheme() },
            );
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });
        return () => observer.disconnect();
    }, []);
    const resolved = useMemo(() => resolve(design), [design]);
    const frame = useRef<HTMLIFrameElement>(null);
    // A modal opened in the preview covers the whole page: the frame leaves
    // the inset for the viewport while it is open (preview-promotion.ts).
    const promoted = usePreviewPromotion(frame);
    const set = (patch: Partial<Design>) => {
        if (patch.scheme) schemeChosen.current = true;
        setDesign((d) => ({ ...d, ...patch }));
    };

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

    const reset = () => {
        schemeChosen.current = false;
        setDesign((d) => ({
            ...INITIAL,
            scheme: hostScheme(),
            dir: d.dir,
        }));
    };

    // No header: the panel on the frame holds everything, top to bottom —
    // the links, a rule, Randomize and Reset, the controls (which scroll)
    // and Get code, pinned at the bottom. The inset takes the full height,
    // with the docs' 0.5rem margin on every side.
    //
    // Two tones: the frame is `palette-raised`, a step above the floor; the
    // inset, the preview's canvas inside it and its cards share
    // `palette-surface`, the cards set apart by their line and shadow.
    return (
        <Tooltip.Provider>
            <div
                data-frame=""
                className="palette-raised flex h-dvh flex-col overflow-hidden bg-palette-base text-palette-contrast md:flex-row"
            >
                <aside
                    aria-label="Customize the theme"
                    className="flex max-h-[38dvh] shrink-0 flex-col md:max-h-none md:w-72"
                >
                    <nav
                        data-panel="links"
                        aria-label="Fragiola UI"
                        className="flex flex-col gap-1 px-4 pt-4"
                    >
                        <div className="flex items-center gap-2 text-sm">
                            <a
                                href={SITE}
                                target="_top"
                                className="font-semibold text-palette-contrast"
                            >
                                Fragiola UI
                            </a>
                            <span className="text-palette-accent/85">/</span>
                            <span className="font-medium">Create</span>
                        </div>
                        <div className="-ms-2.5 flex items-center gap-0.5">
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
                        </div>
                    </nav>
                    <Separator className="mx-4 my-3 w-auto" />
                    <div
                        data-panel="actions"
                        className="flex items-center gap-1.5 px-4"
                    >
                        <Action
                            label="Randomize (R)"
                            onClick={() => setDesign((d) => randomize(d))}
                        >
                            <DicesIcon />
                        </Action>
                        <Action label="Reset" onClick={reset}>
                            <RotateCcwIcon />
                        </Action>
                    </div>
                    <div
                        data-panel="controls"
                        className="min-h-0 flex-1 overflow-auto px-4 py-4"
                    >
                        <Customizer design={design} set={set} />
                    </div>
                    <div data-panel="code" className="shrink-0 px-4 pt-1 pb-4">
                        <GetCode resolved={resolved} />
                    </div>
                </aside>
                <main className="min-h-0 min-w-0 flex-1 p-2">
                    <div
                        data-inset=""
                        className="palette-surface h-full overflow-hidden rounded-[0.75rem] border border-palette-line bg-palette-base shadow-sm"
                    >
                        <iframe
                            ref={frame}
                            title="Theme preview"
                            src={PREVIEW}
                            className={
                                promoted
                                    ? "fixed inset-0 z-50 block size-full border-0"
                                    : "block size-full border-0"
                            }
                        />
                    </div>
                </main>
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
