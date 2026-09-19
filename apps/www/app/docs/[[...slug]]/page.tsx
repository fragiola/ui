import {
    DocsBody,
    DocsDescription,
    DocsPage,
    DocsTitle,
} from "fumadocs-ui/layouts/docs/page";
import { createRelativeLink } from "fumadocs-ui/mdx";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getMDXComponents } from "@/components/mdx";
import { source } from "@/lib/source";

export default async function Page(props: {
    params: Promise<{ slug?: string[] }>;
}) {
    const params = await props.params;
    // /docs is the advertised entry point (header link, hero CTA), but there
    // is no content/docs/index.mdx, so the root of the tree has no page.
    // Send it to the first page. This used to be `redirects()` in
    // next.config.mjs, which a static export cannot honour — here it
    // renders as a redirect page at out/docs/index.html. `redirect()`
    // prepends basePath itself (verified: adding it by hand doubled it).
    if (!params.slug?.length) {
        redirect("/docs/getting-started/introduction");
    }
    const page = source.getPage(params.slug);
    if (!page) notFound();

    const MDX = page.data.body;

    return (
        <DocsPage toc={page.data.toc} full={page.data.full}>
            <DocsTitle>{page.data.title}</DocsTitle>
            <DocsDescription>{page.data.description}</DocsDescription>
            <DocsBody>
                <MDX
                    components={getMDXComponents({
                        a: createRelativeLink(source, page),
                    })}
                />
            </DocsBody>
        </DocsPage>
    );
}

export async function generateStaticParams() {
    // The root (`/docs`) is not in the tree — source.generateParams() emits
    // one entry per MDX file — but the export needs it listed to write the
    // redirect page.
    return [{ slug: [] }, ...source.generateParams()];
}

export async function generateMetadata(props: {
    params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
    const params = await props.params;
    const page = source.getPage(params.slug);
    if (!page) notFound();

    return {
        title: page.data.title,
        description: page.data.description,
    };
}
