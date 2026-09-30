"use client";

import { useDirection } from "@base-ui/react/direction-provider";
import { PanelLeftIcon } from "lucide-react";
import * as React from "react";
import { Clickable } from "#/atoms/clickable";
import { cn } from "#/lib/cn";
import { Drawer } from "#/ui/drawer";
import { Tooltip } from "#/ui/tooltip";

// Sidebar — the app shell's navigation column. Base UI has no sidebar
// primitive, so this component is a RECOMBINATION: the behaviour comes from
// primitives that already sit behind Fragiola components (Drawer on mobile,
// Tooltip in icon mode, useRender for polymorphic parts), and the appearance
// from families that already exist. shadcn's sidebar rebuilds a menu item, a
// label, an icon button and a sub-list from scratch (28 `.cn-sidebar-*`
// classes, 8 `--sidebar-*` tokens); here each part points at the piece it is.
//
// ─── PALETTE ────────────────────────────────────────────────────────────────
// `palette-raised` by default — shadcn's `--sidebar` is `raised` in both
// themes, so there is no `palette-sidebar`: the number of palettes is free,
// but a palette that duplicates another is not a new one. The class sits on
// the element that also takes `className`, so `className="palette-blue"`
// replaces it (cn merges palettes as one group). The same `className` reaches
// the mobile Drawer popup, which is portalled and would not inherit it.
//
// ─── LAYOUT IS RELATIVE TO THE PROVIDER, NOT TO THE VIEWPORT ────────────────
// The Provider's wrapper is a size container (`@container/sidebar`). Desktop
// or mobile is decided by the WRAPPER's inline size, and the desktop sidebar
// is `sticky` inside the wrapper instead of `fixed` to the viewport. A shell
// behaves the same full-page, in a docs iframe and in a playground stage;
// shadcn's `fixed` + viewport media query leaves the stage and picks the
// wrong mode in a narrow frame.
//
// First paint is decided by CSS alone (`hidden @2xl/sidebar:block`), so there
// is no server/client flash. The ResizeObserver below only decides whether
// the Drawer mounts. The threshold is 42rem, `@2xl`: a docs column (~720px)
// shows the desktop sidebar, a phone in portrait gets the Drawer. The JS
// constant and the container variant are one decision in two languages —
// tests/sidebar.test.ts asserts they agree.
//
// ─── NO PERSISTENCE ─────────────────────────────────────────────────────────
// shadcn writes a `sidebar_state` cookie for Next.js SSR. Fragiola is
// framework-agnostic: `defaultOpen` + controlled `open`/`onOpenChange`, and
// the consumer persists where their stack reads it (the docs show a cookie
// and a localStorage recipe).
//
// ─── SIDE IS LOGICAL ────────────────────────────────────────────────────────
// `side="start" | "end"` (rule 6). The desktop layout flips on its own with
// logical properties. The Drawer's `side` is physical, so the mobile edge is
// resolved against the reading direction Base UI reads (DirectionProvider).

const SIDEBAR_WIDTH = "16rem";
const SIDEBAR_WIDTH_ICON = "3rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
// Below this wrapper width the sidebar is a Drawer. Must equal Tailwind's
// `--container-2xl`, the `@2xl/sidebar:` used in the classes below.
const SIDEBAR_MOBILE_THRESHOLD_REM = 42;

type SidebarContextProps = {
    state: "expanded" | "collapsed";
    open: boolean;
    setOpen: (open: boolean) => void;
    openMobile: boolean;
    setOpenMobile: (open: boolean) => void;
    isMobile: boolean;
    toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error("useSidebar must be used within a Sidebar.Provider.");
    }
    return context;
}

