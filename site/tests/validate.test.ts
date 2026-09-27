import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LEVELS, THEMES } from "../../examples/gallery.ts";
import { PROJECT } from "../scripts/project.ts";
import {
    type DocsConfig,
    type ExportInput,
    type Manifest,
    validate,
} from "../scripts/validate.ts";

const ROOT = path.resolve(import.meta.dirname, "../..");

// The example list, imported by a path TypeScript does not follow: the list
// references the example files, which belong to the React app's typecheck
// (and its `#/` paths), not to this package's.
type ExampleMeta = Omit<Manifest["examples"][number], "files" | "registry">;
const LIST = path.join(ROOT, "examples/react/src/examples/index.ts");
const { examples } = (await import(LIST)) as {
    examples: Array<ExampleMeta & { load: unknown }>;
};

// ─── The real pages ─────────────────────────────────────────────────────────
// site/docs against the example list and the registry as they are in the
// sources — the same checks site:export runs on its output, without building
// anything, so a broken link or an unknown component fails `pnpm test`.

async function readPages(): Promise<Map<string, string>> {
    const docs = path.join(ROOT, "site", "docs");
    const pages = new Map<string, string>();
    for (const file of await readdir(docs, { recursive: true })) {
        if (!file.endsWith(".mdx")) continue;
        pages.set(
            file.slice(0, -4).split(path.sep).join("/"),
            await readFile(path.join(docs, file), "utf-8"),
        );
    }
    return pages;
}

describe("site/docs", () => {
    it("is a valid export with the real examples and registry", async () => {
        const registryJson = JSON.parse(
            await readFile(
                path.join(ROOT, "packages/registry/registry.json"),
                "utf-8",
            ),
        ) as {
            items: Array<{ name: string; registryDependencies?: string[] }>;
        };
        const manifest: Manifest = {
            files: Object.fromEntries(
                examples.map((e) => [
                    `${e.id}.tsx`,
                    { lang: "tsx", content: "" },
                ]),
            ),
            examples: examples.map(({ load: _load, ...meta }) => ({
                ...meta,
                files: [`${meta.id}.tsx`],
            })),
        };
        const problems = validate({
            project: PROJECT,
            config: JSON.parse(
                await readFile(
                    path.join(ROOT, "site/docs/config.json"),
                    "utf-8",
                ),
            ) as DocsConfig,
            pages: await readPages(),
            strayDocs: [],
            examples: {
                levels: [...LEVELS],
                themes: THEMES.map((t) => ({ ...t })),
            },
            embeds: new Map([["react", { hasIndex: true, manifest }]]),
            registry: {
                index: registryJson.items,
                items: new Map(registryJson.items.map((i) => [i.name, i])),
            },
        });
        expect(problems).toEqual([]);
    });

    it("has one example per component page, and uses every example", async () => {
        const pages = await readPages();
        const used = new Set(
            [...pages.values()].flatMap((source) =>
                [...source.matchAll(/<Example\s+id="([^"]+)"/g)].map(
                    ([, id]) => id,
                ),
            ),
        );
        expect([...used].sort()).toEqual(examples.map((e) => e.id).sort());
    });
});

// ─── The validator ──────────────────────────────────────────────────────────
// A minimal valid export, then one violation at a time.

