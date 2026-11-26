"use client";

import { type ReactNode, useState } from "react";
import { Text } from "#/components/atoms/text";
import { Rating } from "#/components/ui/rating";

// The chromatic palettes. A filled star is "on", so it is the palette's
// `ring`: swapping the class recolours the stars. Literal here because
// examples are published source (the code panel shows this file verbatim,
// with a copy button).
const CHROMATIC = ["blue", "purple", "green", "orange", "rose"] as const;

const LABELS = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];

// A product review in the default look: Rating.Template.Simple, named by
// its label through `aria-labelledby` (both bases). The arrows, Home and End
// move the score, a mouse previews the value under it and a press chooses
// it; each star is named by its score. Then the average shown read-only in
// half steps (still focusable, nothing changes it), a half-step picker with
// a second press clearing it, a disabled one, and last the same rating in
// each chromatic palette.
export default function RatingDemo() {
    const [score, setScore] = useState(4);
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div className="flex max-w-md flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <Text.Label id="review-label">Your rating</Text.Label>
                    <div className="flex items-center gap-3">
                        <Rating.Template.Simple
                            aria-labelledby="review-label"
                            name="rating"
                            value={score}
                            onValueChange={setScore}
                        />
                        <span className="text-sm text-palette-accent/85">
                            {LABELS[score] || "Not rated"}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Rating.Template.Simple
                        aria-label="Average rating"
                        value={4.5}
                        allowHalf
                        readOnly
                    />
                    <span className="text-sm text-palette-accent/85">
                        4.5 out of 5, from 128 reviews
                    </span>
                </div>
            </div>

            <Row label="states">
                <Rating.Template.Simple
                    aria-label="Half steps"
                    defaultValue={2.5}
                    allowHalf
                    allowClear
                />
                <Rating.Template.Simple
                    aria-label="Rating, disabled"
                    defaultValue={3}
                    disabled
                />
            </Row>

            {/* the same rating, only its palette-* class changed */}
            <Row label="palettes">
                {CHROMATIC.map((palette) => (
                    <Rating.Template.Simple
                        key={palette}
                        aria-label={`Rating, ${palette}`}
                        defaultValue={2}
                        count={3}
                        className={`palette-${palette}`}
                    />
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
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                {children}
            </div>
        </div>
    );
}
