import { parseAst } from "rolldown/parseAst";

// What tests/bases.test.ts compares between a file's copies in every base
// (bases.ts): what the file exports — down to the members of an exported
// namespace object (`Dialog.Root`, `Dialog.Trigger`) — and the `data-slot`
// names it renders. A reader's code written against one base must compile
// against another, and everything keyed on `data-slot` (the overlay
// promotion, the docs, readers' selectors) must find the same parts.

type Node = { type: string; [key: string]: unknown };

function isNode(value: unknown): value is Node {
    return (
        typeof value === "object" &&
        value !== null &&
        typeof (value as Node).type === "string"
    );
}

function keyName(key: unknown): string | undefined {
    if (!isNode(key)) return undefined;
    if (key.type === "Identifier") return key.name as string;
    if (key.type === "Literal") return String(key.value);
    return undefined;
}

/** The keys of an object literal, or of `Object.assign(x, { ... })`'s objects. */
function objectKeys(init: unknown): string[] {
    if (!isNode(init)) return [];
    if (init.type === "TSAsExpression" || init.type === "TSSatisfiesExpression")
        return objectKeys(init.expression);
    if (init.type === "ObjectExpression") {
        return (init.properties as Node[]).flatMap((property) => {
            if (property.type !== "Property") return [];
            const name = keyName(property.key);
            return name ? [name] : [];
        });
    }
    if (
        init.type === "CallExpression" &&
        isNode(init.callee) &&
        init.callee.type === "MemberExpression" &&
        keyName((init.callee as Node).property) === "assign"
    ) {
        return (init.arguments as Node[]).flatMap(objectKeys);
    }
    return [];
}

/** The keys of the object literals a function body returns at its top level. */
function returnedKeys(body: unknown): string[] {
    if (!isNode(body) || body.type !== "BlockStatement") return [];
    return (body.body as Node[]).flatMap((statement) =>
        statement.type === "ReturnStatement"
            ? objectKeys(statement.argument)
            : [],
    );
}

function parse(source: string, file: string): Node {
    return parseAst(source, { lang: "tsx" }, file) as unknown as Node;
}

/**
 * A file's public shape: every exported name, each exported object's keys
 * as `Name.key`, and type exports as `type Name`. Sorted.
 */
export function exportShape(source: string, file = "file.tsx"): string[] {
    const program = parse(source, file);
    const locals = new Map<string, string[]>();
    const shape = new Set<string>();
    const body = program.body as Node[];

    for (const statement of body) {
        const declaration =
            statement.type === "ExportNamedDeclaration"
                ? (statement.declaration as Node | null)
                : statement;
        if (declaration?.type === "VariableDeclaration") {
            for (const declarator of declaration.declarations as Node[]) {
                const name = keyName(declarator.id);
                if (name) locals.set(name, objectKeys(declarator.init));
            }
        }
    }

    const add = (name: string, local = name) => {
        shape.add(name);
        for (const key of locals.get(local) ?? []) shape.add(`${name}.${key}`);
    };

    for (const statement of body) {
        if (statement.type === "ExportDefaultDeclaration") shape.add("default");
        if (statement.type === "ExportAllDeclaration") {
            shape.add(`* from ${(statement.source as Node).value}`);
        }
        if (statement.type !== "ExportNamedDeclaration") continue;
        const declaration = statement.declaration as Node | null;
        const typeOnly = statement.exportKind === "type";
        if (declaration) {
            if (declaration.type === "VariableDeclaration") {
                for (const declarator of declaration.declarations as Node[]) {
                    const name = keyName(declarator.id);
                    if (name) add(name);
                }
            } else if (
                declaration.type === "TSTypeAliasDeclaration" ||
                declaration.type === "TSInterfaceDeclaration"
            ) {
                shape.add(`type ${keyName(declaration.id)}`);
            } else {
                const name = keyName(declaration.id);
                if (name) add(name);
                // A parts factory (`createMenuParts`): the parts it returns.
                if (name && declaration.type === "FunctionDeclaration") {
                    for (const key of returnedKeys(declaration.body)) {
                        shape.add(`${name}().${key}`);
                    }
                }
            }
        }
        for (const specifier of (statement.specifiers as Node[]) ?? []) {
            const exported = keyName(specifier.exported) ?? "";
            const local = keyName(specifier.local) ?? exported;
            if (typeOnly || specifier.exportKind === "type") {
                shape.add(`type ${exported}`);
            } else add(exported, local);
        }
    }
    return [...shape].sort();
}

/** Every static `data-slot` value a file renders (JSX attributes and props objects). Sorted. */
export function dataSlots(source: string, file = "file.tsx"): string[] {
    const slots = new Set<string>();
    const visit = (value: unknown): void => {
        if (Array.isArray(value)) {
            for (const item of value) visit(item);
            return;
        }
        if (!isNode(value)) return;
        if (
            value.type === "JSXAttribute" &&
            isNode(value.name) &&
            value.name.name === "data-slot" &&
            isNode(value.value) &&
            value.value.type === "Literal"
        ) {
            slots.add(String(value.value.value));
        }
        if (
            value.type === "Property" &&
            keyName(value.key) === "data-slot" &&
            isNode(value.value) &&
            value.value.type === "Literal"
        ) {
            slots.add(String(value.value.value));
        }
        for (const [key, child] of Object.entries(value)) {
            if (key !== "type") visit(child);
        }
    };
    visit(parse(source, file));
    return [...slots].sort();
}

export type BaseFiles = {
    base: string;
    /** Logical path (`ui/dialog.tsx`, relative to the base's folder) → source. */
    files: Map<string, string>;
};

/**
 * Every difference between the reference base's files and another base's:
 * a missing or extra file, an export or namespace member one has and the
 * other does not, a `data-slot` one renders and the other does not.
 */
export function parityProblems(
    reference: BaseFiles,
    other: BaseFiles,
): string[] {
    const problems: string[] = [];
    const where = (base: string, file: string) =>
        `registry/bases/${base}/${file}`;
    for (const file of reference.files.keys()) {
        if (!other.files.has(file)) {
            problems.push(
                `${where(other.base, file)} is missing (${reference.base} has it)`,
            );
        }
    }
    for (const file of other.files.keys()) {
        if (!reference.files.has(file)) {
            problems.push(
                `${where(other.base, file)} has no twin in ${reference.base}`,
            );
        }
    }
    for (const [file, source] of reference.files) {
        const twin = other.files.get(file);
        if (twin === undefined) continue;
        const compare = (what: string, mine: string[], theirs: string[]) => {
            for (const name of mine.filter((n) => !theirs.includes(n)))
                problems.push(
                    `${where(other.base, file)}: ${what} "${name}" is missing (${reference.base} has it)`,
                );
            for (const name of theirs.filter((n) => !mine.includes(n)))
                problems.push(
                    `${where(other.base, file)}: ${what} "${name}" is not in ${reference.base}`,
                );
        };
        compare("export", exportShape(source, file), exportShape(twin, file));
        compare("data-slot", dataSlots(source, file), dataSlots(twin, file));
    }
    return problems;
}
