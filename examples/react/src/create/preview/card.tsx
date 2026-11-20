import { createContext, type ReactNode, useContext } from "react";
import { Text } from "#/components/atoms/text";
import { foundation } from "#/components/families/foundation";
import { Chart, type ChartProps } from "#/components/ui/chart";

// The preview's card: a panel on the floor (the foundation's `panel`), on
// `palette-surface` in both schemes — the plain floor colour, which stands
// apart from the canvas under it (`palette-canvas`, preview/canvas.tsx), so
// its shadow (the elevation axis) can be seen. With
// a header, a body and an optional footer separated by `line` rules — the
// container every sample is drawn in. Built from the registry, not a
// component of it: the registry has no Card, an app composes one.

export function Card({
    title,
    description,
    action,
    footer,
    children,
    className,
}: {
    title?: ReactNode;
    description?: ReactNode;
    action?: ReactNode;
    footer?: ReactNode;
    children?: ReactNode;
    className?: string;
}) {
    return (
        <section
            className={`palette-surface ${foundation.panel()} flex flex-col overflow-hidden shadow-sm ${className ?? ""}`}
        >
            {(title || action) && (
                <header className="flex items-start justify-between gap-3 px-5 pt-5">
                    <div className="flex min-w-0 flex-col gap-1">
                        {title && (
                            <Text.Heading as="h3" className="text-sm">
                                {title}
                            </Text.Heading>
                        )}
                        {description && (
                            <p className="text-xs text-palette-accent/85">
                                {description}
                            </p>
                        )}
                    </div>
                    {action}
                </header>
            )}
            {children && (
                <div className="flex flex-col gap-4 px-5 py-4">{children}</div>
            )}
            {footer && (
                <footer className="flex items-center gap-2 border-t border-palette-line px-5 py-3">
                    {footer}
                </footer>
            )}
        </section>
    );
}

/** A label above a value, the way a dashboard prints a figure. */
export function Stat({
    label,
    value,
    hint,
}: {
    label: ReactNode;
    value: ReactNode;
    hint?: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-0.5">
            <span className="text-xs text-palette-accent/85">{label}</span>
            <span className="text-2xl font-semibold tabular-nums text-palette-contrast">
                {value}
            </span>
            {hint && (
                <span className="text-xs text-palette-accent/85">{hint}</span>
            )}
        </div>
    );
}

/** A label and a value on one line, for summaries. */
export function Line({ label, value }: { label: ReactNode; value: ReactNode }) {
    return (
        <div className="flex items-center justify-between gap-3 text-sm">
            <span className="text-palette-accent/85">{label}</span>
            <span className="font-medium tabular-nums text-palette-contrast">
                {value}
            </span>
        </div>
    );
}

// The chart wrapper reads the palette's colours when it mounts and when
// `data-theme` changes. A generated palette changes its CSS, not that
// attribute, so the preview gives every chart the design's version as a
// key: a new design remounts the charts, which read the new colours.
export const DesignVersion = createContext("");

export function PreviewChart(props: ChartProps) {
    const version = useContext(DesignVersion);
    return <Chart key={version} {...props} />;
}

// The design's two classes, for every card: `action` on solid things (a
// primary button, a badge, a progress bar), `control` on a control on the
// floor (its ring and "on" state). One design change recolours them all.
export const Tone = createContext({
    action: "palette-neutral",
    control: "palette-surface",
});

export const useTone = () => useContext(Tone);