// Whether `element` is narrower than the mobile threshold. Measured on the
// element, not the window: the wrapper is what the container variant reads.
function useIsNarrow(element: HTMLElement | null) {
    const [narrow, setNarrow] = React.useState(false);

    React.useEffect(() => {
        if (!element) return;
        const observer = new ResizeObserver(([entry]) => {
            if (!entry) return;
            const rem = Number.parseFloat(
                getComputedStyle(document.documentElement).fontSize,
            );
            setNarrow(
                entry.contentRect.width < SIDEBAR_MOBILE_THRESHOLD_REM * rem,
            );
        });
        observer.observe(element);
        return () => observer.disconnect();
    }, [element]);

    return narrow;
}

// ─── Provider ───────────────────────────────────────────────────────────────
// The state, the keyboard shortcut and the wrapper: the size container the
// whole layout reads. The wrapper declares `palette-raised` and paints nothing
// — except in the `inset` variant, where it is the raised floor the Inset
// card sits on.

function SidebarProvider({
    defaultOpen = true,
    open: openProp,
    onOpenChange: setOpenProp,
    className,
    style,
    children,
    ref,
    ...props
}: React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [wrapper, setWrapper] = React.useState<HTMLDivElement | null>(null);
    const isMobile = useIsNarrow(wrapper);
    const [openMobile, setOpenMobile] = React.useState(false);

    // Internal state, overridden by `open` / `onOpenChange` when controlled.
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            const openState = typeof value === "function" ? value(open) : value;
            if (setOpenProp) {
                setOpenProp(openState);
            } else {
                _setOpen(openState);
            }
        },
        [setOpenProp, open],
    );

    const toggleSidebar = React.useCallback(() => {
        return isMobile
            ? setOpenMobile((open) => !open)
            : setOpen((open) => !open);
    }, [isMobile, setOpen]);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
                (event.metaKey || event.ctrlKey)
            ) {
                event.preventDefault();
                toggleSidebar();
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? "expanded" : "collapsed";

    const contextValue = React.useMemo<SidebarContextProps>(
        () => ({
            state,
            open,
            setOpen,
            isMobile,
            openMobile,
            setOpenMobile,
            toggleSidebar,
        }),
        [state, open, setOpen, isMobile, openMobile, toggleSidebar],
    );

    const setRefs = React.useCallback(
        (node: HTMLDivElement | null) => {
            setWrapper(node);
            if (typeof ref === "function") return ref(node);
            if (ref) ref.current = node;
        },
        [ref],
    );

    return (
        <SidebarContext.Provider value={contextValue}>
            <Tooltip.Provider>
                <div
                    ref={setRefs}
                    data-slot="sidebar-wrapper"
                    style={
                        {
                            "--sidebar-width": SIDEBAR_WIDTH,
                            "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                            ...style,
                        } as React.CSSProperties
                    }
                    className={cn(
                        "palette-raised group/sidebar-wrapper @container/sidebar flex min-h-svh w-full",
                        "has-[[data-slot=sidebar][data-variant=inset]]:bg-palette-base",
                        className as string,
                    )}
                    {...props}
                >
                    {children}
                </div>
            </Tooltip.Provider>
        </SidebarContext.Provider>
    );
}

// ─── Root ───────────────────────────────────────────────────────────────────
// Three nested elements on desktop, each with one job:
//
//   sidebar    the flex item in the wrapper's row. Sticky, and its WIDTH is
//              what collapses (0 for offcanvas, the icon rail for icon), so
//              the Inset beside it grows as it animates. It is `group/sidebar`
//              and carries the data attributes every part reads.
//   container  clips on the inline axis (`overflow-x-clip`, not hidden: clip
//              makes no scroll container, so `sticky` above keeps working) and
//              holds the floating/inset gutter.
//   inner      the painted panel. In offcanvas mode it keeps its full width
//              and is anchored to the far edge, so it SLIDES out as the box
//              narrows instead of reflowing — shadcn does the same with a
//              `fixed` panel moved by `left`/`right`.
//
// The widths read two custom properties set per variant: `--sidebar-gutter`
// (the p-2 around a floating or inset panel) and `--sidebar-frame` (the
// border the panel's content loses: one edge for `sidebar`, two for
// `floating`), so an icon rail is always exactly `--sidebar-width-icon` of
// content, whatever the variant.

