import { createMDX } from "fumadocs-mdx/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
    pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
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
