"use client";

import {
    CheckIcon,
    ChevronDownIcon,
    CopyIcon,
    MoreHorizontalIcon,
    RotateCcwIcon,
} from "lucide-react";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Text } from "#/components/atoms/text";
import {
    type Chroma,
    generatePalette,
    serializePalette,
    type Tint,
} from "#/components/lib/colour/palette";
import { Accordion } from "#/components/ui/accordion";
import { Checkbox } from "#/components/ui/checkbox";
import { Dialog } from "#/components/ui/dialog";
import { DropdownMenu } from "#/components/ui/dropdown-menu";
import { Field } from "#/components/ui/field";
import { Progress } from "#/components/ui/progress";
import { Radio, RadioGroup } from "#/components/ui/radio";
import { Select } from "#/components/ui/select";
import { Slider } from "#/components/ui/slider";
import { Switch } from "#/components/ui/switch";
import { Table } from "#/components/ui/table";
import { Tabs } from "#/components/ui/tabs";

// Theme Builder — see a design before building it. Pick a colour and the
// level of each design axis; the sample below is the registry's own
// components, re-coloured and re-measured live. Then copy what reproduces it.
//
// Nothing here styles a component. The colour is a generated palette pair
// (`generatePalette`, the registry's `colour` helper) applied by class: the
// CSS it writes is injected as is, so the preview IS the output. The axes
// are `data-*` attributes on <html> (architecture.md §4): on <html>, not on
// the sample, because menus and dialogs portal to <body> and must follow.

// ─── The axes and their levels (architecture.md §4) ─────────────────────────
const AXES = {
    density: ["compact", "snug", "default", "comfortable", "spacious"],
    radius: ["flat", "subtle", "default", "rounded", "full"],
    text: ["small", "default", "large"],
    elevation: ["flat", "subtle", "default", "raised"],
    motion: ["none", "fast", "default", "expressive"],
} as const;
type Axis = keyof typeof AXES;
type Axes = { [A in Axis]: (typeof AXES)[A][number] };
const AXIS_LABELS: Record<Axis, string> = {
    density: "Spacing",
    radius: "Radius",
    text: "Typography",
    elevation: "Elevation",
    motion: "Motion",
};
const DEFAULT_AXES: Axes = {
    density: "default",
    radius: "default",
    text: "default",
    elevation: "default",
    motion: "default",
};

// ─── Colour: the shipped hues, or any other ─────────────────────────────────
const PRESETS = [
    { name: "neutral", hue: null },
    { name: "blue", hue: 250 },
    { name: "purple", hue: 300 },
    { name: "green", hue: 150 },
    { name: "orange", hue: 55 },
    { name: "rose", hue: 345 },
] as const;
const CHROMAS: Chroma[] = ["muted", "default", "vivid"];
const TINTS: Tint[] = ["none", "subtle", "tinted"];

type Design = {
    hue: number | null; // null: the neutral palette, nothing generated
    chroma: Chroma;
    tint: Tint;
    axes: Axes;
    scheme: "light" | "dark";
    dir: "ltr" | "rtl";
};

const INITIAL: Design = {
    hue: 250,
    chroma: "default",
    tint: "subtle",
    axes: DEFAULT_AXES,
    scheme: "light",
    dir: "ltr",
};

const NAME = "brand";

export default function ThemeBuilder() {
    const [design, setDesign] = useState<Design>(() => ({
        ...INITIAL,
        scheme:
            document.documentElement.dataset.theme === "dark"
                ? "dark"
                : "light",
    }));
    const set = (patch: Partial<Design>) =>
        setDesign((d) => ({ ...d, ...patch }));

    const palette = useMemo(
        () =>
            design.hue === null
                ? null
                : generatePalette({
                      name: NAME,
                      hue: design.hue,
                      chroma: design.chroma,
                      tint: design.tint,
                  }),
        [design.hue, design.chroma, design.tint],
    );
    const css = palette ? serializePalette(palette) : "";
    const action = palette ? `palette-${NAME}` : "palette-neutral";
    const control = palette ? `palette-surface-${NAME}` : "palette-surface";

    useDocumentDesign(design, css);

    return (
        <div className="palette-surface @container flex h-full flex-col bg-palette-base text-palette-contrast">
            <div className="flex min-h-0 flex-1 flex-col overflow-auto @3xl:flex-row @3xl:overflow-hidden">
                <aside className="flex shrink-0 flex-col gap-5 border-b border-palette-line p-4 @3xl:w-72 @3xl:overflow-auto @3xl:border-e @3xl:border-b-0">
                    <Customizer design={design} set={set} />
                </aside>
                <main
                    className={`${control} min-w-0 flex-1 p-4 @3xl:overflow-auto @3xl:p-6`}
                >
                    <div className="flex flex-col gap-8">
                        <Sample action={action} />
                        <Output
                            css={css}
                            axes={design.axes}
                            action={action}
                            control={control}
                            checks={palette?.checks ?? []}
                        />
                    </div>
                </main>
            </div>
        </div>
    );
}

