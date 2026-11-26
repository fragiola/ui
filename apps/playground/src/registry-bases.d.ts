// The base the dev server resolves `#/` against, and every base
// (examples/react/vite.shared.ts, registryBases).
declare module "virtual:registry-bases" {
    export const BASE: string;
    export const BASES: { name: string; title: string }[];
}
