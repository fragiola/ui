"use client";

import type { EChartsOption } from "echarts";
import type { ReactNode } from "react";
import { Chart } from "#/ui/chart";

// The floor is palette-surface. The chart series derive from --palette-base,
// so the same option renders with the theme's colour ramp. Shows line, bar,
// and pie (donut) — the three chart types the Chart wrapper handles.
//
// Each Chart carries h-full so ECharts can read the parent's height — the
// wrapper div has w-full only, and a 100%-height child of a zero-height
// parent is the classic ECharts silent failure.
const lineOption: EChartsOption = {
    title: {
        text: "Monthly visits",
        textStyle: { fontSize: 14, fontWeight: 600 },
    },
    tooltip: { trigger: "axis" },
    legend: { bottom: 0 },
    grid: { left: 40, right: 20, top: 50, bottom: 40 },
    series: [
        {
            name: "Direct",
            type: "line",
            data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
            name: "Search",
            type: "line",
            data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
            name: "Referral",
            type: "line",
            data: [220, 182, 191, 234, 290, 330, 310],
        },
    ],
};

const barOption: EChartsOption = {
    title: {
        text: "Quarterly revenue",
        textStyle: { fontSize: 14, fontWeight: 600 },
    },
    tooltip: { trigger: "axis" },
    grid: { left: 40, right: 20, top: 50, bottom: 30 },
    series: [{ type: "bar", data: [120, 200, 150, 80] }],
};

const pieOption: EChartsOption = {
    title: {
        text: "Traffic sources",
        textStyle: { fontSize: 14, fontWeight: 600 },
    },
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [
        {
            type: "pie",
            radius: ["40%", "70%"],
            data: [
                { value: 1048, name: "Direct" },
                { value: 735, name: "Search" },
                { value: 580, name: "Referral" },
                { value: 484, name: "Social" },
            ],
        },
    ],
};

export default function ChartDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="line">
                <div className="h-72">
                    <Chart
                        className="h-full"
                        option={lineOption}
                        categories={[
                            "Mon",
                            "Tue",
                            "Wed",
                            "Thu",
                            "Fri",
                            "Sat",
                            "Sun",
                        ]}
                    />
                </div>
            </Row>

            <Row label="bar">
                <div className="h-72">
                    <Chart
                        className="h-full"
                        option={barOption}
                        categories={["Q1", "Q2", "Q3", "Q4"]}
                    />
                </div>
            </Row>

            <Row label="pie (donut)">
                <div className="h-72">
                    <Chart className="h-full" option={pieOption} />
                </div>
            </Row>
        </div>
    );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-palette-accent/85">
                {label}
            </span>
            {children}
        </div>
    );
}
