"use client";

import { CheckIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "#/components/atoms/badge";

// The chromatic palettes. Literal here because examples are published source
// (the code panel shows this file verbatim, with a copy button).
const CHROMATIC = [
    "blue",
    "purple",
    "green",
    "orange",
    "rose",
    "danger",
] as const;

const INVOICES = [
    {
        id: "INV-1042",
        customer: "Northwind",
        amount: "$1,280.00",
        status: "paid",
    },
    { id: "INV-1043", customer: "Contoso", amount: "$640.00", status: "due" },
    {
        id: "INV-1044",
        customer: "Fabrikam",
        amount: "$2,150.00",
        status: "draft",
    },
] as const;

// An invoice list in the default look: a badge per status, its variant
// saying how loud it is: solid (palette-neutral) for what needs attention,
// soft for what is settled, outline for what is not sent yet. Soft and
// outline take the floor's palette. Then a badge with an icon, and last the
// same badge in each chromatic palette: the colour is the palette class on
// the badge, there is no colour variant.
export default function BadgeDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <ul className="flex max-w-md flex-col divide-y divide-palette-line text-sm">
                {INVOICES.map((invoice) => (
                    <li
                        key={invoice.id}
                        className="flex items-center gap-4 py-3"
                    >
                        <span className="w-20 font-medium">{invoice.id}</span>
                        <span className="flex-1 text-palette-accent/85">
                            {invoice.customer}
                        </span>
                        <span className="tabular-nums">{invoice.amount}</span>
                        <span className="w-14 text-end">
                            {invoice.status === "paid" && <Badge>Paid</Badge>}
                            {invoice.status === "due" && (
                                <Badge
                                    className="palette-neutral"
                                    variant="solid"
                                >
                                    Due
                                </Badge>
                            )}
                            {invoice.status === "draft" && (
                                <Badge variant="outline">Draft</Badge>
                            )}
                        </span>
                    </li>
                ))}
            </ul>

            <Row label="with icon">
                <Badge>
                    <CheckIcon />
                    Verified
                </Badge>
            </Row>

            {/* the same badge, only its palette-* class changed */}
            <Row label="palettes">
                {CHROMATIC.map((palette) => (
                    <Badge key={palette} className={`palette-${palette}`}>
                        {palette}
                    </Badge>
                ))}
            </Row>
        </div>
    );
}

// Row — a captioned row. The caption is a <span>, not a heading.
function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="font-mono text-xs text-palette-accent/85">
                {label}
            </span>
            <div className="flex flex-wrap items-center gap-2">{children}</div>
        </div>
    );
}