function fixture(): ExportInput {
    const manifest: Manifest = {
        files: { "button.tsx": { lang: "tsx", content: "" } },
        examples: [
            {
                id: "button",
                title: "Button",
                description: "A button.",
                level: "atoms",
                order: 1,
                features: [],
                docs: "/docs/atoms/button#usage",
                layout: "flow",
                height: 200,
                files: ["button.tsx"],
                registry: ["button"],
            },
        ],
    };
    return {
        project: { ...PROJECT },
        config: {
            sections: [
                {
                    label: "Atoms",
                    pages: [
                        { label: "Button", path: "atoms/button" },
                        {
                            label: "Issues",
                            href: "https://github.com/fragiola/ui/issues",
                            external: true,
                        },
                    ],
                },
            ],
        },
        pages: new Map([
            [
                "index",
                `---\ntitle: "UI"\ndescription: "Landing."\nlayout: "landing"\n---\n\n<Hero title="UI" actions={[{ label: "Docs", href: "/docs/atoms/button" }]} />\n\n<Example id="button" variant="bleed" />\n`,
            ],
            [
                "atoms/button",
                `---\ntitle: "Button"\ndescription: "A button."\n---\n\n<InstallCommand item="button" />\n\n<Example id="button" />\n\n## Usage\n\nSee [usage](#usage), [the gallery](/examples/button) and [home](/).\n\n\`\`\`tsx title="button.tsx"\n<Button />\n\`\`\`\n\n<Callout type="warn" title="Note">Text.</Callout>\n\n<Cards>\n  <Card title="Usage" href="/docs/atoms/button#usage" />\n</Cards>\n`,
            ],
        ]),
        strayDocs: [],
        examples: {
            levels: [{ id: "atoms", title: "Atoms" }],
            themes: [
                { name: "light", title: "Light", scheme: "light" },
                { name: "dark", title: "Dark", scheme: "dark" },
            ],
        },
        embeds: new Map([["react", { hasIndex: true, manifest }]]),
        registry: {
            index: [{ name: "button" }, { name: "cn" }],
            items: new Map([
                [
                    "button",
                    { name: "button", registryDependencies: ["@fragiola/cn"] },
                ],
                ["cn", { name: "cn" }],
            ]),
        },
    };
}

function withPage(input: ExportInput, page: string, body: string) {
    input.pages.set(
        page,
        `---\ntitle: "T"\ndescription: "D."\n---\n\n${body}\n`,
    );
    return input;
}

const button = (body: string) => (i: ExportInput) =>
    withPage(i, "atoms/button", body);