type Side = "start" | "end";
type Variant = "sidebar" | "floating" | "inset";
type Collapsible = "offcanvas" | "icon" | "none";

function SidebarRoot({
    side = "start",
    variant = "sidebar",
    collapsible = "offcanvas",
    className,
    children,
    ...props
}: React.ComponentProps<"div"> & {
    side?: Side;
    variant?: Variant;
    collapsible?: Collapsible;
}) {
    const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
    const direction = useDirection();

    if (collapsible === "none") {
        return (
            <div
                data-slot="sidebar"
                data-variant={variant}
                data-side={side}
                className={cn(
                    "palette-raised flex h-full w-(--sidebar-width) flex-col bg-palette-base text-palette-contrast",
                    className as string,
                )}
                {...props}
            >
                {children}
            </div>
        );
    }

    if (isMobile) {
        // The Drawer's side is physical; `start` is the left edge only in LTR.
        const edge =
            (side === "start") === (direction === "ltr") ? "left" : "right";
        return (
            <Drawer.Root
                open={openMobile}
                onOpenChange={setOpenMobile}
                swipeDirection={edge}
            >
                <Drawer.Portal>
                    <Drawer.Backdrop />
                    <Drawer.Viewport side={edge}>
                        <Drawer.Popup
                            side={edge}
                            data-slot="sidebar"
                            data-mobile="true"
                            className={cn(
                                "palette-raised w-72 text-palette-contrast",
                                className as string,
                            )}
                            {...props}
                        >
                            <Drawer.Content
                                showClose={false}
                                className="h-full"
                            >
                                <Drawer.Title className="sr-only">
                                    Sidebar
                                </Drawer.Title>
                                <Drawer.Description className="sr-only">
                                    Displays the mobile sidebar.
                                </Drawer.Description>
                                {children}
                            </Drawer.Content>
                        </Drawer.Popup>
                    </Drawer.Viewport>
                </Drawer.Portal>
            </Drawer.Root>
        );
    }

    return (
        <div
            data-slot="sidebar"
            data-state={state}
            data-collapsible={state === "collapsed" ? collapsible : ""}
            data-variant={variant}
            data-side={side}
            className={cn(
                "palette-raised group/sidebar text-palette-contrast",
                "hidden @2xl/sidebar:block",
                "sticky top-0 h-svh max-h-full shrink-0 self-start",
                "w-(--sidebar-width) transition-[width] duration-200 ease-linear motion-reduce:transition-none",
                "data-[collapsible=offcanvas]:w-0",
                "data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+2*var(--sidebar-gutter)+var(--sidebar-frame))]",
                variant === "sidebar" &&
                    "[--sidebar-frame:1px] [--sidebar-gutter:0px]",
                variant === "floating" &&
                    "[--sidebar-frame:2px] [--sidebar-gutter:calc(var(--spacing)*2)]",
                variant === "inset" &&
                    "[--sidebar-frame:0px] [--sidebar-gutter:calc(var(--spacing)*2)]",
                className as string,
            )}
            {...props}
        >
            <div
                data-slot="sidebar-container"
                className={cn(
                    "flex size-full overflow-x-clip p-(--sidebar-gutter)",
                    // The inner panel is anchored to the edge away from the
                    // sidebar's side, so it leaves by the side it lives on.
                    side === "start" ? "justify-end" : "justify-start",
                )}
            >
                <div
                    data-slot="sidebar-inner"
                    className={cn(
                        "flex h-full w-full min-w-0 flex-col bg-palette-base",
                        collapsible === "offcanvas" &&
                            "w-[calc(var(--sidebar-width)-2*var(--sidebar-gutter))] shrink-0",
                        variant === "sidebar" && "border-palette-line",
                        variant === "sidebar" && side === "start" && "border-e",
                        variant === "sidebar" && side === "end" && "border-s",
                        variant === "floating" &&
                            "rounded-lg border border-palette-line shadow-sm",
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

// ─── Trigger ────────────────────────────────────────────────────────────────
// The icon button, not a new one: Clickable, icon fill, square form. The
// panel icon mirrors under RTL.

function SidebarTrigger({
    onClick,
    ...props
}: React.ComponentProps<typeof Clickable.Button>) {
    const { toggleSidebar } = useSidebar();

    return (
        <Clickable.Button
            data-slot="sidebar-trigger"
            variant="icon"
            shape="square"
            size="sm"
            onClick={(event) => {
                onClick?.(event);
                toggleSidebar();
            }}
            {...props}
        >
            <PanelLeftIcon className="rtl:-scale-x-100" />
            <span className="sr-only">Toggle Sidebar</span>
        </Clickable.Button>
    );
}

// ─── Rail ───────────────────────────────────────────────────────────────────
// A 16px hit area straddling the sidebar's inner edge, with a hairline on
// hover. Out of the tab order: the Trigger is the keyboard path. When the
// sidebar is off canvas the rail moves fully onto the page, at the edge the
// sidebar comes back from. The cursor is `ew-resize` in every state — a
// per-side, per-state, per-direction matrix of w/e cursors bought nothing.

function SidebarRail({ className, ...props }: React.ComponentProps<"button">) {
    const { toggleSidebar } = useSidebar();

    return (
        <button
            type="button"
            data-slot="sidebar-rail"
            aria-label="Toggle Sidebar"
            tabIndex={-1}
            onClick={toggleSidebar}
            title="Toggle Sidebar"
            className={cn(
                "absolute inset-y-0 z-20 w-4 cursor-ew-resize outline-none",
                "after:absolute after:inset-y-0 after:inset-x-[7px] after:transition-colors hover:after:bg-palette-line",
                "group-data-[side=start]/sidebar:-end-2 group-data-[side=end]/sidebar:-start-2",
                "group-data-[collapsible=offcanvas]/sidebar:group-data-[side=start]/sidebar:-end-4",
                "group-data-[collapsible=offcanvas]/sidebar:group-data-[side=end]/sidebar:-start-4",
                className as string,
            )}
            {...props}
        />
    );
}

// ─── Inset ──────────────────────────────────────────────────────────────────
// The page beside the sidebar. It declares `palette-surface` — it is the
// app's floor, not the sidebar's — and in the `inset` variant becomes the card
// on the raised floor the wrapper paints. It reads the Root through the
// wrapper (`group-has-[…]/sidebar-wrapper`), not through `peer`, so a sidebar
// on the end side can come after it or before it in the markup.

function SidebarInset({ className, ...props }: React.ComponentProps<"main">) {
    return (
        <main
            data-slot="sidebar-inset"
            className={cn(
                "palette-surface relative flex w-full min-w-0 flex-1 flex-col bg-palette-base",
                "@2xl/sidebar:group-has-[[data-slot=sidebar][data-variant=inset]]/sidebar-wrapper:m-2",
                "@2xl/sidebar:group-has-[[data-slot=sidebar][data-variant=inset]]/sidebar-wrapper:rounded-lg",
                "@2xl/sidebar:group-has-[[data-slot=sidebar][data-variant=inset]]/sidebar-wrapper:shadow-sm",
                "@2xl/sidebar:group-has-[[data-slot=sidebar][data-variant=inset][data-side=start][data-state=expanded]]/sidebar-wrapper:ms-0",
                "@2xl/sidebar:group-has-[[data-slot=sidebar][data-variant=inset][data-side=end][data-state=expanded]]/sidebar-wrapper:me-0",
                className as string,
            )}
            {...props}
        />
    );
}

export const Sidebar = {
    Provider: SidebarProvider,
    Root: SidebarRoot,
    Trigger: SidebarTrigger,
    Rail: SidebarRail,
    Inset: SidebarInset,
};

export { useSidebar };
