"use client";

import type { EditCellRenderProps } from "@fragiola/data-grid-react";
import type * as React from "react";
import { useLayoutEffect } from "react";
import { Input } from "#/atoms/fields";
import { sheet } from "#/families/sheet";
import { cn } from "#/lib/cn";
import { Field } from "#/ui/field";

type CellEditorProps<TRow> = EditCellRenderProps<TRow, React.ReactNode> & {
    /**
     * The draft is refused: the field turns danger, and Enter and Tab keep
     * the edit open (Escape still cancels it). A press or focus outside the
     * cell still commits (the package's rule): check the value where your
     * `onCellEdit` writes it too.
     */
    invalid?: boolean | undefined;
    /** The input's type: "text" unless given ("number", "email", "date"…). */
    type?: React.HTMLInputTypeAttribute | undefined;
    className?: string | undefined;
};

// A text editor for an edited cell (editing()): what a column's
// `renderEditCell` returns, given the props it receives —
//
//   renderEditCell: (props) => <DataGrid.CellEditor {...props} />
//
// The registry's Input in a Field frame (rule 3), as large as its cell. It
// shows the draft and changes it as you type; an edit started by typing
// starts from that key, as a spreadsheet does. The keys are the package's:
// Enter commits and moves down, Tab commits and moves across, Escape
// cancels, a press outside commits. `invalid` marks the field danger and
// keeps Enter and Tab from committing; a press outside still commits, so
// the app's `onCellEdit` checks the value it writes. The field carries the edit's editor attribute
// (`editorProps`), so the grid knows it as this edit's. Named after its
// column unless given an `aria-label`. The value committed is the draft, a
// string: the app's `onCellEdit` writes it into its rows.
function CellEditor<TRow>({
    value,
    startKey,
    onChange,
    editorProps,
    column,
    invalid = false,
    type = "text",
    className,
}: CellEditorProps<TRow>) {
    useLayoutEffect(() => {
        if (startKey !== undefined) onChange(startKey);
    }, [startKey, onChange]);
    return (
        <Field.Root
            data-slot="data-grid-cell-editor"
            {...editorProps}
            invalid={invalid}
            className={sheet.editor()}
        >
            <Field.Row className={sheet.editorFrame()}>
                <Input
                    type={type}
                    aria-label={column.name ?? column.key}
                    aria-invalid={invalid || undefined}
                    value={String(value ?? "")}
                    onValueChange={(text) => onChange(text)}
                    onKeyDown={(event) => {
                        // its own keys run before the grid's: a refused
                        // draft is never committed
                        if (
                            invalid &&
                            (event.key === "Enter" || event.key === "Tab")
                        ) {
                            event.preventDefault();
                        }
                    }}
                    className={cn(sheet.editorControl(), className)}
                />
            </Field.Row>
        </Field.Root>
    );
}

export { CellEditor };
