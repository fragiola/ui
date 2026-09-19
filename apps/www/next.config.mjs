import path from "node:path";
import { fileURLToPath } from "node:url";
import { createMDX } from "fumadocs-mdx/next";

// The workspace root, two levels up from apps/www. Named explicitly so the
// standalone output traces the pnpm store at the root instead of guessing —
// Next infers it from the lockfile, but a guess in a Dockerfile is a
// silent-failure waiting to happen.
const workspaceRoot = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    "../..",
);

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
    // Standalone: `next build` emits a self-contained server under
    // .next/standalone with only the traced node_modules. The Dockerfile
    // copies that, .next/static and public/ — nothing else ships.
    output: "standalone",
    outputFileTracingRoot: workspaceRoot,
    // /docs is the advertised entry point (header link, hero CTA), but there
    // is no content/docs/index.mdx — source.generateParams() emits one path
    // per MDX file and none of them is the root, so /docs itself 404s.
    // Redirect it to the first page of the tree. Temporary (307) on purpose:
    // if a real docs index lands later, a cached 308 would outlive it.
    async redirects() {
        return [
            {
                source: "/docs",
                destination: "/docs/getting-started/introduction",
                permanent: false,
            },
        ];
    },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
