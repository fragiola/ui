import type { DataGridModel } from "@fragiola/data-grid-react";
import type { ReactNode } from "react";

// Which of the common features a grid has installed, read from its model.
// The package keeps the list to itself, but a `get` of a key no installed
// feature has reads `undefined` (never throws), and each feature answers
// one of its own keys with a value — so one key per feature tells. Every
// feature piece renders nothing without its feature, and Template.Simple
// renders only the pieces of the features the model has.

const KEYS = {
    navigation: "active-position",
    sorting: "sort-columns",
    columnResize: "column-widths",
    columnPinning: "pinned-column-keys",
    rowSelection: "selected-row-keys",
    filtering: "column-filters",
    editing: "editing-cell",
    pagination: "page-info",
} as const;

export type CommonFeature = keyof typeof KEYS;

// A model with any features is a model (the package's typing): what every
// grid's is, whatever it installed.
export function installed<TRow>(
    model: DataGridModel<TRow, ReactNode> | null | undefined,
    feature: CommonFeature,
): boolean {
    if (!model) return false;
    const get = model.get as (key: string) => unknown;
    return get.call(model, KEYS[feature]) !== undefined;
}
