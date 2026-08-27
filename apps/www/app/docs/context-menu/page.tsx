import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function ContextMenuPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Context Menu
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A menu of actions triggered by a right-click. Shares the{" "}
                    <code>popup</code> and <code>menu</code> style families with
                    dropdown-menu — installing it after{" "}
                    <code>dropdown-menu</code> writes exactly one file.
                </p>
            </div>

            <InstallCommand name="context-menu" />

            <ComponentPreview name="context-menu-demo" />

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Style families
                </h2>
                <p className="text-sm text-palette-accent/85">
                    <code>context-menu</code> renders from the same{" "}
                    <code>menu</code> source as <code>dropdown-menu</code>. The
                    only differences are <code>Root</code>, <code>Trigger</code>{" "}
                    (which carries <code>select-none</code> — behavioural, not
                    visual, so it does not come from a family) and the
                    positioning defaults.
                </p>
                <p className="text-sm text-palette-accent/85">
                    The <code>select-none</code> on{" "}
                    <code>ContextMenu.Trigger</code> stops text selection on
                    right-click. It is behavioural, not visual, so it does not
                    come from a family — keep the distinction.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Distribution proof
                </h2>
                <p className="text-sm text-palette-accent/85">
                    Installing <code>dropdown-menu</code> pulls{" "}
                    <code>menu</code> and <code>popup</code>. Installing{" "}
                    <code>context-menu</code> afterwards writes{" "}
                    <strong>one file</strong> — <code>context-menu.tsx</code>{" "}
                    itself. The shared families are already on disk. This is the
                    distribution-level proof that the duplication claim holds.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Parts
                </h2>
                <p className="text-sm text-palette-accent/85">
                    Identical to <code>dropdown-menu</code> — same factory, same
                    members. See the{" "}
                    <a
                        href="/docs/dropdown-menu"
                        className="text-palette-contrast hover:underline"
                    >
                        dropdown-menu parts table
                    </a>
                    .
                </p>
            </section>
        </div>
    );
}
