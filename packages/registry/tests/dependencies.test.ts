import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
    ecosystemRangeProblems,
    splitDependency,
} from "../scripts/dependencies.ts";

// A special item pins its @fragiola package to the range this registry builds
// against: 0.x breaks between minors, and a bare name installs the newest.

const ROOT = path.resolve(import.meta.dirname, "..");
const read = (file: string) =>
    JSON.parse(readFileSync(path.join(ROOT, file), "utf-8"));

const PACKAGE_DEPENDENCIES = { "@fragiola/dockable-react": "^0.3.0" };

describe("splitDependency", () => {
    it("splits a scoped name from its range", () => {
        expect(splitDependency("@fragiola/dockable-react@^0.3.0")).toEqual({
            name: "@fragiola/dockable-react",
            range: "^0.3.0",
        });
        expect(splitDependency("zod@^4.0.0")).toEqual({
            name: "zod",
            range: "^4.0.0",
        });
    });

    it("leaves a bare name without a range", () => {
        expect(splitDependency("@fragiola/dockable-react")).toEqual({
            name: "@fragiola/dockable-react",
            range: undefined,
        });
        expect(splitDependency("lucide-react")).toEqual({
            name: "lucide-react",
            range: undefined,
        });
    });
});

describe("ecosystem package ranges", () => {
    it("accepts the range the registry builds against", () => {
        expect(
            ecosystemRangeProblems(
                {
                    name: "dockable",
                    dependencies: [
                        "@fragiola/dockable-react@^0.3.0",
                        "lucide-react",
                    ],
                },
                PACKAGE_DEPENDENCIES,
            ),
        ).toEqual([]);
    });

    it("refuses an ecosystem package without a range", () => {
        const problems = ecosystemRangeProblems(
            { name: "dockable", dependencies: ["@fragiola/dockable-react"] },
            PACKAGE_DEPENDENCIES,
        );
        expect(problems).toHaveLength(1);
        expect(problems[0]).toContain("without a range");
    });

    it("refuses a range that disagrees with package.json", () => {
        for (const dep of [
            "@fragiola/dockable-react@^0.1.0",
            "@fragiola/dockable-react@0.3.0",
            "@fragiola/tree-react@^0.1.0",
        ]) {
            expect(
                ecosystemRangeProblems(
                    { name: "x", dependencies: [dep] },
                    PACKAGE_DEPENDENCIES,
                ),
                dep,
            ).toHaveLength(1);
        }
    });

    it("leaves other packages alone", () => {
        expect(
            ecosystemRangeProblems(
                { name: "x", dependencies: ["tailwind-variants", "echarts"] },
                PACKAGE_DEPENDENCIES,
            ),
        ).toEqual([]);
    });

    it("holds for every item in registry.json", () => {
        const { items } = read("registry.json") as {
            items: Array<{ name: string; dependencies?: string[] }>;
        };
        const { dependencies } = read("package.json") as {
            dependencies: Record<string, string>;
        };
        expect(
            items.flatMap((item) => ecosystemRangeProblems(item, dependencies)),
        ).toEqual([]);
        // At least one special item exercises the rule.
        expect(
            items.some((item) =>
                item.dependencies?.some((dep) => dep.startsWith("@fragiola/")),
            ),
        ).toBe(true);
    });
});
