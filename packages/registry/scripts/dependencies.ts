// An item's npm dependencies. Shared by the build (which refuses an unpinned
// ecosystem package), the smoke (which declares them in its scaffolds) and
// their test.
//
// A special item wraps one of this organisation's packages
// (`@fragiola/<x>-react`). Those are 0.x, and 0.x breaks between minors, so a
// bare name would install whatever is newest — an API the item, its examples
// and its docs were not written for. Each one carries a range
// (`@fragiola/dockable-react@^0.3.0`), and it is the range this package
// builds and tests against (package.json), so the two cannot drift.
const ECOSYSTEM_SCOPE = "@fragiola/";

export function splitDependency(dep: string): {
    name: string;
    range: string | undefined;
} {
    // A scoped name starts with "@": the version separator is the next one.
    const at = dep.indexOf("@", dep.startsWith("@") ? 1 : 0);
    if (at <= 0) return { name: dep, range: undefined };
    return { name: dep.slice(0, at), range: dep.slice(at + 1) || undefined };
}

export function ecosystemRangeProblems(
    item: { name: string; dependencies?: string[] },
    packageDependencies: Record<string, string>,
): string[] {
    const problems: string[] = [];
    for (const dep of item.dependencies ?? []) {
        const { name, range } = splitDependency(dep);
        if (!name.startsWith(ECOSYSTEM_SCOPE)) continue;
        const built = packageDependencies[name];
        if (!range) {
            problems.push(
                `Item "${item.name}" depends on "${name}" without a range. ` +
                    `Write "${name}@${built ?? "^<version>"}".`,
            );
        } else if (range !== built) {
            problems.push(
                `Item "${item.name}" pins "${name}@${range}", but the registry ` +
                    `builds against "${built ?? "nothing"}" (package.json).`,
            );
        }
    }
    return problems;
}
