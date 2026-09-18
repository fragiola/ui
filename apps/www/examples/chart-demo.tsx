"use client";

import type { EChartsOption } from "echarts";
import type { ReactNode } from "react";
import { Chart } from "#/ui/chart";

// The floor is palette-surface. The chart series are derived from
// --palette-base (global.css: chart-1 IS the palette's colour, the rest
// rotate hue from it), and the Chart reads the tokens from ITS OWN
// element — so the palette class goes on the chart, the same way it goes
// on a badge or a button. Three chart types, three palettes: the same
// option re-colours by moving one class.
//
// Each Chart carries a height. ECharts reads the parent's height, and a
// 100%-height child of a zero-height parent is its classic silent failure.
const lineOption: EChartsOption = {
    title: { text: "Monthly visits", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" },
    legend: { bottom: 0 },
    grid: { left: 40, right: 20, top: 44, bottom: 40 },
    series: [
        {
            name: "Direct",
            type: "line",
            smooth: true,
            data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
            name: "Search",
            type: "line",
            smooth: true,
            data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
            name: "Referral",
            type: "line",
            smooth: true,
            data: [220, 182, 191, 234, 290, 330, 310],
        },
    ],
};

const barOption: EChartsOption = {
    title: { text: "Quarterly revenue", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "axis" },
    legend: { bottom: 0 },
    grid: { left: 40, right: 20, top: 44, bottom: 40 },
    series: [
        { name: "2025", type: "bar", data: [120, 200, 150, 80] },
        { name: "2026", type: "bar", data: [160, 230, 190, 140] },
    ],
};

const pieOption: EChartsOption = {
    title: { text: "Traffic sources", textStyle: { fontSize: 14 } },
    tooltip: { trigger: "item" },
    legend: { bottom: 0 },
    series: [
        {
            type: "pie",
            radius: ["40%", "70%"],
            center: ["50%", "48%"],
            itemStyle: { borderRadius: 4, borderWidth: 2 },
            label: { show: false },
            data: [
                { value: 1048, name: "Direct" },
                { value: 735, name: "Search" },
                { value: 580, name: "Referral" },
                { value: 484, name: "Social" },
            ],
        },
    ],
};

const WEEK = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function ChartDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            {/* line — series derived from palette-blue */}
            <Row label="line · palette-blue">
                <Chart
                    className="palette-blue h-72"
                    option={lineOption}
                    categories={WEEK}
                />
            </Row>

            {/* bar — the same wrapper, series derived from palette-green */}
            <Row label="bar · palette-green">
                <Chart
                    className="palette-green h-72"
                    option={barOption}
                    categories={["Q1", "Q2", "Q3", "Q4"]}
                />
            </Row>

            {/* pie (donut) — slices take the categorical slots in order */}
            <Row label="pie (donut) · palette-purple">
                <Chart className="palette-purple h-72" option={pieOption} />
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
