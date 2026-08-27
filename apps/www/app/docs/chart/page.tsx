import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function ChartPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Chart
                </h1>
                <p className="text-sm text-palette-accent/85">
                    An ECharts wrapper that resolves the active theme&apos;s
                    tokens and applies them to axes, series and tooltip. The
                    chart tokens are a separate axis from the palette contract —
                    no role describes &quot;the third series&quot;.
                </p>
            </div>

            <InstallCommand name="chart" />

            <ComponentPreview name="chart-demo" />

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Series axis
                </h2>
                <p className="text-sm text-palette-accent/85">
                    Chart series colours are their own axis:{" "}
                    <code>--chart-1</code> through <code>--chart-8</code>{" "}
                    (categorical) and <code>--chart-ramp-1</code> through{" "}
                    <code>--chart-ramp-5</code> (ordinal). They are derived from{" "}
                    <code>--palette-base</code> via <code>oklch(from ...)</code>{" "}
                    in <code>global.css</code> — theme machinery, not a palette.
                </p>
                <p className="text-sm text-palette-accent/85">
                    No palette role describes &quot;the third series&quot;, and
                    reusing <code>danger</code> as series 4 breaks its meaning.
                    The categorical derivation rotates hue while keeping
                    lightness and chroma constant — the series are
                    distinguishable without being a rainbow.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Theme resolution
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The <code>useThemeTokens</code> hook reads the chart and
                    palette tokens from the document and re-reads on theme
                    change via a <code>MutationObserver</code> on{" "}
                    <code>documentElement</code>&apos;s <code>data-theme</code>{" "}
                    attribute. Switch the palette in the preview above to see
                    the chart re-colour live.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Thin wrapper
                </h2>
                <p className="text-sm text-palette-accent/85">
                    The wrapper does not re-implement ECharts&apos; API. The
                    consumer passes a full <code>EChartsOption</code>, and the
                    wrapper only injects colours. This keeps it thin and avoids
                    locking consumers out of ECharts&apos; features.
                </p>
            </section>
        </div>
    );
}
