// Where a registry file may land. Shared by the build (which refuses the
// rest) and its test.
//
// `~/` is the project root, not the source root: in a project with `src/`,
// code under it would land outside src/, where its own imports (`@/…`) do
// not look. Code goes through a placeholder (@ui/, @components/, @lib/,
// @hooks/) or a relative path, which lands under src/ when there is one.
//
// The one exception is `~/public/`: static files a page fetches by URL, which
// Vite and Next serve from the project root's public/ — with or without
// src/. Dockable's popout host page (popout.html) is one. The prefix is
// exact: `~/public-x/` or `~/src/public/` is still refused.
const ROOT_PUBLIC = "~/public/";

export function rootTargetRefused(target: string | undefined): boolean {
    if (!target?.startsWith("~/")) return false;
    return !(
        target.startsWith(ROOT_PUBLIC) && target.length > ROOT_PUBLIC.length
    );
}
