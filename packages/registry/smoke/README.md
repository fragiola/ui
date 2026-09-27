# Registry smoke test

Installs every registry item with the real shadcn CLI (the exact version in
`package.json`) into four throwaway projects — Next and Vite, each with and
without `src/` — and fails if:

- any request leaves for a host other than the local registry (for example
  `ui.shadcn.com`, which is where a bare `registryDependencies` name goes);
- the registry answers 404 for something the CLI asked for;
- a file lands outside the place its imports expect, or an expected file is
  missing;
- an installed import does not resolve, or differs from the one the registry
  emitted (the CLI re-resolves alias imports after writing and can pick
  another file with the same basename).

```bash
pnpm registry:smoke            # from the repo root; builds dist/r first
pnpm registry:smoke -- --keep  # keep the projects to inspect them
```

## How it works

- `dist/r` is served on `127.0.0.1`, and `components.json` points
  `@fragiola` at it.
- `HTTP_PROXY`/`HTTPS_PROXY` point at a local proxy that records and refuses
  every request, so nothing external is reachable and every attempt is
  reported. `NO_PROXY` exempts only the local registry.
- The projects are minimal scaffolds the CLI detects as Next (App Router) or
  Vite: config file, `tsconfig.json` with `@/*`, a CSS entry importing
  Tailwind v4, `components.json` with the default aliases. They are not
  `create-next-app`/`create-vite` output.
- Every npm package the registry declares is already in the scaffold's
  `package.json`, so the CLI skips `npm install`. The test needs no network.
- `tailwind.baseColor` is empty: with a base colour, every `add` fetches
  `ui.shadcn.com/r/colors/<name>.json` regardless of the registry, which
  would hide a real leak.
- Expected locations follow the import rewrite in
  `scripts/build-registry.ts`: `registry/ui/` → `components/ui/`,
  `registry/atoms/` → `components/atoms/`, `registry/families/` →
  `components/families/`, `registry/lib/` → `lib/`, `registry/hooks/` →
  `hooks/`, `registry/styles/` → `styles/` — all under `src/` when it exists.
