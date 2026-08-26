"use client";

import { ChevronRightIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { Clickable } from "#/atoms/clickable";
import { Input } from "#/atoms/fields";
import { Field } from "#/ui/field";

// A stand-in for a framework link (Next/TanStack). In a real app this is the
// router's <Link> — Fragiola ships one polymorphism mechanism (`render`) and
// this is how it is used.
function FakeRouterLink({
    href,
    children,
    ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <a href={href} {...rest}>
            {children}
        </a>
    );
}

export default function ClickableDemo() {
    return (
        <div className="flex flex-col gap-6">
            {/* variant × size × shape matrix */}
            <div className="flex flex-wrap items-center gap-3">
                <Clickable.Button variant="solid" size="md">
                    Solid
                </Clickable.Button>
                <Clickable.Button variant="outline" size="md">
                    Outline
                </Clickable.Button>
                <Clickable.Button variant="ghost" size="md">
                    Ghost
                </Clickable.Button>
                <Clickable.Button variant="solid" size="sm">
                    Small
                </Clickable.Button>
                <Clickable.Button variant="outline" size="sm">
                    Small outline
                </Clickable.Button>
            </div>

            {/* icon button — variant="icon" + shape="square" + size */}
            <div className="flex flex-wrap items-center gap-3">
                <Clickable.Button
                    variant="icon"
                    shape="square"
                    size="md"
                    aria-label="Add"
                >
                    <PlusIcon />
                </Clickable.Button>
                <Clickable.Button
                    variant="icon"
                    shape="square"
                    size="sm"
                    aria-label="Add"
                >
                    <PlusIcon />
                </Clickable.Button>
                <Clickable.Button
                    variant="icon"
                    shape="square"
                    size="md"
                    aria-label="Next"
                >
                    <ChevronRightIcon />
                </Clickable.Button>
            </div>

            {/* disabled — no pointer events, including through the child icon */}
            <div className="flex flex-wrap items-center gap-3">
                <Clickable.Button disabled>Disabled</Clickable.Button>
                <Clickable.Button
                    variant="icon"
                    shape="square"
                    disabled
                    aria-label="Delete"
                >
                    <Trash2Icon />
                </Clickable.Button>
            </div>

            {/* tone by palette class — no tone prop, no variant="destructive" */}
            <div className="flex flex-wrap items-center gap-3">
                <Clickable.Button className="palette-danger">
                    Delete
                </Clickable.Button>
                <Clickable.Button variant="outline" className="palette-danger">
                    Delete outline
                </Clickable.Button>
                <Clickable.Button
                    variant="icon"
                    shape="square"
                    className="palette-danger"
                    aria-label="Delete"
                >
                    <Trash2Icon />
                </Clickable.Button>
            </div>

            {/* Links — plain <a>, framework link stitched through render */}
            <div className="flex flex-wrap items-center gap-3">
                <Clickable.Link href="/docs">Internal link</Clickable.Link>
                <Clickable.ExternalLink href="https://fragiola.com">
                    External link
                </Clickable.ExternalLink>
                <Clickable.Link href="/docs" render={<FakeRouterLink />}>
                    Router-stitched link
                </Clickable.Link>
            </div>

            {/* md equals h-control — a button sits flush next to a field */}
            <div className="flex flex-wrap items-end gap-3">
                <Field.Root className="w-56">
                    <Field.Label>Email</Field.Label>
                    <Field.Row>
                        <Field.Body>
                            <Input placeholder="you@example.com" />
                        </Field.Body>
                        <Field.Addon side="inline-end">
                            <Clickable.Button variant="solid" size="sm">
                                Send
                            </Clickable.Button>
                        </Field.Addon>
                    </Field.Row>
                </Field.Root>
            </div>
        </div>
    );
}
