import { describe, expect, it } from "vitest";
import { rootTargetRefused } from "../scripts/targets.ts";

// `~/` targets the project root, outside src/: the build refuses it for
// everything but the static files under `~/public/` (Dockable's popout.html).

describe("registry file targets", () => {
    it("accepts placeholders and relative paths", () => {
        for (const target of [
            "@ui/dockable.tsx",
            "@components/families/dock.ts",
            "@lib/cn.ts",
            "styles/global.css",
            undefined,
        ]) {
            expect(rootTargetRefused(target), String(target)).toBe(false);
        }
    });

    it("accepts a static file under the root's public/", () => {
        expect(rootTargetRefused("~/public/popout.html")).toBe(false);
        expect(rootTargetRefused("~/public/dockable/popout.html")).toBe(false);
    });

    it("refuses every other root target", () => {
        for (const target of [
            "~/components/ui/x.tsx",
            "~/src/public/popout.html",
            "~/public-assets/popout.html",
            "~/publicpopout.html",
            "~/public/",
            "~/popout.html",
        ]) {
            expect(rootTargetRefused(target), target).toBe(true);
        }
    });
});
