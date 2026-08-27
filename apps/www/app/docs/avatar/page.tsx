import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function AvatarPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Avatar
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A profile picture with a fallback. Uses Base UI's primitive
                    for the loading-status state machine. No family — just
                    palette roles and layout. Size is controlled by the consumer
                    via className (default <code>size-10</code>).
                </p>
            </div>
            <InstallCommand name="avatar" />
            <ComponentPreview name="avatar-demo" />
        </div>
    );
}
