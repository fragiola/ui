import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Progress } from "#/components/ui/progress";
import { Tabs } from "#/components/ui/tabs";
import { Card, Line, PreviewChart, Stat, useTone } from "../card";

// Charts: the registry's chart wrapper (ECharts), its series derived from
// the palette each card carries — so a new colour recolours every chart.

const MONTHS = ["Dec", "Jan", "Feb", "Mar", "Apr", "May"];
const YEAR = ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];
const HOURS = ["6a", "8a", "10a", "12p", "2p", "4p", "6p"];

export function ContributionHistory() {
    const { action } = useTone();
    return (
        <Card
            title="Contribution history"
            description="Last 6 months of activity"
            footer={
                <Clickable.Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                >
                    View full report
                </Clickable.Button>
            }
        >
            <PreviewChart
                className={`${action} h-40`}
                categories={MONTHS}
                option={{
                    grid: { left: 0, right: 0, top: 8, bottom: 20 },
                    yAxis: { show: false },
                    series: [
                        {
                            type: "bar",
                            barWidth: "60%",
                            itemStyle: { borderRadius: 4 },
                            data: [42, 61, 55, 78, 49, 86],
                        },
                    ],
                }}
            />
            <div className="grid grid-cols-2 gap-3">
                <Tile label="Upcoming" value="May 25" hint="$1,000 scheduled" />
                <Tile label="Auto-save" value="Accelerated" hint="Weekly" />
            </div>
        </Card>
    );
}

function Tile({
    label,
    value,
    hint,
}: {
    label: string;
    value: string;
    hint: string;
}) {
    return (
        <div className="flex flex-col gap-0.5 rounded-md bg-palette-soft p-3">
            <span className="text-[10px] font-medium uppercase tracking-wide text-palette-accent/85">
                {label}
            </span>
            <span className="text-sm font-semibold">{value}</span>
            <span className="text-xs text-palette-accent/85">{hint}</span>
        </div>
    );
}

export function PowerUsage() {
    const { action } = useTone();
    return (
        <Card title="Power usage" description="Whole home">
            <PreviewChart
                className={`${action} h-36`}
                categories={HOURS}
                option={{
                    grid: { left: 0, right: 0, top: 8, bottom: 20 },
                    yAxis: { show: false },
                    series: [
                        {
                            type: "bar",
                            itemStyle: { borderRadius: 3 },
                            data: [1.2, 2.8, 3.1, 2.4, 3.6, 3.2, 3.9],
                        },
                    ],
                }}
            />
            <div className="grid grid-cols-2 gap-3">
                <Stat label="Currently using" value="3.4 kW" />
                <Stat label="Solar gen" value="+1.2 kW" />
            </div>
            <div className="flex flex-col gap-2">
                <span className="text-xs text-palette-accent/85">
                    Battery level
                </span>
                <Progress.Root
                    value={78}
                    aria-label="Battery level"
                    className={action}
                >
                    <Progress.Track>
                        <Progress.Indicator />
                    </Progress.Track>
                </Progress.Root>
            </div>
        </Card>
    );
}

export function YearlyActivity() {
    const { action } = useTone();
    return (
        <Card
            title="Yearly activity"
            action={
                <Badge variant="soft" className={action}>
                    +$0.25 daily cash
                </Badge>
            }
        >
            <PreviewChart
                className={`${action} h-28`}
                categories={YEAR}
                option={{
                    grid: { left: 0, right: 0, top: 4, bottom: 20 },
                    yAxis: { show: false },
                    series: [
                        {
                            type: "bar",
                            itemStyle: { borderRadius: 2 },
                            data: [3, 5, 2, 6, 4, 5, 7, 4, 6, 8, 5, 9],
                        },
                    ],
                }}
            />
        </Card>
    );
}

export function RevenueTrend() {
    const { action } = useTone();
    return (
        <Card
            title="Revenue"
            description="Net revenue, last 12 months"
            action={<Badge variant="outline">+18.2%</Badge>}
        >
            <Stat
                label="This month"
                value="$48,290"
                hint="vs $40,860 last month"
            />
            <PreviewChart
                className={`${action} h-44`}
                categories={YEAR}
                option={{
                    grid: { left: 0, right: 0, top: 8, bottom: 20 },
                    yAxis: { show: false },
                    series: [
                        {
                            type: "line",
                            smooth: true,
                            showSymbol: false,
                            areaStyle: { opacity: 0.15 },
                            data: [
                                22, 24, 23, 29, 31, 30, 34, 37, 36, 41, 40, 48,
                            ],
                        },
                    ],
                }}
            />
        </Card>
    );
}

