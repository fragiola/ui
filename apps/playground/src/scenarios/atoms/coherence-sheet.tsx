import { ChevronDownIcon, SearchIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Input } from "#/components/atoms/fields";
import { Accordion } from "#/components/ui/accordion";
import { Breadcrumb } from "#/components/ui/breadcrumb";
import { Checkbox } from "#/components/ui/checkbox";
import { Combobox } from "#/components/ui/combobox";
import { DropdownMenu } from "#/components/ui/dropdown-menu";
import { Field } from "#/components/ui/field";
import { Pagination } from "#/components/ui/pagination";
import { Popover } from "#/components/ui/popover";
import { Progress } from "#/components/ui/progress";
import { Radio, RadioGroup } from "#/components/ui/radio";
import { Select } from "#/components/ui/select";
import { Slider } from "#/components/ui/slider";
import { Switch } from "#/components/ui/switch";
import { Table } from "#/components/ui/table";
import { Tabs } from "#/components/ui/tabs";

// The coherence sheet — every control side by side, in every state, so the
// visual language (docs/visual-language.md) is reviewed on one screen: the
// boxes share one stroke, one height and one ring; "on" is one colour across
// checkbox, radio, switch, slider and progress; disabled and invalid look the
// same everywhere. Use the toolbar for the theme, the direction and every
// axis level.
//
// Each set is shown twice: on the neutral floor with the neutral action
// palette, and on a `surface-blue` floor with the blue action palette — the
// same markup, only the palette classes differ.

const SETS = [
    { floor: "surface", action: "neutral" },
    { floor: "surface-blue", action: "blue" },
] as const;

const fruits = ["Apple", "Banana", "Cherry"];

export default function CoherenceSheet() {
    return (
        <div className="palette-surface flex flex-col gap-8 bg-palette-base p-6 text-palette-contrast">
            {SETS.map((set) => (
                <Sheet key={set.floor} {...set} />
            ))}
            {SETS.map((set) => (
                <Sets key={set.floor} {...set} />
            ))}
        </div>
    );
}

function Sheet({ floor, action }: { floor: string; action: string }) {
    return (
        <section className={`palette-${floor} flex flex-col gap-6`}>
            <h2 className="font-mono text-xs text-palette-accent/85">
                palette-{floor} · palette-{action}
            </h2>

            <Row label="buttons">
                <Clickable.Button className={`palette-${action}`}>
                    Solid
                </Clickable.Button>
                <Clickable.Button variant="outline">Outline</Clickable.Button>
                <Clickable.Button variant="ghost">Ghost</Clickable.Button>
                <Clickable.Button
                    variant="outline"
                    shape="square"
                    aria-label="Search"
                >
                    <SearchIcon />
                </Clickable.Button>
                <Clickable.Button className={`palette-${action}`} size="sm">
                    Small
                </Clickable.Button>
                <Clickable.Button className={`palette-${action}`} disabled>
                    Disabled
                </Clickable.Button>
                <Clickable.Button className="palette-danger">
                    Delete
                </Clickable.Button>
            </Row>

            <Row label="boxes (one height, one stroke, one ring)">
                <Field.Root className="w-48">
                    <Field.Label>Input</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input placeholder="Placeholder" />
                        </Field.Body>
                    </Field.Row>
                    <Field.Description>Helper text.</Field.Description>
                </Field.Root>
                <Field.Root className="w-48">
                    <Field.Label>Select</Field.Label>
                    <Select.Root defaultValue="Apple">
                        <Select.Trigger>
                            <Select.Value />
                        </Select.Trigger>
                        <Select.Content>
                            {fruits.map((fruit) => (
                                <Select.Item key={fruit} value={fruit}>
                                    {fruit}
                                </Select.Item>
                            ))}
                        </Select.Content>
                    </Select.Root>
                </Field.Root>
                <Field.Root className="w-48">
                    <Field.Label>Combobox</Field.Label>
                    <Combobox.Root items={fruits}>
                        <Combobox.InputGroup>
                            <Combobox.Input placeholder="Search…" />
                            <Combobox.Trigger />
                        </Combobox.InputGroup>
                        <Combobox.Content>
                            <Combobox.List>
                                {(item: string) => (
                                    <Combobox.Item key={item} value={item}>
                                        {item}
                                    </Combobox.Item>
                                )}
                            </Combobox.List>
                        </Combobox.Content>
                    </Combobox.Root>
                </Field.Root>
                <Field.Root className="w-48">
                    <Field.Label>Addon</Field.Label>
                    <Field.Row>
                        <Field.Addon side="inline-start">https://</Field.Addon>
                        <Field.Body>
                            <Input placeholder="example.com" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
            </Row>

            <Row label="box states">
                <Field.Root invalid className="w-48">
                    <Field.Label>Invalid</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input defaultValue="admin" />
                        </Field.Body>
                    </Field.Row>
                    <Field.Error>This username is taken.</Field.Error>
                </Field.Root>
                <Field.Root disabled className="w-48">
                    <Field.Label>Disabled</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input placeholder="Cannot edit" />
                        </Field.Body>
                    </Field.Row>
                </Field.Root>
            </Row>

            <Row label="on / off (one colour for on)">
                <Field.ChoiceRoot className="w-auto">
                    <Checkbox.Root id={`${floor}-cb-off`}>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor={`${floor}-cb-off`}>Off</Field.Label>
                </Field.ChoiceRoot>
                <Field.ChoiceRoot className="w-auto">
                    <Checkbox.Root id={`${floor}-cb-on`} defaultChecked>
                        <Checkbox.Indicator />
                    </Checkbox.Root>
                    <Field.Label htmlFor={`${floor}-cb-on`}>On</Field.Label>
                </Field.ChoiceRoot>
                <RadioGroup defaultValue="b" className="flex-row gap-4">
                    {["a", "b"].map((value) => (
                        <Field.ChoiceRoot key={value} className="w-auto">
                            <Radio.Root
                                value={value}
                                id={`${floor}-rd-${value}`}
                            >
                                <Radio.Indicator />
                            </Radio.Root>
                            <Field.Label htmlFor={`${floor}-rd-${value}`}>
                                Radio {value}
                            </Field.Label>
                        </Field.ChoiceRoot>
                    ))}
                </RadioGroup>
                <Field.ChoiceRoot className="w-auto">
                    <Switch.Root id={`${floor}-sw-off`}>
                        <Switch.Thumb />
                    </Switch.Root>
                    <Field.Label htmlFor={`${floor}-sw-off`}>Off</Field.Label>
                </Field.ChoiceRoot>
                <Field.ChoiceRoot className="w-auto">
                    <Switch.Root id={`${floor}-sw-on`} defaultChecked>
                        <Switch.Thumb />
                    </Switch.Root>
                    <Field.Label htmlFor={`${floor}-sw-on`}>On</Field.Label>
                </Field.ChoiceRoot>
                <Field.ChoiceRoot className="w-auto">
                    <Switch.Root id={`${floor}-sw-dis`} defaultChecked disabled>
                        <Switch.Thumb />
                    </Switch.Root>
                    <Field.Label htmlFor={`${floor}-sw-dis`}>
                        Disabled
                    </Field.Label>
                </Field.ChoiceRoot>
            </Row>

            <Row label="tracks">
                <Slider.Root defaultValue={60} className="w-48">
                    <Slider.Control>
                        <Slider.Track>
                            <Slider.Indicator />
                            <Slider.Thumb />
                        </Slider.Track>
                    </Slider.Control>
                </Slider.Root>
                <Progress.Root value={60} className="w-48">
                    <Progress.Track>
                        <Progress.Indicator />
                    </Progress.Track>
                </Progress.Root>
            </Row>

            <Row label="badges">
                <Badge>Soft</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="solid" className={`palette-${action}`}>
                    Solid
                </Badge>
                <Badge className="palette-danger">Danger</Badge>
            </Row>
        </section>
    );
}

