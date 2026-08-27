import type { ReactNode } from "react";
import { Skeleton } from "#/ui/skeleton";

// The floor is palette-surface. The skeleton reads the floor's soft role for
// its shimmer background. Shows a realistic composition: card, avatar + text,
// and a table-like layout.
export default function SkeletonDemo() {
    return (
        <div className="palette-surface flex flex-col gap-6 rounded-lg border border-palette-line bg-palette-base p-6">
            <Row label="card">
                <div className="flex flex-col gap-3">
                    <Skeleton className="h-24 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </Row>

            <Row label="avatar + text">
                <div className="flex items-center gap-4">
                    <Skeleton className="size-12 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
            </Row>

            <Row label="table rows">
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                </div>
            </Row>
        </div>
    );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-xs font-mono text-palette-accent/85">
                {label}
            </span>
            {children}
        </div>
    );
}