// The axes, the scheme and the direction on <html>, and the generated CSS in
// a <style> — restored when the builder goes away.
function useDocumentDesign(design: Design, css: string) {
    useEffect(() => {
        const root = document.documentElement;
        for (const axis of Object.keys(AXES) as Axis[]) {
            const level = design.axes[axis];
            if (level === "default") delete root.dataset[axis];
            else root.dataset[axis] = level;
        }
        root.dataset.theme = design.scheme;
        root.classList.toggle("dark", design.scheme === "dark");
        root.style.colorScheme = design.scheme;
        root.dir = design.dir;
    }, [design]);

    useEffect(() => {
        const style = document.createElement("style");
        style.dataset.themeBuilder = "";
        style.textContent = css;
        document.head.append(style);
        return () => style.remove();
    }, [css]);

    useEffect(() => {
        const root = document.documentElement;
        return () => {
            for (const axis of Object.keys(AXES)) delete root.dataset[axis];
            root.dir = "ltr";
        };
    }, []);
}

// ─── The customizer ─────────────────────────────────────────────────────────

function Customizer({
    design,
    set,
}: {
    design: Design;
    set: (patch: Partial<Design>) => void;
}) {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
                <Text.Heading as="h2" className="text-base">
                    Theme
                </Text.Heading>
                <Clickable.Button
                    variant="ghost"
                    size="sm"
                    onClick={() => set({ ...INITIAL, scheme: design.scheme })}
                >
                    <RotateCcwIcon />
                    Reset
                </Clickable.Button>
            </div>

            <Group label="Colour">
                <div className="col-span-full flex flex-wrap gap-1.5">
                    {PRESETS.map((preset) => (
                        <Option
                            key={preset.name}
                            selected={design.hue === preset.hue}
                            onSelect={() => set({ hue: preset.hue })}
                        >
                            <span
                                aria-hidden
                                className={`size-3 rounded-full bg-palette-base ${
                                    preset.hue === null
                                        ? "palette-neutral"
                                        : `palette-${preset.name}`
                                }`}
                            />
                            {preset.name}
                        </Option>
                    ))}
                </div>
                <Slider.Root
                    aria-label="Hue"
                    min={0}
                    max={359}
                    value={design.hue ?? 250}
                    onValueChange={(value) =>
                        set({ hue: Array.isArray(value) ? value[0] : value })
                    }
                    className="palette-surface col-span-full"
                >
                    <div className="flex justify-between text-xs text-palette-accent/85">
                        <span>Hue</span>
                        <span>{design.hue ?? "—"}</span>
                    </div>
                    <Slider.Control className="h-6">
                        <Slider.Track className="bg-[linear-gradient(to_right,oklch(0.65_0.15_0),oklch(0.65_0.15_60),oklch(0.65_0.15_120),oklch(0.65_0.15_180),oklch(0.65_0.15_240),oklch(0.65_0.15_300),oklch(0.65_0.15_360))] rtl:bg-[linear-gradient(to_left,oklch(0.65_0.15_0),oklch(0.65_0.15_60),oklch(0.65_0.15_120),oklch(0.65_0.15_180),oklch(0.65_0.15_240),oklch(0.65_0.15_300),oklch(0.65_0.15_360))]">
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
                <Choices
                    label="Chroma"
                    values={CHROMAS}
                    value={design.chroma}
                    disabled={design.hue === null}
                    onChange={(chroma) => set({ chroma })}
                />
                <Choices
                    label="Neutral tint"
                    values={TINTS}
                    value={design.tint}
                    disabled={design.hue === null}
                    onChange={(tint) => set({ tint })}
                />
            </Group>

            <Group label="Design axes">
                {(Object.keys(AXES) as Axis[]).map((axis) => (
                    <Choices
                        key={axis}
                        label={AXIS_LABELS[axis]}
                        values={AXES[axis]}
                        value={design.axes[axis]}
                        onChange={(level) =>
                            set({ axes: { ...design.axes, [axis]: level } })
                        }
                    />
                ))}
            </Group>

            <Group label="Preview">
                <Choices
                    label="Scheme"
                    values={["light", "dark"] as const}
                    value={design.scheme}
                    onChange={(scheme) => set({ scheme })}
                />
                <Choices
                    label="Direction"
                    values={["ltr", "rtl"] as const}
                    value={design.dir}
                    onChange={(dir) => set({ dir })}
                />
            </Group>
        </div>
    );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
    return (
        <fieldset className="grid grid-cols-2 gap-3 @xl:grid-cols-3 @3xl:grid-cols-2">
            <legend className="mb-3 font-mono text-xs text-palette-accent/85">
                {label.toLowerCase()}
            </legend>
            {children}
        </fieldset>
    );
}

