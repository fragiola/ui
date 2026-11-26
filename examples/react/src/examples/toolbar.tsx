"use client";

import {
    AlignCenterIcon,
    AlignLeftIcon,
    BoldIcon,
    ItalicIcon,
    Redo2Icon,
    Undo2Icon,
} from "lucide-react";
import { Field } from "#/components/ui/field";
import { ToggleGroup } from "#/components/ui/toggle-group";
import { Toolbar } from "#/components/ui/toolbar";

// An editor's toolbar in the default look: one tab stop for the whole row,
// the arrows moving between its tools (swapped in RTL). Undo and redo are
// buttons; bold and italic are Toolbar.Toggles (pressed is `current`); the
// alignment is a ToggleGroup of them; the font size is a bare input in a
// field box; the help is a link. Separators split the groups.
export default function ToolbarDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <Toolbar.Root aria-label="Formatting">
                <Toolbar.Group aria-label="History">
                    <Toolbar.Button aria-label="Undo">
                        <Undo2Icon />
                    </Toolbar.Button>
                    <Toolbar.Button aria-label="Redo" disabled>
                        <Redo2Icon />
                    </Toolbar.Button>
                </Toolbar.Group>
                <Toolbar.Separator />
                <Toolbar.Group aria-label="Style">
                    <Toolbar.Toggle
                        aria-label="Bold"
                        shape="square"
                        defaultPressed
                    >
                        <BoldIcon />
                    </Toolbar.Toggle>
                    <Toolbar.Toggle aria-label="Italic" shape="square">
                        <ItalicIcon />
                    </Toolbar.Toggle>
                </Toolbar.Group>
                <Toolbar.Separator />
                <ToggleGroup aria-label="Alignment" defaultValue={["left"]}>
                    <Toolbar.Toggle
                        value="left"
                        aria-label="Align left"
                        shape="square"
                    >
                        <AlignLeftIcon />
                    </Toolbar.Toggle>
                    <Toolbar.Toggle
                        value="center"
                        aria-label="Align center"
                        shape="square"
                    >
                        <AlignCenterIcon />
                    </Toolbar.Toggle>
                </ToggleGroup>
                <Toolbar.Separator />
                <Field.Row className="w-16">
                    <Field.Body className="min-h-8">
                        <Toolbar.Input
                            aria-label="Font size"
                            defaultValue="14"
                            inputMode="numeric"
                        />
                    </Field.Body>
                </Field.Row>
                <Toolbar.Separator />
                <Toolbar.Link href="#formatting-help">Help</Toolbar.Link>
            </Toolbar.Root>
        </div>
    );
}
