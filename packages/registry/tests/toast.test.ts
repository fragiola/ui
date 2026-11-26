import { describe, expect, it } from "vitest";
import { foundation } from "../registry/families/foundation";
import { toast } from "../registry/families/toast";
import { everyBase } from "./base-sources";

// ─── The toast family ───────────────────────────────────────────────────────
// The notification stack (Epic #166). Zero variants; the card is the
// foundation's overlay; the stack reads only what both bases set (the
// `--toast-*` variables and the state attributes), so a part never needs a
// base of its own to look right; and the status colour stays on the icon.

const classes = (member: () => string) => member().split(/\s+/).filter(Boolean);

describe("toast family", () => {
    it("has zero variants", () => {
        for (const member of Object.values(toast)) {
            expect(Object.keys(member.variants ?? {})).toEqual([]);
        }
    });

    it("the card is the overlay", () => {
        const root = classes(toast.root);
        for (const c of classes(foundation.overlay)) expect(root).toContain(c);
    });

    it("stacks from the variables both bases set", () => {
        const root = toast.root();
        for (const variable of [
            "--toast-index",
            "--toast-offset-y",
            "--toast-height",
            "--toast-frontmost-height",
            "--toast-swipe-movement-x",
            "--toast-swipe-movement-y",
        ]) {
            expect(root).toContain(`var(${variable}`);
        }
        expect(root).toContain("data-expanded:");
        expect(root).toContain("data-limited:opacity-0");
        expect(toast.content()).toContain("data-behind:opacity-0");
    });

    it("no member paints a status colour: the palette is the icon's class", () => {
        for (const member of Object.values(toast)) {
            expect(member()).not.toMatch(
                /palette-(?:green|blue|orange|purple|rose|danger)/,
            );
        }
    });

    it("every base renders the same parts with the family's members", async () => {
        for (const { label, source } of await everyBase("ui/toast.tsx")) {
            for (const member of Object.keys(toast)) {
                expect(source, label).toContain(`family.${member}()`);
            }
        }
    });
});
