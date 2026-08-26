import SkeletonDemo from "#/examples/skeleton-demo";
import { ComponentPreviewServer } from "@/components/component-preview-server";
import { InstallCommand } from "@/components/install-command";

export default function SkeletonPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Skeleton
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A placeholder for loading content.{" "}
                    <code>bg-palette-soft</code> (a role) +{" "}
                    <code>animate-pulse</code> (Tailwind's built-in, which
                    respects <code>prefers-reduced-motion</code> automatically).
                    The shape is controlled by the consumer via className.
                </p>
            </div>
            <InstallCommand name="skeleton" />
            <ComponentPreviewServer name="skeleton-demo">
                <SkeletonDemo />
            </ComponentPreviewServer>
        </div>
    );
}
