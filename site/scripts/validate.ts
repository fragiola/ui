import { existsSync } from "node:fs";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import type { Expression } from "estree";
import GithubSlugger from "github-slugger";
import type { Nodes, Root } from "mdast";
import { toString as textOf } from "mdast-util-to-string";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { parse as parseYaml } from "yaml";

// Checks a site export against the contract (v1.1, ../www/CONTRACT.md) — the
// same things `www` checks on every build (§8), so a violation fails here,
// in this repo, instead of in the site's deploy:
//
//   project.json     contract version, frameworks, registry namespace ⇔ r/,
//                    repository
//   docs/            config.json ⇔ files (and collapsible sections),
//                    frontmatter, vocabulary, props and nesting, code fences,
//                    links (pages, anchors, examples, hero actions),
//                    `<Example id>`, `<InstallCommand item>`
//   examples.json    levels, themes
//   embed/<fw>/      index.html, manifest.json: ids, levels, files, docs
//                    links, registry items
//   r/               index ⇔ files, namespaced dependencies, duplicates
//
// `validateExport(dir)` reads an export from disk; `validate(input)` takes
// it in memory, which is what the tests use. Both return the problems found,
// one line each; empty means the export is valid.
//
// v1.1 is additive and keeps `"contract": 1` (CONTRACT.md, "Changes in
// v1.1"), so CONTRACT stays 1 while the vocabulary is v1.1's.

export const CONTRACT = 1;

// ─── Shapes ─────────────────────────────────────────────────────────────────

export type ProjectJson = {
    contract: number;
    slug: string;
    title: string;
    description: string;
    frameworks: string[];
    defaultFramework: string;
    registry?: { namespace: string };
    /** v1.1: the header and footer links. */
    repository?: string;
    /** v1.2: topics for the project's structured data only. */
    keywords?: string[];
};

type ConfigPage =
    | { label: string; path: string }
    | { label: string; href: string; external: true };

export type DocsConfig = {
    sections: Array<{
        label: string;
        framework?: string;
        /** v1.1: a folder that folds; `defaultOpen` opens it on load. */
        collapsible?: boolean;
        defaultOpen?: boolean;
        pages: ConfigPage[];
    }>;
};

export type ExamplesJson = {
    levels: Array<{ id: string; title: string }>;
    themes: Array<{
        name: string;
        title: string;
        description?: string;
        scheme: string;
        swatch?: string[];
        file?: { path: string; lang: string; content: string };
    }>;
};

export type ManifestEntry = {
    id: string;
    title: string;
    description: string;
    level: string;
    order: number;
    features: string[];
    docs?: string;
    layout: string;
    height?: number;
    files: string[];
    registry?: string[];
    packages?: string[];
};

export type Manifest = {
    files: Record<string, { lang: string; content: string; shared?: boolean }>;
    examples: ManifestEntry[];
};

export type RegistryItem = { name: string; registryDependencies?: string[] };

export type ExportInput = {
    project: ProjectJson;
    config: DocsConfig;
    /** Page path (file path without `.mdx`, `/`-separated) → source. */
    pages: Map<string, string>;
    /** Anything under docs/ that is neither a page nor config.json. */
    strayDocs: string[];
    examples: ExamplesJson;
    /** Framework → its embed app: whether index.html exists, its manifest. */
    embeds: Map<string, { hasIndex: boolean; manifest: Manifest | null }>;
    /** Present when the export has r/: the index and every item file. */
    registry: {
        index: RegistryItem[];
        items: Map<string, RegistryItem>;
    } | null;
};

// ─── The vocabulary (§3.4) ──────────────────────────────────────────────────

type PropKind = "string" | "number" | "boolean" | "array";
type ComponentSpec = {
    required?: Record<string, PropKind>;
    optional?: Record<string, PropKind>;
    enums?: Record<string, readonly (string | number)[]>;
    landingOnly?: boolean;
    /** The only component this one may sit directly inside. */
    parent?: string;
};

