"use client";

import {
    type DataGridFeature,
    type HeaderCellInfo,
    useDataGrid,
    useGridView,
} from "@fragiola/data-grid-react";
import type { FilteringTypes } from "@fragiola/data-grid-react/filtering";
import { Input } from "#/atoms/fields";
import { sheet } from "#/families/sheet";
import { cn } from "#/lib/cn";
import { Field } from "#/ui/field";
import { Select } from "#/ui/select";
import { installed } from "./installed";

/**
 * A choice of an enumerated column's filter: a value (shown as text), or a
 * value and its label. The value is compared with the cells' as it is, so
 * a number column takes numbers.
 */
type FilterOption =
    | string
    | number
    | boolean
    | { value: unknown; label: string };

type HeaderFilterProps<TRow> = {
    /** The header cell whose column it filters. */
    cell: HeaderCellInfo<TRow>;
    /**
     * An enumerated column's choices: a select instead of a text field.
     * Unless given, the column's `meta.filterOptions`.
     */
    options?: readonly FilterOption[] | undefined;
    /** The text field's placeholder: "Filter" unless given. */
    placeholder?: string | undefined;
    className?: string | undefined;
};

// The select's value for "every row"; a choice's is its index.
const ALL = "all";

const optionOf = (option: FilterOption) =>
    typeof option === "object"
        ? option
        : { value: option, label: String(option) };

// A column's filter (filtering()), under its name in the header cell: the
// column filters the grid's model holds (`column-filter.set`), which rows
// in memory (`useLocalRows`) or a server apply. A text field — the
// registry's Input in a Field frame (rule 3) — keeps the rows whose value
// contains the text; with `options` (or the column's `meta.filterOptions`)
// a select — the registry's Select — keeps the rows equal to the choice
// ("All" clears it). In the grid it is a control of its header cell: a
// click (or F2) hands it the keys, Escape gives them back, and a click on
// it never sorts. Named "Filter <column>". Nothing without filtering()
// installed, on a group's header cell, or on a column whose
// `meta.filterable` is false. With it, the styled Root makes header rows
// tall enough for a name above a filter.
function HeaderFilter<TRow>({
    cell,
    options,
    placeholder = "Filter",
    className,
}: HeaderFilterProps<TRow>) {
    const { model } = useDataGrid<
        TRow,
        readonly [DataGridFeature<FilteringTypes>]
    >();
    // the view moves with the filters: the field follows them
    useGridView();
    const column = cell.column;
    if (!installed(model, "filtering") || !column) return null;
    if (column.meta?.filterable === false) return null;
    const columnKey = column.key;
    const name = `Filter ${column.name ?? column.key}`;
    const value = model.get("column-filter-by", { columnKey });
    const set = (next: unknown) =>
        model.run("column-filter.set", { columnKey, value: next });
    const choices = (
        options ??
        (column.meta?.filterOptions as readonly FilterOption[] | undefined)
    )?.map(optionOf);

    if (choices) {
        const items = [
            { value: ALL, label: "All" },
            ...choices.map((choice, index) => ({
                value: String(index),
                label: choice.label,
            })),
        ];
        const index = Array.isArray(value)
            ? choices.findIndex((choice) => Object.is(choice.value, value[0]))
            : -1;
        const chosen = index < 0 ? ALL : String(index);
        return (
            <Select.Root
                items={items}
                value={chosen}
                onValueChange={(choice) =>
                    // a list matches equal values (`useLocalRows`)
                    set(
                        choice === ALL || choice == null
                            ? undefined
                            : [choices[Number(choice)]?.value],
                    )
                }
            >
                <Select.Trigger
                    data-slot="data-grid-header-filter"
                    aria-label={name}
                    className={cn(
                        sheet.filter(),
                        sheet.filterControl(),
                        className,
                    )}
                >
                    <Select.Value />
                </Select.Trigger>
                <Select.Content>
                    {items.map((item) => (
                        <Select.Item key={item.value} value={item.value}>
                            {item.label}
                        </Select.Item>
                    ))}
                </Select.Content>
            </Select.Root>
        );
    }

    return (
        <Field.Root
            data-slot="data-grid-header-filter"
            className={cn(sheet.filter(), className)}
        >
            <Field.Row className={sheet.filterFrame()}>
                <Input
                    aria-label={name}
                    placeholder={placeholder}
                    value={typeof value === "string" ? value : ""}
                    onValueChange={(text) => set(text)}
                    className={sheet.filterControl()}
                />
            </Field.Row>
        </Field.Root>
    );
}

export { HeaderFilter };
