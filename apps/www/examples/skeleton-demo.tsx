import { Skeleton } from "#/ui/skeleton";
import { PaletteGrid } from "@/components/preview/palette-grid";
import { SURFACES } from "@/lib/palette-sets";

// Each cell is a tinted surface palette. The skeleton reads the cell's soft
// role for its shimmer background — the placeholder shape inherits the
// palette's surface tint.
function DemoContent() {
    return (
        <div className="flex flex-col gap-6">
            {/* Card skeleton */}
            <div className="flex flex-col gap-3">
                <Skeleton className="h-24 w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Avatar + text */}
            <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                </div>
            </div>

            {/* Table skeleton */}
            <div className="flex flex-col gap-2">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        </div>
    );
}

export default function SkeletonDemo() {
    return (
        <PaletteGrid palettes={SURFACES}>
            <DemoContent />
        </PaletteGrid>
    );
}
