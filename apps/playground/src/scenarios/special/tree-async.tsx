import type {
    AnnounceEvent,
    ItemOf,
    LoadChildren,
    TreeItemJson,
    TreeJson,
} from "@fragiola/tree-react";
import { asyncChildren } from "@fragiola/tree-react/async-children";
import { selection } from "@fragiola/tree-react/selection";
import { useRef } from "react";
import { Tree } from "#/components/ui/tree";

// Children loaded from a (fake, slow) server the first time a folder opens.
// "Photos" loads in a second and a half: its Loading row shows one level
// below it, the item says `aria-busy`. "Shared" fails the first time: the
// LoadError row (danger) shows with a Retry, the live region says why, and
// Retry loads it again — and succeeds. "Archive" loads an empty folder.

type Types = { items: { folder: undefined; file: undefined } };

const features = [selection(), asyncChildren()] as const;

const json: TreeJson<Types> = {
    version: 1,
    rootItemIds: ["photos", "shared", "archive"],
    items: {
        photos: { kind: "folder", label: "Photos", childrenStatus: "unloaded" },
        shared: { kind: "folder", label: "Shared", childrenStatus: "unloaded" },
        archive: {
            kind: "folder",
            label: "Archive",
            childrenStatus: "unloaded",
        },
    },
};

const wait = (ms: number, signal: AbortSignal) =>
    new Promise<void>((resolve, reject) => {
        const timer = setTimeout(resolve, ms);
        signal.addEventListener("abort", () => {
            clearTimeout(timer);
            reject(signal.reason);
        });
    });

const file = (label: string): TreeItemJson<Types> => ({ kind: "file", label });

const announce = (event: AnnounceEvent) =>
    event.type === "load-error"
        ? "Could not load this folder. Use Retry to try again."
        : undefined;

export default function TreeAsync() {
    const attempts = useRef(new Map<string, number>());
    const loadChildren: LoadChildren<Types> = async (item, { signal }) => {
        const attempt = (attempts.current.get(item.id) ?? 0) + 1;
        attempts.current.set(item.id, attempt);
        await wait(item.id === "photos" ? 1500 : 700, signal);
        if (item.id === "shared" && attempt === 1) {
            throw new Error("HTTP 503");
        }
        if (item.id === "archive") return [];
        return item.id === "photos"
            ? [file("beach.jpg"), file("city.jpg"), file("forest.jpg")]
            : [file("plan.pdf"), file("budget.xlsx")];
    };
    return (
        <div className="flex w-[20rem] max-w-full flex-col">
            <Tree.Root<Types, typeof features>
                defaultTree={json}
                features={features}
                loadChildren={loadChildren}
                announce={announce}
                aria-label="Cloud drive"
                className="rounded-lg border border-palette-line"
            >
                <Tree.Items<Types>>
                    {(item) => <DriveItem item={item} />}
                </Tree.Items>
                <Tree.LiveRegion />
            </Tree.Root>
        </div>
    );
}

function DriveItem({ item }: { item: ItemOf<Types> }) {
    return (
        <Tree.Item item={item} aria-label={item.label}>
            <Tree.ItemContent>
                <Tree.Toggle />
                <Tree.Label>{item.label}</Tree.Label>
            </Tree.ItemContent>
            <Tree.Loading />
            <Tree.LoadError>
                Could not load.
                <Tree.Retry item={item} />
            </Tree.LoadError>
            <Tree.Group<Types>>
                {(child) => <DriveItem item={child} />}
            </Tree.Group>
        </Tree.Item>
    );
}