export const VOCABULARY: Record<string, ComponentSpec> = {
    Example: {
        required: { id: "string" },
        optional: {
            framework: "string",
            theme: "string",
            height: "number",
            variant: "string",
            label: "string",
        },
        enums: { variant: ["inline", "bleed", "card", "showcase"] },
    },
    Callout: {
        required: { type: "string" },
        optional: { title: "string" },
        enums: { type: ["info", "warn", "danger"] },
    },
    Tabs: { required: { items: "array" } },
    Tab: { required: { value: "string" }, parent: "Tabs" },
    Steps: {},
    Step: { parent: "Steps" },
    Cards: {},
    Card: {
        required: { title: "string", href: "string" },
        optional: { description: "string" },
        parent: "Cards",
    },
    InstallCommand: { required: { item: "string" } },
    Framework: { required: { name: "string" } },
    Hero: {
        required: { title: "string" },
        optional: {
            description: "string",
            eyebrow: "string",
            background: "string",
            actions: "array",
        },
        enums: { background: ["none", "grid"] },
        landingOnly: true,
    },
    Section: {
        required: { title: "string" },
        optional: { eyebrow: "string", description: "string" },
        landingOnly: true,
    },
    Features: {
        optional: { columns: "number", numbered: "boolean" },
        enums: { columns: [2, 3, 4] },
        landingOnly: true,
    },
    Feature: {
        required: { title: "string" },
        landingOnly: true,
        parent: "Features",
    },
    Pills: {
        required: { items: "array" },
        optional: { strike: "boolean" },
        landingOnly: true,
    },
};

/** `Action` (§3.4): the buttons of a `<Hero>`. */
const ACTION_VARIANTS = ["primary", "secondary", "ghost"];
const ACTION_ICONS = ["arrow", "external"];

const FRONTMATTER_KEYS = new Set(["title", "description", "layout"]);

// ─── MDX ────────────────────────────────────────────────────────────────────

const parser = unified().use(remarkParse).use(remarkMdx).use(remarkGfm);

type Page = {
    frontmatter: Record<string, unknown> | null;
    tree: Root | null;
    /** Lines taken by the frontmatter, to report body positions in the file. */
    offset: number;
    error?: string;
};

function parsePage(source: string): Page {
    const match = source.match(/^---\n([\s\S]*?)\n---\n/);
    let frontmatter: Record<string, unknown> | null = null;
    let offset = 0;
    let body = source;
    if (match) {
        offset = match[0].split("\n").length - 1;
        body = source.slice(match[0].length);
        try {
            const parsed = parseYaml(match[1] ?? "");
            if (parsed && typeof parsed === "object") {
                frontmatter = parsed as Record<string, unknown>;
            }
        } catch (error) {
            return {
                frontmatter: null,
                tree: null,
                offset,
                error: `frontmatter is not YAML (${(error as Error).message})`,
            };
        }
    }
    try {
        return { frontmatter, tree: parser.parse(body) as Root, offset };
    } catch (error) {
        return {
            frontmatter,
            tree: null,
            offset,
            error: `not valid MDX (${(error as Error).message})`,
        };
    }
}

/** Heading anchors, as Fumadocs generates them (github-slugger over text). */
function anchorsOf(tree: Root): Set<string> {
    const slugger = new GithubSlugger();
    const anchors = new Set<string>();
    visit(tree, "heading", (node) => {
        anchors.add(slugger.slug(textOf(node)));
    });
    return anchors;
}

/**
 * The value of an attribute expression, when it is a plain literal: arrays,
 * objects, strings, numbers, booleans. Anything computed is rejected — a
 * page is data, not code.
 */
function staticValue(node: Expression): unknown {
    switch (node.type) {
        case "Literal":
            return node.value;
        case "TemplateLiteral":
            if (node.expressions.length === 0) {
                return node.quasis.map((q) => q.value.cooked).join("");
            }
            break;
        case "UnaryExpression":
            if (node.operator === "-" && node.argument.type === "Literal") {
                return -(node.argument.value as number);
            }
            break;
        case "ArrayExpression":
            return node.elements.map((element) => {
                if (!element || element.type === "SpreadElement") {
                    throw new Error("holes and spreads are not static");
                }
                return staticValue(element);
            });
        case "ObjectExpression": {
            const object: Record<string, unknown> = {};
            for (const property of node.properties) {
                if (
                    property.type !== "Property" ||
                    property.computed ||
                    property.kind !== "init"
                ) {
                    throw new Error("only plain properties are static");
                }
                const key =
                    property.key.type === "Identifier"
                        ? property.key.name
                        : String((property.key as { value: unknown }).value);
                object[key] = staticValue(property.value as Expression);
            }
            return object;
        }
    }
    throw new Error(`${node.type} is not a static value`);
}

