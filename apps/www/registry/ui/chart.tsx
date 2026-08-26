"use client";

import type { EChartsOption } from "echarts";
import EChartsReact from "echarts-for-react";
import * as React from "react";
import { useThemeTokens } from "#/hooks/use-theme-tokens";
import { cn } from "#/lib/cn";

// Chart — an ECharts wrapper that resolves the active theme's tokens and
// applies them to the chart's axes, series and tooltip.
//
// The chart tokens are a separate axis from the palette contract
// (architecture.md §5): no role describes "the third series", and reusing
// danger as series 4 breaks its meaning. The categorical derivation
// (chart-1 through chart-8) lives in global.css as theme machinery, derived
// from --palette-base via oklch(from ...).
//
// This wrapper does three things:
// 1. Reads the theme tokens via useThemeTokens (re-reads on theme change)
// 2. Merges them into the option's axis, series and tooltip colours
// 3. Renders ECharts with the merged option
//
// It does NOT re-implement ECharts' API — the consumer passes a full
// EChartsOption, and the wrapper only injects colours. This keeps the
// wrapper thin and avoids locking consumers out of ECharts' features.

export type ChartProps = {
    option: EChartsOption;
    className?: string;
    /** X-axis categories for the convenience shorthand. */
    categories?: string[];
};

export function Chart({ option, className, categories }: ChartProps) {
    const tokens = useThemeTokens();
    const merged = React.useMemo(
        () => mergeTheme(option, tokens, { categories }),
        [option, tokens, categories],
    );

    return (
        <div data-slot="chart" className={cn("w-full", className as string)}>
            <EChartsReact
                option={merged}
                style={{ height: "100%", width: "100%" }}
                opts={{ renderer: "svg" }}
                notMerge
                lazyUpdate
            />
        </div>
    );
}

function mergeTheme(
    option: EChartsOption,
    tokens: ReturnType<typeof useThemeTokens>,
    shorthand: Pick<ChartProps, "categories">,
): EChartsOption {
    const { categorical, ramp, palette } = tokens;
    const { categories } = shorthand;

    // Inject colours into each series
    const series = option.series as
        | Array<Record<string, unknown> & { color?: string }>
        | undefined;
    const coloredSeries = series?.map((s, i) => ({
        ...s,
        color: s.color ?? categorical[i % categorical.length],
    }));

    return {
        ...option,
        xAxis: categories
            ? ({
                  type: "category",
                  data: categories,
                  axisLine: { lineStyle: { color: palette.line } },
                  axisLabel: { color: palette.accent },
              } as EChartsOption["xAxis"])
            : option.xAxis,
        yAxis: {
            type: "value",
            axisLine: { lineStyle: { color: palette.line } },
            axisLabel: { color: palette.accent },
            splitLine: { lineStyle: { color: palette.line } },
            ...(option.yAxis as Record<string, unknown>),
        } as EChartsOption["yAxis"],
        tooltip: {
            backgroundColor: palette.base,
            borderColor: palette.line,
            textStyle: { color: palette.contrast },
            ...(option.tooltip as Record<string, unknown>),
        } as EChartsOption["tooltip"],
        color: ramp.length > 0 ? ramp : categorical,
        series: coloredSeries as EChartsOption["series"],
    };
}
