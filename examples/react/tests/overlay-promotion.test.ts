import { describe, expect, it } from "vitest";
import { armedRule, isHostMessage } from "../src/host/overlay-promotion.ts";

// The pure half of overlay promotion (contract v1.3 §5.4). The behaviour in
// a frame — held clicks, the promoted viewport, the exit animation — is
// checked by `pnpm check:embeds` in a real browser.

const geometry = {
    rect: { x: 40, y: 120.5, width: 720, height: 500 },
    viewport: { width: 1200, height: 900 },
};

describe("armedRule", () => {
    const rule = armedRule(geometry);

    it("matches only the promoted viewport", () => {
        expect(rule).toMatch(
            /^@media \(width: 1200px\) and \(height: 900px\) \{/,
        );
    });

    it("pins the stage to rect", () => {
        expect(rule).toContain("position: fixed;");
        expect(rule).toContain("left: 40px;");
        expect(rule).toContain("top: 120.5px;");
        expect(rule).toContain("width: 720px;");
        expect(rule).toContain("height: 500px;");
    });

    it("clears the root and paints the page's base under the stage only", () => {
        expect(rule).toContain("html, body { background: transparent; }");
        expect(rule).toContain("background-color: var(--palette-base);");
    });

    it("never uses !important", () => {
        expect(rule).not.toContain("!important");
    });
});

describe("isHostMessage", () => {
    it("accepts host, promote and promoted", () => {
        expect(
            isHostMessage({ type: "fragiola:example:host", overlay: true }),
        ).toBe(true);
        expect(
            isHostMessage({ type: "fragiola:example:promote", ...geometry }),
        ).toBe(true);
        expect(
            isHostMessage({ type: "fragiola:example:promoted", ...geometry }),
        ).toBe(true);
    });

    it("rejects a host without overlay support", () => {
        expect(isHostMessage({ type: "fragiola:example:host" })).toBe(false);
    });

    it("rejects a promotion with missing or non-finite geometry", () => {
        expect(isHostMessage({ type: "fragiola:example:promote" })).toBe(false);
        expect(
            isHostMessage({
                type: "fragiola:example:promoted",
                rect: { ...geometry.rect, x: Number.NaN },
                viewport: geometry.viewport,
            }),
        ).toBe(false);
    });

    it("rejects anything else", () => {
        expect(isHostMessage(null)).toBe(false);
        expect(isHostMessage("fragiola:example:host")).toBe(false);
        expect(
            isHostMessage({ type: "fragiola:example:theme", theme: "dark" }),
        ).toBe(false);
    });
});