type Attribute = { name: string; value: unknown };

type JsxNode = Extract<
    Nodes,
    { type: "mdxJsxFlowElement" | "mdxJsxTextElement" }
>;

function attributesOf(node: JsxNode, report: (p: string) => void) {
    const attributes: Attribute[] = [];
    for (const attribute of node.attributes) {
        if (attribute.type !== "mdxJsxAttribute") {
            report("spread attributes are not allowed");
            continue;
        }
        const raw = attribute.value;
        if (raw === null || raw === undefined) {
            attributes.push({ name: attribute.name, value: true });
        } else if (typeof raw === "string") {
            attributes.push({ name: attribute.name, value: raw });
        } else {
            const statement = raw.data?.estree?.body[0];
            if (statement?.type !== "ExpressionStatement") {
                report(`${attribute.name}={…} is not an expression`);
                continue;
            }
            try {
                attributes.push({
                    name: attribute.name,
                    value: staticValue(statement.expression),
                });
            } catch (error) {
                report(`${attribute.name}={…}: ${(error as Error).message}`);
            }
        }
    }
    return attributes;
}

// ─── Validation ─────────────────────────────────────────────────────────────

const EXTERNAL = /^[a-z][a-z0-9+.-]*:|^\/\//i;

export function validate(input: ExportInput): string[] {
    const problems: string[] = [];
    const { project, config, examples, embeds, registry } = input;

    // project.json
    if (project.contract !== CONTRACT) {
        problems.push(
            `project.json: contract ${project.contract}, this export implements ${CONTRACT}`,
        );
    }
    for (const key of ["slug", "title", "description"] as const) {
        if (typeof project[key] !== "string" || !project[key]) {
            problems.push(`project.json: "${key}" is missing`);
        }
    }
    if (!Array.isArray(project.frameworks) || project.frameworks.length === 0) {
        problems.push("project.json: no frameworks");
    } else if (!project.frameworks.includes(project.defaultFramework)) {
        problems.push(
            `project.json: defaultFramework "${project.defaultFramework}" is not in frameworks`,
        );
    }
    if (registry && !project.registry) {
        problems.push(
            "project.json: r/ is present but registry.namespace is not",
        );
    }
    if (!registry && project.registry) {
        problems.push(
            "project.json: registry.namespace is set but r/ is missing",
        );
    }
    if (
        project.repository !== undefined &&
        !/^https:\/\/\S+$/.test(project.repository)
    ) {
        problems.push(
            `project.json: repository "${project.repository}" is not an https:// URL`,
        );
    }
    const namespace = project.registry?.namespace;
    if (namespace !== undefined && !/^@[a-z0-9][a-z0-9-]*$/.test(namespace)) {
        problems.push(
            `project.json: registry.namespace "${namespace}" is not @name`,
        );
    }

    // r/
    const itemNames = new Set<string>();
    if (registry) {
        for (const item of registry.index) {
            if (itemNames.has(item.name)) {
                problems.push(`r/index.json: "${item.name}" is listed twice`);
            }
            itemNames.add(item.name);
            if (!registry.items.has(item.name)) {
                problems.push(
                    `r/index.json: "${item.name}" has no r/${item.name}.json`,
                );
            }
        }
        for (const [name, item] of registry.items) {
            if (!itemNames.has(name)) {
                problems.push(`r/${name}.json is not listed in r/index.json`);
            }
            for (const dep of item.registryDependencies ?? []) {
                if (/^https?:\/\//.test(dep)) continue;
                const match = dep.match(/^(@[a-z0-9][a-z0-9-]*)\/(.+)$/);
                if (!match) {
                    problems.push(
                        `r/${name}.json: dependency "${dep}" is not namespaced (§7)`,
                    );
                } else if (
                    match[1] === namespace &&
                    !itemNames.has(match[2] ?? "")
                ) {
                    problems.push(
                        `r/${name}.json: dependency "${dep}" does not exist`,
                    );
                }
            }
        }
    }

    // examples.json
    const levels = new Set<string>();
    for (const level of examples.levels ?? []) {
        if (!level.id || !level.title) {
            problems.push("examples.json: a level needs an id and a title");
        }
        if (levels.has(level.id)) {
            problems.push(
                `examples.json: level "${level.id}" is declared twice`,
            );
        }
        levels.add(level.id);
    }
    if (levels.size === 0) problems.push("examples.json: no levels");
    const themes = new Set<string>();
    for (const theme of examples.themes ?? []) {
        if (!theme.name || !theme.title) {
            problems.push("examples.json: a theme needs a name and a title");
        }
        if (themes.has(theme.name)) {
            problems.push(
                `examples.json: theme "${theme.name}" is declared twice`,
            );
        }
        themes.add(theme.name);
        if (theme.scheme !== "light" && theme.scheme !== "dark") {
            problems.push(
                `examples.json: theme "${theme.name}" has scheme "${theme.scheme}"`,
            );
        }
    }
    if (!examples.themes?.some((t) => t.scheme === "light")) {
        problems.push("examples.json: no light theme (the default, §5.1)");
    }

    // Pages: parse once; anchors are needed before links are checked.
    const pages = new Map<string, Page>();
    for (const [pagePath, source] of input.pages) {
        pages.set(pagePath, parsePage(source));
    }
    const anchors = new Map<string, Set<string>>();
    for (const [pagePath, page] of pages) {
        if (page.tree) anchors.set(pagePath, anchorsOf(page.tree));
    }

    // Example ids, per framework and across all.
    const exampleIds = new Map<string, Set<string>>();
    const allExampleIds = new Set<string>();
    for (const [framework, embed] of embeds) {
        const ids = new Set(embed.manifest?.examples.map((e) => e.id) ?? []);
        exampleIds.set(framework, ids);
        for (const id of ids) allExampleIds.add(id);
    }

    /** A base-free link (§3.3): what is wrong with it, or null. */
    function linkProblem(url: string, from: string | null): string | null {
        if (EXTERNAL.test(url)) return null;
        if (url.startsWith("#")) {
            if (from === null) return "an anchor-only link has no page";
            return anchors.get(from)?.has(url.slice(1))
                ? null
                : `no heading "${url.slice(1)}" on this page`;
        }
        if (!url.startsWith("/")) {
            return "relative links are not allowed (§3.3); write /docs/…";
        }
        const [pathname = "", anchor] = url.split("#", 2);
        if (pathname === "/")
            return anchor ? "the landing has no anchors" : null;
        if (pathname === "/examples") {
            return allExampleIds.size > 0 ? null : "there are no examples";
        }
        const example = pathname.match(/^\/examples\/([^/]+)$/);
        if (example) {
            return allExampleIds.has(example[1] ?? "")
                ? null
                : `no example "${example[1]}"`;
        }
        const doc = pathname.match(/^\/docs\/(.+)$/);
        if (doc) {
            const target = doc[1] ?? "";
            if (target === "index" || !input.pages.has(target)) {
                return `no page "${target}"`;
            }
            if (anchor !== undefined && !anchors.get(target)?.has(anchor)) {
                return `no heading "${anchor}" on ${target}`;
            }
            return null;
        }
        return "not a page, an anchor or an example (§3.3)";
    }

    // docs/config.json
    const listed = new Map<string, number>();
    for (const section of config.sections ?? []) {
        if (!section.label)
            problems.push("config.json: a section has no label");
        if (
            section.framework &&
            !project.frameworks?.includes(section.framework)
        ) {
            problems.push(
                `config.json: section "${section.label}" names framework "${section.framework}"`,
            );
        }
        for (const key of ["collapsible", "defaultOpen"] as const) {
            if (
                section[key] !== undefined &&
                typeof section[key] !== "boolean"
            ) {
                problems.push(
                    `config.json: section "${section.label}" ${key} must be a boolean`,
                );
            }
        }
        if (section.defaultOpen !== undefined && !section.collapsible) {
            problems.push(
                `config.json: section "${section.label}" has defaultOpen but is not collapsible`,
            );
        }
        for (const page of section.pages ?? []) {
            if (!page.label) {
                problems.push(
                    `config.json: a page in "${section.label}" has no label`,
                );
            }
            if ("href" in page) {
                if (!page.external || !EXTERNAL.test(page.href)) {
                    problems.push(
                        `config.json: "${page.label}" has an href that is not an external link`,
                    );
                }
                continue;
            }
            listed.set(page.path, (listed.get(page.path) ?? 0) + 1);
            if (page.path === "index") {
                problems.push(
                    "config.json: index is the landing, not a sidebar page",
                );
            } else if (!input.pages.has(page.path)) {
                problems.push(
                    `config.json: "${page.path}" has no ${page.path}.mdx`,
                );
            }
        }
    }
    for (const [pagePath, count] of listed) {
        if (count > 1) {
            problems.push(
                `config.json: "${pagePath}" is listed ${count} times`,
            );
        }
    }
    for (const pagePath of input.pages.keys()) {
        if (pagePath !== "index" && !listed.has(pagePath)) {
            problems.push(`docs/${pagePath}.mdx is not listed in config.json`);
        }
    }
    if (!input.pages.has("index"))
        problems.push("docs/index.mdx is missing (§3.5)");
    for (const stray of input.strayDocs) {
        problems.push(
            `docs/${stray}: only .mdx pages and config.json belong in docs/`,
        );
    }

    // Pages
    for (const [pagePath, page] of pages) {
        const file = `docs/${pagePath}.mdx`;
        const at = (node: { position?: { start: { line: number } } }) =>
            node.position
                ? `${file}:${node.position.start.line + page.offset}`
                : file;
        if (page.error) {
            problems.push(`${file}: ${page.error}`);
            continue;
        }
        const fm = page.frontmatter;
        if (!fm) {
            problems.push(`${file}: no frontmatter`);
        } else {
            for (const key of ["title", "description"]) {
                if (
                    typeof fm[key] !== "string" ||
                    !(fm[key] as string).trim()
                ) {
                    problems.push(`${file}: frontmatter "${key}" is missing`);
                }
            }
            for (const key of Object.keys(fm)) {
                if (!FRONTMATTER_KEYS.has(key)) {
                    problems.push(`${file}: unknown frontmatter "${key}"`);
                }
            }
            if (pagePath === "index" && fm.layout !== "landing") {
                problems.push(`${file}: the landing needs layout: "landing"`);
            }
            if (pagePath !== "index" && fm.layout !== undefined) {
                problems.push(`${file}: layout is only for index.mdx`);
            }
        }
        const tree = page.tree;
        if (!tree) continue;

        // Parents, recorded on the way down: a component written on one line
        // parses as inline, inside a paragraph, and its container is the
        // paragraph's parent.
        const parents = new WeakMap<Nodes, Nodes>();
        visit(tree, (node: Nodes, _index, parent) => {
            if (parent) parents.set(node, parent as Nodes);
            switch (node.type) {
                case "mdxjsEsm":
                    problems.push(`${at(node)}: import/export is not allowed`);
                    return;
                case "mdxFlowExpression":
                case "mdxTextExpression":
                    // `{/* comments */}` are fine; anything evaluated is not.
                    if ((node.data?.estree?.body.length ?? 0) > 0) {
                        problems.push(
                            `${at(node)}: {expressions} are not allowed`,
                        );
                    }
                    return;
                case "html":
                    problems.push(`${at(node)}: raw HTML is not allowed`);
                    return;
                case "code":
                    if (!node.lang) {
                        problems.push(
                            `${at(node)}: a code block needs a language`,
                        );
                    }
                    if (
                        node.meta &&
                        !/^title="[^"]*"$/.test(node.meta.trim())
                    ) {
                        problems.push(
                            `${at(node)}: code block meta "${node.meta}" — only title="…"`,
                        );
                    }
                    return;
                case "link":
                case "definition": {
                    const problem = linkProblem(node.url, pagePath);
                    if (problem)
                        problems.push(`${at(node)}: ${node.url} — ${problem}`);
                    return;
                }
                case "image":
                    if (!EXTERNAL.test(node.url)) {
                        problems.push(
                            `${at(node)}: image ${node.url} must be absolute`,
                        );
                    }
                    return;
                case "mdxJsxFlowElement":
                case "mdxJsxTextElement":
                    checkElement(
                        node,
                        parent?.type === "paragraph"
                            ? parents.get(parent as Nodes)
                            : (parent as Nodes | undefined),
                        pagePath,
                        at(node),
                    );
                    return;
            }
        });
    }

    function checkElement(
        node: JsxNode,
        parent: Nodes | undefined,
        pagePath: string,
        where: string,
    ) {
        const name = node.name;
        const spec = name ? VOCABULARY[name] : undefined;
        if (!name || !spec) {
            problems.push(
                `${where}: <${name ?? ""}> is not in the vocabulary (§3.4)`,
            );
            return;
        }
        if (spec.landingOnly && pagePath !== "index") {
            problems.push(`${where}: <${name}> belongs on the landing only`);
        }
        if (spec.parent) {
            const parentName =
                parent?.type === "mdxJsxFlowElement" ||
                parent?.type === "mdxJsxTextElement"
                    ? parent.name
                    : null;
            if (parentName !== spec.parent) {
                problems.push(
                    `${where}: <${name}> belongs inside <${spec.parent}>`,
                );
            }
        }
        const attributes = attributesOf(node, (p) =>
            problems.push(`${where}: <${name}> ${p}`),
        );
        const props = new Map(attributes.map((a) => [a.name, a.value]));
        const kinds = { ...spec.required, ...spec.optional };
        for (const required of Object.keys(spec.required ?? {})) {
            if (!props.has(required)) {
                problems.push(`${where}: <${name}> needs ${required}`);
            }
        }
        for (const [prop, value] of props) {
            const kind = kinds[prop];
            if (!kind) {
                problems.push(`${where}: <${name}> has no prop "${prop}"`);
                continue;
            }
            const ok =
                kind === "array" ? Array.isArray(value) : typeof value === kind;
            if (!ok) {
                problems.push(`${where}: <${name} ${prop}> must be a ${kind}`);
                continue;
            }
            const allowed = spec.enums?.[prop];
            if (allowed && !allowed.includes(value as string | number)) {
                problems.push(
                    `${where}: <${name} ${prop}="${value}"> — one of ${allowed.join(", ")}`,
                );
            }
        }

        const text = (prop: string) =>
            typeof props.get(prop) === "string"
                ? (props.get(prop) as string)
                : undefined;
        switch (name) {
            case "Example": {
                const id = text("id");
                const framework = text("framework");
                if (framework && !project.frameworks?.includes(framework)) {
                    problems.push(
                        `${where}: <Example framework="${framework}"> is not a framework`,
                    );
                }
                const ids = framework
                    ? exampleIds.get(framework)
                    : exampleIds.get(project.defaultFramework);
                if (id && !ids?.has(id)) {
                    problems.push(
                        `${where}: <Example id="${id}"> is not in the ${framework ?? project.defaultFramework} manifest`,
                    );
                }
                const theme = text("theme");
                if (theme && !themes.has(theme)) {
                    problems.push(
                        `${where}: <Example theme="${theme}"> is not in examples.json`,
                    );
                }
                if (props.has("label") && text("variant") !== "showcase") {
                    problems.push(
                        `${where}: <Example label> is only for variant="showcase"`,
                    );
                }
                break;
            }
            case "InstallCommand": {
                const item = text("item");
                if (!registry) {
                    problems.push(`${where}: <InstallCommand> without r/`);
                } else if (item && !itemNames.has(item)) {
                    problems.push(
                        `${where}: <InstallCommand item="${item}"> is not in r/`,
                    );
                }
                break;
            }
            case "Framework": {
                const framework = text("name");
                if (framework && !project.frameworks?.includes(framework)) {
                    problems.push(
                        `${where}: <Framework name="${framework}"> is not a framework`,
                    );
                }
                break;
            }
            case "Card": {
                const href = text("href");
                const problem = href && linkProblem(href, pagePath);
                if (problem)
                    problems.push(
                        `${where}: <Card href="${href}"> — ${problem}`,
                    );
                break;
            }
            case "Tabs":
            case "Pills": {
                const items = props.get("items");
                if (
                    Array.isArray(items) &&
                    !items.every((i) => typeof i === "string")
                ) {
                    problems.push(`${where}: <${name} items> must be strings`);
                }
                break;
            }
            case "Hero": {
                const actions = props.get("actions");
                if (!Array.isArray(actions)) break;
                for (const action of actions) {
                    const { label, href, variant, icon, ...rest } = (action ??
                        {}) as Record<string, unknown>;
                    if (typeof label !== "string" || typeof href !== "string") {
                        problems.push(
                            `${where}: <Hero actions> are { label, href, variant?, icon? }`,
                        );
                        continue;
                    }
                    for (const key of Object.keys(rest)) {
                        problems.push(
                            `${where}: <Hero> action "${label}" has no "${key}"`,
                        );
                    }
                    if (
                        variant !== undefined &&
                        !ACTION_VARIANTS.includes(variant as string)
                    ) {
                        problems.push(
                            `${where}: <Hero> action "${label}" variant "${variant}" — one of ${ACTION_VARIANTS.join(", ")}`,
                        );
                    }
                    if (
                        icon !== undefined &&
                        !ACTION_ICONS.includes(icon as string)
                    ) {
                        problems.push(
                            `${where}: <Hero> action "${label}" icon "${icon}" — one of ${ACTION_ICONS.join(", ")}`,
                        );
                    }
                    const token = label.match(/\{([^}]*)\}/g) ?? [];
                    for (const t of token) {
                        if (t !== "{examples}") {
                            problems.push(
                                `${where}: <Hero> action "${label}" — the only token is {examples}`,
                            );
                        } else if (allExampleIds.size === 0) {
                            problems.push(
                                `${where}: <Hero> action "${label}" counts examples, and there are none`,
                            );
                        }
                    }
                    const problem = linkProblem(href, pagePath);
                    if (problem)
                        problems.push(
                            `${where}: <Hero> action ${href} — ${problem}`,
                        );
                }
                break;
            }
        }
    }

    // embed/<fw>/ and manifests
    for (const framework of project.frameworks ?? []) {
        const embed = embeds.get(framework);
        if (!embed?.hasIndex)
            problems.push(`embed/${framework}/index.html is missing`);
        if (!embed?.manifest) {
            problems.push(`embed/${framework}/manifest.json is missing`);
            continue;
        }
        const where = `embed/${framework}/manifest.json`;
        const { files, examples: entries } = embed.manifest;
        const seen = new Set<string>();
        const used = new Set<string>();
        for (const entry of entries) {
            const label = `${where}: "${entry.id}"`;
            if (seen.has(entry.id)) problems.push(`${label} is listed twice`);
            seen.add(entry.id);
            for (const key of ["title", "description"] as const) {
                if (typeof entry[key] !== "string" || !entry[key]) {
                    problems.push(`${label} has no ${key}`);
                }
            }
            if (!levels.has(entry.level)) {
                problems.push(
                    `${label}: level "${entry.level}" is not in examples.json`,
                );
            }
            if (typeof entry.order !== "number")
                problems.push(`${label} has no order`);
            if (!Array.isArray(entry.features))
                problems.push(`${label} has no features`);
            if (entry.layout !== "fill" && entry.layout !== "flow") {
                problems.push(
                    `${label}: layout "${entry.layout}" — fill or flow`,
                );
            }
            if (entry.layout === "fill" && typeof entry.height !== "number") {
                problems.push(`${label}: a fill example needs a height`);
            }
            if (entry.height !== undefined && !(entry.height > 0)) {
                problems.push(`${label}: height ${entry.height}`);
            }
            if (entry.docs !== undefined) {
                const problem = entry.docs.startsWith("/docs/")
                    ? linkProblem(entry.docs, null)
                    : "docs must be a /docs/… link";
                if (problem)
                    problems.push(`${label}: docs ${entry.docs} — ${problem}`);
            }
            if (!entry.files?.length) problems.push(`${label} shows no files`);
            for (const file of entry.files ?? []) {
                used.add(file);
                if (!files[file])
                    problems.push(`${label}: file "${file}" is not in files`);
            }
            for (const item of entry.registry ?? []) {
                if (!itemNames.has(item)) {
                    problems.push(
                        `${label}: registry item "${item}" is not in r/`,
                    );
                }
            }
        }
        for (const file of Object.keys(files)) {
            if (!used.has(file))
                problems.push(
                    `${where}: file "${file}" is shown by no example`,
                );
        }
    }
    for (const framework of embeds.keys()) {
        if (!project.frameworks?.includes(framework)) {
            problems.push(
                `embed/${framework}/ is not a framework in project.json`,
            );
        }
    }

    return problems;
}

