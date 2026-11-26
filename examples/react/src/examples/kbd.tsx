import { SearchIcon } from "lucide-react";
import { Input } from "#/components/atoms/fields";
import { Field } from "#/components/ui/field";
import { Kbd, KbdGroup } from "#/components/ui/kbd";

const SHORTCUTS = [
    { action: "Open the command palette", keys: ["⌘", "K"] },
    { action: "Create an issue", keys: ["C"] },
    { action: "Go to settings", keys: ["⌘", ","] },
    { action: "Move to the next issue", keys: ["Shift", "↓"] },
] as const;

// A project tool's keyboard hints, in the default look: a search field with
// its shortcut in the field's inset, a line of help text with a key in it,
// and the shortcuts list, each combination a KbdGroup. A key is the
// keyboard-hint type (text-xs, font-medium) on a cap: a line stroke around
// a soft adornment.
export default function KbdDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-sm flex-col gap-4">
                <Field.Root>
                    <Field.Row>
                        <Field.Body>
                            <Field.Inset>
                                <SearchIcon />
                            </Field.Inset>
                            <Input
                                aria-label="Search issues"
                                placeholder="Search issues…"
                            />
                            <Field.Inset>
                                <KbdGroup>
                                    <Kbd>⌘</Kbd>
                                    <Kbd>K</Kbd>
                                </KbdGroup>
                            </Field.Inset>
                        </Field.Body>
                    </Field.Row>
                </Field.Root>

                <p className="text-sm text-palette-accent/85">
                    Press <Kbd>Esc</Kbd> to close the panel without saving.
                </p>
            </div>

            <dl className="flex max-w-sm flex-col divide-y divide-palette-line text-sm">
                {SHORTCUTS.map((shortcut) => (
                    <div
                        key={shortcut.action}
                        className="flex items-center justify-between gap-4 py-2"
                    >
                        <dt>{shortcut.action}</dt>
                        <dd>
                            <KbdGroup>
                                {shortcut.keys.map((key) => (
                                    <Kbd key={key}>{key}</Kbd>
                                ))}
                            </KbdGroup>
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    );
}
