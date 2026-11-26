import {
    BellIcon,
    CheckIcon,
    LockIcon,
    ShieldCheckIcon,
    UsersIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { FeaturedIcon } from "#/components/ui/featured-icon";

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

const FEATURES = [
    {
        icon: <UsersIcon />,
        title: "Shared workspaces",
        text: "Invite your team and work on the same projects.",
    },
    {
        icon: <LockIcon />,
        title: "Single sign-on",
        text: "Members sign in with your identity provider.",
    },
    {
        icon: <BellIcon />,
        title: "Activity alerts",
        text: "Hear about changes as soon as they happen.",
    },
] as const;

// A plan's feature list, in the default look: each feature led by a
// featured icon, a circle in the floor's soft tint with the icon in its
// accent. It is decorative (the text says what it means). Then a larger one
// set by a class, and last the same icon in each chromatic palette: the
// colour is the palette class on the icon, there is no colour variant.
export default function FeaturedIconDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-6 bg-palette-base text-palette-contrast">
            <ul className="flex max-w-md flex-col gap-4">
                {FEATURES.map((feature) => (
                    <li key={feature.title} className="flex gap-3">
                        <FeaturedIcon>{feature.icon}</FeaturedIcon>
                        <div className="flex flex-col gap-0.5 text-sm">
                            <span className="font-medium">{feature.title}</span>
                            <span className="text-palette-accent/85">
                                {feature.text}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>

            <Row label="size-14">
                <FeaturedIcon className="size-14">
                    <ShieldCheckIcon />
                </FeaturedIcon>
            </Row>

            {/* the same icon, only its palette-* class changed */}
            <Row label="palettes">
                {CHROMATIC.map((palette) => (
                    <FeaturedIcon
                        key={palette}
                        role="img"
                        aria-label={palette}
                        className={`palette-${palette}`}
                    >
                        <CheckIcon />
                    </FeaturedIcon>
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