// Sets, containers and overlays: the current item of a set (a tab, a page),
// a selected row, a container on the floor, and what floats. Open the menu
// and the popover to compare the overlay's edge, shadow and motion.
function Sets({ floor }: { floor: string; action: string }) {
    return (
        <section className={`palette-${floor} flex flex-col gap-6`}>
            <h2 className="font-mono text-xs text-palette-accent/85">
                sets · palette-{floor}
            </h2>

            <Row label="current (tab, page)">
                <Tabs.Root defaultValue="account">
                    <Tabs.List>
                        <Tabs.Tab value="account">Account</Tabs.Tab>
                        <Tabs.Tab value="password">Password</Tabs.Tab>
                        <Tabs.Tab value="team">Team</Tabs.Tab>
                    </Tabs.List>
                </Tabs.Root>
                <Pagination.Root className="mx-0 w-auto">
                    <Pagination.Content>
                        {[1, 2, 3].map((page) => (
                            <Pagination.Item key={page}>
                                <Pagination.Link
                                    href={`?page=${page}`}
                                    active={page === 2}
                                >
                                    {page}
                                </Pagination.Link>
                            </Pagination.Item>
                        ))}
                    </Pagination.Content>
                </Pagination.Root>
                <Breadcrumb.Root>
                    <Breadcrumb.List>
                        <Breadcrumb.Item>
                            <Breadcrumb.Link href="#">Home</Breadcrumb.Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Separator />
                        <Breadcrumb.Item>
                            <Breadcrumb.Page>Settings</Breadcrumb.Page>
                        </Breadcrumb.Item>
                    </Breadcrumb.List>
                </Breadcrumb.Root>
            </Row>

            <Row label="selected row · container">
                <div className="w-96">
                    <Table.Root>
                        <Table.Body>
                            {["INV001", "INV002", "INV003"].map((invoice) => (
                                <Table.Row
                                    key={invoice}
                                    data-state={
                                        invoice === "INV002"
                                            ? "selected"
                                            : undefined
                                    }
                                >
                                    <Table.Cell>{invoice}</Table.Cell>
                                    <Table.Cell className="text-end">
                                        $250.00
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </div>
                <Accordion.Root className="w-80" defaultValue={["a"]}>
                    {["a", "b"].map((value) => (
                        <Accordion.Item key={value} value={value}>
                            <Accordion.Header>
                                <Accordion.Trigger>
                                    Question {value.toUpperCase()}
                                    <ChevronDownIcon className="size-icon shrink-0 transition-transform duration-200 group-data-panel-open:rotate-180" />
                                </Accordion.Trigger>
                            </Accordion.Header>
                            <Accordion.Panel>
                                <Accordion.Content>
                                    The answer, in secondary text.
                                </Accordion.Content>
                            </Accordion.Panel>
                        </Accordion.Item>
                    ))}
                </Accordion.Root>
            </Row>

            <Row label="overlays (open them)">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        render={<Clickable.Button variant="outline" />}
                    >
                        Menu
                        <ChevronDownIcon />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        <DropdownMenu.Item>Profile</DropdownMenu.Item>
                        <DropdownMenu.Item>Billing</DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item className="palette-danger">
                            Delete
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                <Popover.Root>
                    <Popover.Trigger
                        render={<Clickable.Button variant="outline" />}
                    >
                        Popover
                    </Popover.Trigger>
                    <Popover.Content>
                        <p className="text-sm">The same edge as the menu.</p>
                    </Popover.Content>
                </Popover.Root>
            </Row>
        </section>
    );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-start gap-4">{children}</div>
        </div>
    );
}
