import { Skeleton } from "#/components/ui/skeleton";

// A post card while it loads, in the default look: the skeleton reads the
// floor's soft role, so it takes whatever palette it sits in. Each block is
// sized like the content it stands in for (an avatar, a name, a line of
// text, an image), so nothing jumps when the content arrives.
export default function SkeletonDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <div
                className="flex w-full max-w-sm flex-col gap-4"
                role="status"
                aria-busy="true"
                aria-label="Loading post"
            >
                <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-20" />
                    </div>
                </div>
                <Skeleton className="h-40 w-full rounded-lg" />
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
        </div>
    );
}