describe("validate", () => {
    it("accepts a valid export", () => {
        expect(validate(fixture())).toEqual([]);
    });

    const cases: Array<[string, (i: ExportInput) => void, RegExp]> = [
        [
            "a contract mismatch",
            (i) => {
                i.project.contract = 0;
            },
            /contract 0/,
        ],
        [
            "a relative link",
            button("[x](../atoms/button.mdx)"),
            /relative links are not allowed/,
        ],
        [
            "a link to a missing page",
            button("[x](/docs/atoms/nope)"),
            /no page "atoms\/nope"/,
        ],
        [
            "a link to a missing anchor",
            button("## Usage\n\n[x](/docs/atoms/button#nope)"),
            /no heading "nope"/,
        ],
        [
            "a link to a missing example",
            button("[x](/examples/nope)"),
            /no example "nope"/,
        ],
        [
            "a link that is none of page, anchor, example",
            button("[x](/r/button.json)"),
            /not a page, an anchor or an example/,
        ],
        [
            "a component outside the vocabulary",
            button('<ComponentPreview name="x" />'),
            /<ComponentPreview> is not in the vocabulary/,
        ],
        [
            "raw HTML elements",
            button("<div>x</div>"),
            /<div> is not in the vocabulary/,
        ],
        [
            "an unknown prop",
            button('<Example id="button" name="x" />'),
            /has no prop "name"/,
        ],
        ["a missing required prop", button("<InstallCommand />"), /needs item/],
        [
            "a value outside an enum",
            button('<Callout type="tip">x</Callout>'),
            /one of info, warn, danger/,
        ],
        [
            "an example that is not in the manifest",
            button('<Example id="nope" />'),
            /<Example id="nope"> is not in the react manifest/,
        ],
        [
            "an example theme that does not exist",
            button('<Example id="button" theme="sepia" />'),
            /theme="sepia"> is not in examples.json/,
        ],
        [
            "an install command for a missing item",
            button('<InstallCommand item="nope" />'),
            /item="nope"> is not in r\//,
        ],
        [
            "a Card href that does not resolve",
            button('<Cards><Card title="x" href="/docs/nope" /></Cards>'),
            /<Card href="\/docs\/nope"> — no page/,
        ],
        [
            "a Hero outside the landing",
            button('<Hero title="x" />'),
            /belongs on the landing only/,
        ],
        [
            "a computed prop",
            button('<Example id="button" height={100 + 20} />'),
            /BinaryExpression is not a static value/,
        ],
        [
            "import statements",
            button('import { X } from "y"'),
            /import\/export is not allowed/,
        ],
        [
            "a code block without a language",
            button("```\nx\n```"),
            /a code block needs a language/,
        ],
        [
            "a missing description",
            (i) => {
                i.pages.set(
                    "atoms/button",
                    `---\ntitle: "Button"\n---\n\n<Example id="button" />\n\n## Usage\n`,
                );
            },
            /frontmatter "description" is missing/,
        ],
        [
            "a landing without layout: landing",
            (i) => {
                i.pages.set(
                    "index",
                    `---\ntitle: "UI"\ndescription: "D."\n---\n\nHi.\n`,
                );
            },
            /the landing needs layout: "landing"/,
        ],
        [
            "a page missing from config.json",
            (i) => {
                withPage(i, "atoms/extra", "Hi.");
            },
            /atoms\/extra.mdx is not listed/,
        ],
        [
            "a config.json page with no file",
            (i) => {
                i.config.sections[0]?.pages.push({ label: "X", path: "x/y" });
            },
            /"x\/y" has no x\/y.mdx/,
        ],
        [
            "a page listed twice",
            (i) => {
                i.config.sections[0]?.pages.push({
                    label: "Again",
                    path: "atoms/button",
                });
            },
            /listed 2 times/,
        ],
        [
            "a bare registry dependency",
            (i) => {
                i.registry?.items.set("button", {
                    name: "button",
                    registryDependencies: ["cn"],
                });
            },
            /"cn" is not namespaced/,
        ],
        [
            "a dangling namespaced dependency",
            (i) => {
                i.registry?.items.set("button", {
                    name: "button",
                    registryDependencies: ["@fragiola/nope"],
                });
            },
            /"@fragiola\/nope" does not exist/,
        ],
        [
            "a registry without a namespace",
            (i) => {
                i.project.registry = undefined;
            },
            /r\/ is present but registry.namespace is not/,
        ],
        [
            "a manifest level missing from examples.json",
            (i) => {
                const entry = i.embeds.get("react")?.manifest?.examples[0];
                if (entry) entry.level = "advanced";
            },
            /level "advanced" is not in examples.json/,
        ],
        [
            "a manifest docs link that does not resolve",
            (i) => {
                const entry = i.embeds.get("react")?.manifest?.examples[0];
                if (entry) entry.docs = "/docs/atoms/button#nope";
            },
            /no heading "nope" on atoms\/button/,
        ],
        [
            "a manifest file that is not in files",
            (i) => {
                const entry = i.embeds.get("react")?.manifest?.examples[0];
                if (entry) entry.files = ["other.tsx"];
            },
            /file "other.tsx" is not in files/,
        ],
        [
            "a framework without an embed app",
            (i) => {
                i.embeds.delete("react");
            },
            /embed\/react\/index.html is missing/,
        ],
        [
            "no light theme",
            (i) => {
                i.examples.themes = [
                    { name: "dark", title: "Dark", scheme: "dark" },
                ];
            },
            /no light theme/,
        ],
    ];

    it.each(cases)("rejects %s", (_, mutate, expected) => {
        const input = fixture();
        mutate(input);
        const problems = validate(input);
        expect(
            problems.some((p) => expected.test(p)),
            problems.join("\n"),
        ).toBe(true);
    });
});