export function TrafficSources() {
    const { action } = useTone();
    return (
        <Card
            title="Traffic sources"
            description="Sessions by channel, this week"
        >
            <PreviewChart
                className={`${action} h-52`}
                option={{
                    legend: { bottom: 0 },
                    series: [
                        {
                            type: "pie",
                            radius: ["48%", "72%"],
                            center: ["50%", "44%"],
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
                }}
            />
        </Card>
    );
}

export function SavingsGoal() {
    const { action } = useTone();
    return (
        <Card
            title="Emergency fund"
            description="80% of $30,000"
            footer={<Line label="Projected finish" value="October 2026" />}
        >
            <PreviewChart
                className={`${action} h-48`}
                option={{
                    title: {
                        text: "$24,000",
                        left: "center",
                        top: "40%",
                        textStyle: { fontSize: 20, fontWeight: 600 },
                    },
                    series: [
                        {
                            type: "pie",
                            radius: ["66%", "82%"],
                            silent: true,
                            label: { show: false },
                            data: [
                                { value: 80, name: "Saved" },
                                { value: 20, name: "Left" },
                            ],
                        },
                    ],
                }}
            />
        </Card>
    );
}

export function StackedSignups() {
    const { action } = useTone();
    return (
        <Card title="Sign-ups by plan" description="Last 6 months">
            <Tabs.Root defaultValue="month">
                <Tabs.List>
                    <Tabs.Tab value="month">Monthly</Tabs.Tab>
                    <Tabs.Tab value="week">Weekly</Tabs.Tab>
                    <Tabs.Indicator />
                </Tabs.List>
            </Tabs.Root>
            <PreviewChart
                className={`${action} h-48`}
                categories={MONTHS}
                option={{
                    legend: { bottom: 0 },
                    grid: { left: 0, right: 0, top: 8, bottom: 44 },
                    yAxis: { show: false },
                    series: [
                        {
                            name: "Free",
                            type: "bar",
                            stack: "s",
                            data: [120, 132, 101, 134, 90, 230],
                        },
                        {
                            name: "Pro",
                            type: "bar",
                            stack: "s",
                            data: [60, 72, 71, 74, 90, 130],
                        },
                        {
                            name: "Team",
                            type: "bar",
                            stack: "s",
                            data: [15, 22, 31, 34, 40, 52],
                        },
                    ],
                }}
            />
        </Card>
    );
}

export function DividendIncome() {
    const { action } = useTone();
    const holdings = [
        ["Vanguard VIG", "450 shares", "$1,842.10", [4, 5, 4, 7]],
        ["S&P 500 VOO", "112 shares", "$928.40", [3, 4, 6, 5]],
        ["Apple AAPL", "85 shares", "$340.00", [2, 3, 5, 4]],
        ["Realty Income", "320 shares", "$1,139.50", [5, 5, 6, 7]],
    ] as const;
    return (
        <Card
            title="Q2 dividend income"
            description="Quarterly payouts across holdings"
        >
            {holdings.map(([name, shares, amount, data]) => (
                <div
                    key={name}
                    className="flex items-center gap-3 rounded-md bg-palette-soft px-3 py-2"
                >
                    <div className="flex min-w-0 flex-1 flex-col">
                        <span className="truncate text-sm font-medium">
                            {name}
                        </span>
                        <span className="text-xs text-palette-accent/85">
                            {shares}
                        </span>
                    </div>
                    <PreviewChart
                        className={`${action} h-8 w-16`}
                        option={{
                            grid: { left: 0, right: 0, top: 0, bottom: 0 },
                            xAxis: { show: false, type: "category" },
                            yAxis: { show: false },
                            series: [{ type: "bar", data: [...data] }],
                        }}
                    />
                    <span className="w-20 text-end text-sm font-semibold tabular-nums">
                        {amount}
                    </span>
                </div>
            ))}
        </Card>
    );
}
