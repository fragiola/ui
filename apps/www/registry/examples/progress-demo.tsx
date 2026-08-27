"use client";

import { Progress } from "#/ui/progress";

export default function ProgressDemo() {
    return (
        <div className="flex flex-col gap-8">
            {/* Determinate */}
            <Progress.Root value={65}>
                <div className="flex items-center justify-between">
                    <Progress.Label>Uploading</Progress.Label>
                    <Progress.Value />
                </div>
                <Progress.Track>
                    <Progress.Indicator />
                </Progress.Track>
            </Progress.Root>

            {/* Indeterminate */}
            <Progress.Root value={null}>
                <Progress.Label>Connecting…</Progress.Label>
                <Progress.Track>
                    <Progress.Indicator />
                </Progress.Track>
            </Progress.Root>

            {/* Tone by palette class — not a prop */}
            <Progress.Root value={80} className="palette-warning">
                <Progress.Label>Warning</Progress.Label>
                <Progress.Track>
                    <Progress.Indicator />
                </Progress.Track>
            </Progress.Root>

            <Progress.Root value={100} className="palette-success">
                <Progress.Label>Complete</Progress.Label>
                <Progress.Track>
                    <Progress.Indicator />
                </Progress.Track>
            </Progress.Root>

            {/* With a value label (custom format) */}
            <Progress.Root value={42}>
                <div className="flex items-center justify-between">
                    <Progress.Label>Storage</Progress.Label>
                    <Progress.Value>
                        {(formatted) => `${formatted} used`}
                    </Progress.Value>
                </div>
                <Progress.Track>
                    <Progress.Indicator />
                </Progress.Track>
            </Progress.Root>
        </div>
    );
}
