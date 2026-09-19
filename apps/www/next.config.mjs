import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";

// The workspace root, two levels up from apps/www. Named explicitly so the
// standalone output traces the pnpm store at the root instead of guessing.
const workspaceRoot = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
);

// ─── Deploy targets ──────────────────────────────────────────────────────────
// The site is fully pre-renderable: MDX content, a landing page, and a search
// index that is a JSON file. Nothing reads the request. So the default build
// is a STATIC EXPORT (`out/`), which is what GitHub Pages serves.
//
//   NEXT_PUBLIC_BASE_PATH   "/ui" on a project page (fragiola.github.io/ui),
//                           "" on a custom domain. The Pages workflow reads
//                           it from actions/configure-pages, so it is never
//                           hand-maintained. NEXT_PUBLIC_ so the client can
//                           point the search dialog at the exported index.
//   NEXT_OUTPUT_MODE        "standalone" builds the Node server for the
//                           Dockerfile instead. Same code, same routes.
//
// What a static export rules out, and where it went:
//   - `redirects()` here → `redirect()` in app/docs/[[...slug]]/page.tsx
//   - `/api/search` on request → `staticGET`, exported as a file
//   - dynamic params → every docs path comes from generateStaticParams
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const output =
    process.env.NEXT_OUTPUT_MODE === "standalone" ? "standalone" : "export";

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    output,
    outputFileTracingRoot: workspaceRoot,
    basePath,
    // Every page is a directory with an index.html, so a static host
    // resolves /docs/display/chart/ without any rewrite rule.
    trailingSlash: true,
};

const withMDX = createMDX();

export default withMDX(nextConfig);
