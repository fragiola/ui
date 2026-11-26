"use client";

import { ScrollArea } from "#/components/ui/scroll-area";
import { Separator } from "#/components/ui/separator";

// Two boxes that scroll natively — wheel, keys, touch, find in page — with
// thin scrollbars of their own, shown while the pointer is over the box or it
// scrolls: a release list that scrolls down, and a row of covers that
// scrolls sideways (and starts at the right in RTL). Each box names its
// viewport as a region, so a keyboard user can reach and scroll it.
const RELEASES = Array.from({ length: 40 }, (_, i) => `v1.${40 - i}.0`);

const COVERS = [
    { title: "Field notes", by: "Ana Ruiz" },
    { title: "Night trains", by: "Kenji Mori" },
    { title: "Salt and stone", by: "Lena Berg" },
    { title: "Open water", by: "Tomás Silva" },
    { title: "The long table", by: "Maya Cohen" },
    { title: "North light", by: "Iris Lund" },
];

export default function ScrollAreaDemo() {
    return (
        <div className="palette-surface flex flex-wrap items-start gap-6 bg-palette-base text-palette-contrast">
            <ScrollArea.Template.Simple
                aria-label="Releases"
                className="h-72 w-48 rounded-lg border border-palette-line"
            >
                <div className="p-4">
                    <h4 className="mb-4 text-sm font-medium">Releases</h4>
                    {RELEASES.map((release, i) => (
                        <div key={release}>
                            {i > 0 ? <Separator className="my-2" /> : null}
                            <div className="text-sm">{release}</div>
                        </div>
                    ))}
                </div>
            </ScrollArea.Template.Simple>

            <ScrollArea.Template.Simple
                aria-label="Covers"
                className="w-80 max-w-full rounded-lg border border-palette-line"
            >
                <div className="flex w-max gap-4 p-4">
                    {COVERS.map((cover) => (
                        <figure key={cover.title} className="w-32 shrink-0">
                            <div className="aspect-3/4 rounded-md bg-palette-line" />
                            <figcaption className="pt-2 text-xs text-palette-accent/85">
                                <span className="font-medium text-palette-contrast">
                                    {cover.title}
                                </span>{" "}
                                {cover.by}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </ScrollArea.Template.Simple>
        </div>
    );
}
