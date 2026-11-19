import {
    HardDriveIcon,
    ImageIcon,
    LandmarkIcon,
    PlusIcon,
    UploadIcon,
} from "lucide-react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Progress } from "#/components/ui/progress";
import { Separator } from "#/components/ui/separator";
import { Skeleton } from "#/components/ui/skeleton";
import { Card, Line, Stat, useTone } from "../card";

// Status: figures, meters, empty states and a loading card.

function Meter({
    label,
    value,
    of,
    percent,
}: {
    label: string;
    value: string;
    of: string;
    percent: number;
}) {
    const { action } = useTone();
    return (
        <div className="flex flex-col gap-2 rounded-md bg-palette-soft p-3">
            <span className="text-[10px] font-medium uppercase tracking-wide text-palette-accent/85">
                {label}
            </span>
            <span className="text-2xl font-semibold tabular-nums">{value}</span>
            <Progress.Root
                value={percent}
                aria-label={label}
                className={action}
            >
                <Progress.Track>
                    <Progress.Indicator />
                </Progress.Track>
            </Progress.Root>
            <div className="flex justify-between text-xs text-palette-accent/85">
                <span>{percent}% achieved</span>
                <span className="tabular-nums">{of}</span>
            </div>
        </div>
    );
}

export function SavingsTargets() {
    const { action } = useTone();
    return (
        <Card
            title="Savings targets"
            description="Active milestones for 2026"
            action={
                <Badge variant="outline" className={action}>
                    New goal
                </Badge>
            }
            footer={
                <span className="text-xs text-palette-accent/85">
                    You have not met your targets for this year.
                </span>
            }
        >
            <Meter
                label="Retirement"
                value="$420,000"
                of="$273,000"
                percent={65}
            />
            <Meter
                label="Real estate"
                value="$85,000"
                of="$27,200"
                percent={32}
            />
        </Card>
    );
}

export function ClaimableBalance() {
    const { action } = useTone();
    return (
        <Card
            title="Claimable balance"
            footer={
                <span className="text-xs text-palette-accent/85">
                    Once your bank is connected, balances over $10 are paid out
                    monthly.
                </span>
            }
        >
            <span className="text-4xl font-semibold tabular-nums">$0.00</span>
            <Badge variant="soft" className="palette-orange w-fit">
                Pending setup
            </Badge>
            <div className="flex flex-col gap-2 rounded-md border border-palette-line p-3">
                <Line label="Net royalties" value="$0.00" />
                <Line label="Processing fee" value="−$0.00" />
                <Separator />
                <Line label="Total ready to claim" value="$0.00 USD" />
            </div>
            <Clickable.Button className={action} size="sm">
                Connect a bank
            </Clickable.Button>
        </Card>
    );
}

export function CardBalance() {
    const { action } = useTone();
    return (
        <div className="grid grid-cols-2 gap-4">
            <Card>
                <Stat
                    label="Card balance"
                    value="$12.94"
                    hint="$11,337.06 available"
                />
            </Card>
            <Card>
                <Stat label="Payment due" value="1 Apr" />
                <Clickable.Button className={action} size="sm">
                    Pay early
                </Clickable.Button>
            </Card>
        </div>
    );
}

export function StorageUsage() {
    const { action } = useTone();
    return (
        <Card
            title="Storage"
            description="62 of 100 GB used"
            action={
                <HardDriveIcon className="size-icon text-palette-accent/85" />
            }
            footer={
                <Clickable.Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                >
                    Manage storage
                </Clickable.Button>
            }
        >
            <Progress.Root
                value={62}
                aria-label="Storage used"
                className={action}
            >
                <Progress.Track>
                    <Progress.Indicator />
                </Progress.Track>
            </Progress.Root>
            <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                    ["Photos", "28 GB"],
                    ["Documents", "21 GB"],
                    ["Backups", "13 GB"],
                ].map(([label, size]) => (
                    <div key={label} className="flex flex-col">
                        <span className="text-palette-accent/85">{label}</span>
                        <span className="font-medium tabular-nums">{size}</span>
                    </div>
                ))}
            </div>
        </Card>
    );
}

export function LoadingCard() {
    return (
        <Card title="Loading" description="A card while its data arrives.">
            <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                    <Skeleton className="h-3 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-28 w-full rounded-lg" />
            <Skeleton className="h-3 w-5/6" />
            <Skeleton className="h-3 w-4/6" />
        </Card>
    );
}

function Empty({
    icon: Icon,
    title,
    text,
    action,
}: {
    icon: typeof PlusIcon;
    title: string;
    text: string;
    action: string;
}) {
    const tone = useTone();
    return (
        <Card>
            <div className="flex flex-col items-center gap-2 py-4 text-center">
                <span className="grid size-10 place-content-center rounded-md border border-palette-line">
                    <Icon className="size-icon" />
                </span>
                <span className="text-sm font-semibold">{title}</span>
                <span className="max-w-60 text-xs text-palette-accent/85">
                    {text}
                </span>
                <Clickable.Button className={`${tone.action} mt-2`} size="sm">
                    {action}
                </Clickable.Button>
            </div>
        </Card>
    );
}

export function DistributeTrack() {
    return (
        <Empty
            icon={PlusIcon}
            title="Distribute a track"
            text="Upload your first master to reach listeners on every platform."
            action="Create release"
        />
    );
}

export function ConnectBank() {
    return (
        <Empty
            icon={LandmarkIcon}
            title="Connect a bank"
            text="Link a payout method to receive monthly distributions automatically."
            action="Set up payouts"
        />
    );
}

export function CoverArt() {
    return (
        <Card title="Cover art" description="3000 × 3000 px, JPG or PNG">
            <div className="flex aspect-square flex-col items-center justify-center gap-3 rounded-md border border-dashed border-palette-line text-center">
                <ImageIcon className="size-icon-lg text-palette-accent/85" />
                <span className="text-xs text-palette-accent/85">
                    Drop an image here
                </span>
                <Clickable.Button variant="outline" size="sm">
                    <UploadIcon />
                    Choose file
                </Clickable.Button>
            </div>
        </Card>
    );
}