// One option of the design: a select, so the whole panel stays short enough
// to sit above the sample in a narrow frame.
function Choices<T extends string>({
    label,
    values,
    value,
    disabled,
    onChange,
}: {
    label: string;
    values: readonly T[];
    value: T;
    disabled?: boolean;
    onChange: (value: T) => void;
}) {
    return (
        <Field.Root disabled={disabled} className="min-w-0">
            <Field.Label className="text-xs">{label}</Field.Label>
            <Select.Root
                value={value}
                disabled={disabled}
                onValueChange={(next) => onChange(next as T)}
            >
                <Select.Trigger className="h-8 py-1 text-xs">
                    <Select.Value />
                </Select.Trigger>
                <Select.Content>
                    {values.map((v) => (
                        <Select.Item key={v} value={v}>
                            {v}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        </Field.Root>
    );
}

function Option({
    selected,
    disabled,
    onSelect,
    children,
}: {
    selected: boolean;
    disabled?: boolean;
    onSelect: () => void;
    children: ReactNode;
}) {
    return (
        <Clickable.Button
            role="radio"
            aria-checked={selected}
            variant={selected ? "outline" : "ghost"}
            size="sm"
            disabled={disabled}
            onClick={onSelect}
            className="h-7 px-2.5 text-xs"
        >
            {children}
        </Clickable.Button>
    );
}

// ─── What to copy ───────────────────────────────────────────────────────────

function Output({
    css,
    axes,
    action,
    control,
    checks,
}: {
    css: string;
    axes: Axes;
    action: string;
    control: string;
    checks: ReturnType<typeof generatePalette>["checks"];
}) {
    const attributes = (Object.keys(AXES) as Axis[])
        .filter((axis) => axes[axis] !== "default")
        .map((axis) => `data-${axis}="${axes[axis]}"`)
        .join(" ");
    const html = `<html data-theme="light"${attributes ? ` ${attributes}` : ""}>`;
    const usage = `<body className="palette-surface">
<Clickable.Button className="${action}">
<Field.Root className="${control}">`;
    const failing = checks.filter((c) => !c.pass);

    return (
        <Group label="Copy">
            <Tabs.Root defaultValue="css" className="col-span-full">
                <Tabs.List>
                    <Tabs.Tab value="css">CSS</Tabs.Tab>
                    <Tabs.Tab value="html">HTML</Tabs.Tab>
                    <Tabs.Tab value="usage">Usage</Tabs.Tab>
                    <Tabs.Indicator />
                </Tabs.List>
                <Tabs.Panel value="css">
                    {css ? (
                        <Code text={css} />
                    ) : (
                        <Text.Paragraph className="text-xs text-palette-accent/85">
                            The neutral palette ships with the registry: nothing
                            to add.
                        </Text.Paragraph>
                    )}
                </Tabs.Panel>
                <Tabs.Panel value="html">
                    <Code text={html} />
                </Tabs.Panel>
                <Tabs.Panel value="usage">
                    <Code text={usage} />
                </Tabs.Panel>
            </Tabs.Root>
            {checks.length > 0 && (
                <p className="col-span-full text-xs text-palette-accent/85">
                    {failing.length === 0 ? (
                        <>
                            <CheckIcon className="me-1 inline size-icon-xs" />
                            Every pair clears WCAG AA ({checks.length} checks).
                        </>
                    ) : (
                        `${failing.length} of ${checks.length} pairs miss AA.`
                    )}
                </p>
            )}
        </Group>
    );
}

function Code({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <div className="relative">
            <pre className="max-h-64 overflow-auto rounded-md bg-palette-soft p-3 pe-10 font-mono text-[11px] leading-relaxed text-palette-accent">
                <code>{text}</code>
            </pre>
            <Clickable.Button
                variant="icon"
                shape="square"
                size="sm"
                aria-label={copied ? "Copied" : "Copy"}
                className="absolute end-1 top-1"
                onClick={async () => {
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 1500);
                }}
            >
                {copied ? <CheckIcon /> : <CopyIcon />}
            </Clickable.Button>
        </div>
    );
}

// ─── The sample: the registry's components, as an app would use them ────────

const INVOICES = [
    {
        id: "INV-1042",
        client: "Northwind",
        amount: "$1,280.00",
        status: "Paid",
    },
    { id: "INV-1043", client: "Contoso", amount: "$640.00", status: "Due" },
    {
        id: "INV-1044",
        client: "Fabrikam",
        amount: "$2,150.00",
        status: "Draft",
    },
];

function Sample({ action }: { action: string }) {
    return (
        <div className="grid gap-4 @5xl:grid-cols-2">
            <Card>
                <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-col gap-1">
                        <Text.Heading as="h3" className="text-base">
                            Create an account
                        </Text.Heading>
                        <Text.Paragraph className="text-palette-accent/85">
                            Start your 14-day trial. No card needed.
                        </Text.Paragraph>
                    </div>
                    <Badge variant="solid" className={action}>
                        New
                    </Badge>
                </div>
                <Field.Root>
                    <Field.Label>Email</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input type="email" placeholder="ada@example.com" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
                <Field.Root>
                    <Field.Label>Role</Field.Label>
                    <Select.Root defaultValue="Engineering">
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                            {["Engineering", "Design", "Product"].map(
                                (role) => (
                                    <Select.Item key={role} value={role}>
                                        {role}
                                    </Select.Item>
                                ),
                            )}
                        </Select.Content>
                    </Select.Root>
                </Field.Root>
                <Field.ChoiceRoot>
                    <Checkbox.Root id="builder-terms" defaultChecked>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor="builder-terms">
                        I agree to the terms
                    </Field.Label>
                </Field.ChoiceRoot>
                <div className="flex justify-end gap-2">
                    <Clickable.Button variant="outline">
                        Cancel
                    </Clickable.Button>
                    <Clickable.Button className={action}>
                        Create account
                    </Clickable.Button>
                </div>
            </Card>

            <Card>
                <div className="flex items-center justify-between gap-3">
                    <Text.Heading as="h3" className="text-base">
                        Usage
                    </Text.Heading>
                    <Toolbar action={action} />
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex justify-between text-xs text-palette-accent/85">
                        <span id="builder-storage">Storage</span>
                        <span>62 of 100 GB</span>
                    </div>
                    <Progress.Root
                        value={62}
                        aria-labelledby="builder-storage"
                        className={action}
                    >
                        <Progress.Track>
                            <Progress.Indicator />
                        </Progress.Track>
                    </Progress.Root>
                </div>
                <Slider.Root defaultValue={40} aria-label="Alert threshold">
                    <div className="flex justify-between text-xs text-palette-accent/85">
                        <span>Alert threshold</span>
                        <span>40%</span>
                    </div>
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Indicator />
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
                <Field.ChoiceRoot>
                    <Switch.Root id="builder-alerts" defaultChecked>
                        <Switch.Thumb />
                    </Switch.Root>
                    <Field.Label htmlFor="builder-alerts">
                        Email me when I pass it
                    </Field.Label>
                </Field.ChoiceRoot>
                <RadioGroup defaultValue="weekly" className="flex-row gap-4">
                    {["daily", "weekly", "monthly"].map((v) => (
                        <Field.ChoiceRoot key={v} className="w-auto">
                            <Radio.Root value={v} id={`builder-${v}`}>
                                <Radio.Indicator />
                            </Radio.Root>
                            <Field.Label htmlFor={`builder-${v}`}>
                                {v[0]?.toUpperCase()}
                                {v.slice(1)}
                            </Field.Label>
                        </Field.ChoiceRoot>
                    ))}
                </RadioGroup>
            </Card>

            <Card className="@5xl:col-span-2">
                <Tabs.Root defaultValue="invoices">
                    <Tabs.List>
                        <Tabs.Tab value="invoices">Invoices</Tabs.Tab>
                        <Tabs.Tab value="payouts">Payouts</Tabs.Tab>
                        <Tabs.Tab value="disputes">Disputes</Tabs.Tab>
                        <Tabs.Indicator />
                    </Tabs.List>
                    <Tabs.Panel value="invoices">
                        <Table.Root>
                            <Table.Header>
                                <Table.Row>
                                    <Table.Head>Invoice</Table.Head>
                                    <Table.Head>Client</Table.Head>
                                    <Table.Head>Status</Table.Head>
                                    <Table.Head className="text-end">
                                        Amount
                                    </Table.Head>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {INVOICES.map((invoice, i) => (
                                    <Table.Row
                                        key={invoice.id}
                                        data-state={
                                            i === 1 ? "selected" : undefined
                                        }
                                    >
                                        <Table.Cell className="font-medium text-palette-contrast">
                                            {invoice.id}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {invoice.client}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Badge
                                                variant={
                                                    invoice.status === "Paid"
                                                        ? "soft"
                                                        : "outline"
                                                }
                                                className={
                                                    invoice.status === "Paid"
                                                        ? action
                                                        : undefined
                                                }
                                            >
                                                {invoice.status}
                                            </Badge>
                                        </Table.Cell>
                                        <Table.Cell className="text-end">
                                            {invoice.amount}
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Tabs.Panel>
                    <Tabs.Panel value="payouts">
                        <Text.Paragraph className="py-4 text-palette-accent/85">
                            No payouts this month.
                        </Text.Paragraph>
                    </Tabs.Panel>
                    <Tabs.Panel value="disputes">
                        <Text.Paragraph className="py-4 text-palette-accent/85">
                            No open disputes.
                        </Text.Paragraph>
                    </Tabs.Panel>
                </Tabs.Root>
            </Card>

            <Accordion.Root className="@5xl:col-span-2" defaultValue={["plan"]}>
                {[
                    [
                        "plan",
                        "Can I change my plan later?",
                        "Yes — upgrades apply at once, downgrades at the end of the cycle.",
                    ],
                    [
                        "refund",
                        "How do refunds work?",
                        "Within 30 days, in full, to the original payment method.",
                    ],
                ].map(([value, question, answer]) => (
                    <Accordion.Item key={value} value={value}>
                        <Accordion.Header>
                            <Accordion.Trigger>
                                {question}
                                <ChevronDownIcon className="size-icon shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                            </Accordion.Trigger>
                        </Accordion.Header>
                        <Accordion.Panel>
                            <Accordion.Content className="text-palette-accent/85">
                                {answer}
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion.Root>
        </div>
    );
}

function Card({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <section
            className={`flex flex-col gap-4 rounded-lg border border-palette-line p-5 ${className ?? ""}`}
        >
            {children}
        </section>
    );
}

// The overlays: a menu and a dialog, to see the overlay edge, shadow and
// motion under the chosen axes.
function Toolbar({ action }: { action: string }) {
    return (
        <div className="flex items-center gap-1">
            <Dialog.Root>
                <Dialog.Trigger
                    render={<Clickable.Button variant="outline" size="sm" />}
                >
                    Upgrade
                </Dialog.Trigger>
                <Dialog.Portal>
                    <Dialog.Backdrop />
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Upgrade storage</Dialog.Title>
                            <Dialog.Description>
                                Move to 1 TB for $8 a month. You can change it
                                at any time.
                            </Dialog.Description>
                        </Dialog.Header>
                        <Dialog.Footer>
                            <Dialog.Close
                                render={<Clickable.Button variant="outline" />}
                            >
                                Not now
                            </Dialog.Close>
                            <Dialog.Close
                                render={<Clickable.Button className={action} />}
                            >
                                Upgrade
                            </Dialog.Close>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger
                    render={
                        <Clickable.Button
                            variant="icon"
                            shape="square"
                            size="sm"
                            aria-label="More"
                        />
                    }
                >
                    <MoreHorizontalIcon />
                </DropdownMenu.Trigger>
                <DropdownMenu.Content align="end">
                    <DropdownMenu.Item>Export CSV</DropdownMenu.Item>
                    <DropdownMenu.Item>Usage history</DropdownMenu.Item>
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item className="palette-danger">
                        Delete workspace
                    </DropdownMenu.Item>
                </DropdownMenu.Content>
            </DropdownMenu.Root>
        </div>
    );
}