// ─── From disk ──────────────────────────────────────────────────────────────

async function readJson<T>(file: string): Promise<T> {
    return JSON.parse(await readFile(file, "utf-8")) as T;
}

async function readJsonOr<T>(file: string, problems: string[], label: string) {
    try {
        return await readJson<T>(file);
    } catch (error) {
        problems.push(
            existsSync(file)
                ? `${label} is not JSON (${(error as Error).message})`
                : `${label} is missing`,
        );
        return null;
    }
}

export async function validateExport(dir: string): Promise<string[]> {
    const problems: string[] = [];
    const project = await readJsonOr<ProjectJson>(
        path.join(dir, "project.json"),
        problems,
        "project.json",
    );
    const config = await readJsonOr<DocsConfig>(
        path.join(dir, "docs", "config.json"),
        problems,
        "docs/config.json",
    );
    const examples = await readJsonOr<ExamplesJson>(
        path.join(dir, "examples.json"),
        problems,
        "examples.json",
    );
    if (!project || !config || !examples) return problems;

    const pages = new Map<string, string>();
    const strayDocs: string[] = [];
    for (const entry of await readdir(path.join(dir, "docs"), {
        recursive: true,
        withFileTypes: true,
    })) {
        if (!entry.isFile()) continue;
        const file = path
            .relative(
                path.join(dir, "docs"),
                path.join(entry.parentPath, entry.name),
            )
            .split(path.sep)
            .join("/");
        if (file.endsWith(".mdx")) {
            pages.set(
                file.slice(0, -4),
                await readFile(path.join(dir, "docs", file), "utf-8"),
            );
        } else if (file !== "config.json") {
            strayDocs.push(file);
        }
    }

    const embeds = new Map<
        string,
        { hasIndex: boolean; manifest: Manifest | null }
    >();
    const embedDir = path.join(dir, "embed");
    for (const framework of existsSync(embedDir)
        ? await readdir(embedDir)
        : []) {
        const manifestFile = path.join(embedDir, framework, "manifest.json");
        embeds.set(framework, {
            hasIndex: existsSync(path.join(embedDir, framework, "index.html")),
            manifest: existsSync(manifestFile)
                ? await readJsonOr<Manifest>(
                      manifestFile,
                      problems,
                      `embed/${framework}/manifest.json`,
                  )
                : null,
        });
    }

    let registry: ExportInput["registry"] = null;
    const registryDir = path.join(dir, "r");
    if (existsSync(registryDir)) {
        const index = await readJsonOr<{ items: RegistryItem[] }>(
            path.join(registryDir, "index.json"),
            problems,
            "r/index.json",
        );
        const items = new Map<string, RegistryItem>();
        for (const file of await readdir(registryDir)) {
            if (!file.endsWith(".json") || file === "index.json") continue;
            const item = await readJsonOr<RegistryItem>(
                path.join(registryDir, file),
                problems,
                `r/${file}`,
            );
            if (item) items.set(file.slice(0, -5), item);
        }
        registry = { index: index?.items ?? [], items };
    }

    return [
        ...problems,
        ...validate({
            project,
            config,
            pages,
            strayDocs,
            examples,
            embeds,
            registry,
        }),
    ];
}
