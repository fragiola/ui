import { HomeLayout } from "fumadocs-ui/layouts/home";
import Link from "next/link";
import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";
import { baseOptions } from "@/lib/layout.shared";

export default function HomePage() {
    return (
        <HomeLayout {...baseOptions()}>
            <div className="px-6 py-10 max-w-3xl">
                <h1 className="text-2xl font-semibold text-palette-contrast mb-4">
                    Fragiola UI
                </h1>
                <p className="text-sm text-palette-accent/85 mb-6">
                    A copy-paste component library built on Base UI primitives
                    and Tailwind v4. Inspired by shadcn/ui, reusing its registry
                    format and CLI for distribution.
                </p>

                <h2 className="text-xl font-semibold text-palette-contrast mt-8 mb-3">
                    Why Fragiola exists
                </h2>
                <p className="text-sm text-palette-accent/85 mb-4">
                    Three problems with shadcn/ui do not scale, each measured in
                    the proof of concept that validated this architecture:
                </p>
                <ul className="space-y-2 text-sm text-palette-accent/85 mb-6">
                    <li>
                        <strong>Rigid theming.</strong> 41 fixed global tokens;
                        swapping a theme redefines ~20 at once. No way to tint
                        one area while keeping its surface neutral, no way to
                        scope a color to a subtree.
                    </li>
                    <li>
                        <strong>Duplicated styles.</strong> 422{" "}
                        <code>cn-*</code> classes where components sharing a
                        visual skeleton have the CSS pasted rather than shared.{" "}
                        <code>destructive</code> appears 132 times.
                    </li>
                    <li>
                        <strong>Duplicated components.</strong> ~250 identical
                        wrapper lines between dropdown-menu and context-menu.
                        Three different ways to write an input.
                    </li>
                </ul>

                <h2 className="text-xl font-semibold text-palette-contrast mt-8 mb-3">
                    Live preview
                </h2>
                <p className="text-sm text-palette-accent/85 mb-4">
                    The preview surface below carries a palette class. Switch it
                    to see the same content under <code>blue</code>,{" "}
                    <code>danger</code>, <code>raised</code> and more — without
                    leaving the page. That scoping is the demonstration: a
                    subtree carries its own palette.
                </p>
                <ComponentPreview name="text-demo" />

                <h2 className="text-xl font-semibold text-palette-contrast mt-8 mb-3">
                    Install
                </h2>
                <p className="text-sm text-palette-accent/85 mb-4">
                    Add the <code>@fragiola</code> registry to your{" "}
                    <code>components.json</code>, then install any item:
                </p>
                <InstallCommand name="text" />

                <h2 className="text-xl font-semibold text-palette-contrast mt-8 mb-3">
                    Next
                </h2>
                <ul className="space-y-1 text-sm">
                    <li>
                        <Link
                            className="text-palette-contrast hover:underline"
                            href="/docs/theming"
                        >
                            Theming — the six roles
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="text-palette-contrast hover:underline"
                            href="/docs/palettes"
                        >
                            Palettes — the core palettes, rendered
                        </Link>
                    </li>
                    <li>
                        <Link
                            className="text-palette-contrast hover:underline"
                            href="/docs/installation"
                        >
                            Installation — adding the registry
                        </Link>
                    </li>
                </ul>
            </div>
        </HomeLayout>
    );
}
