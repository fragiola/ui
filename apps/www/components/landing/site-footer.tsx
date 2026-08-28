import Link from "next/link";
import { GITHUB_URL } from "@/lib/layout.shared";

// SiteFooter — the landing page's outbound links. App code, not a registry
// item: it is site chrome, not something anyone copies into their project.
//
// Painted through roles only (architecture.md §1). `bg-palette-base` +
// `border-palette-line` over the body's palette-surface floor, secondary text
// at the settled `text-palette-accent/85`.

const DOCS_LINKS = [
    { text: "Introduction", href: "/docs/getting-started/introduction" },
    { text: "Installation", href: "/docs/getting-started/installation" },
    { text: "Theming", href: "/docs/architecture/theming" },
    { text: "Palettes", href: "/docs/architecture/palettes" },
] as const;

export function SiteFooter() {
    return (
        <footer className="border-t border-palette-line bg-palette-base">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-12 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex max-w-xs flex-col gap-2">
                    <span className="text-sm font-semibold tracking-tight text-palette-contrast">
                        Fragiola UI
                    </span>
                    <p className="text-sm text-palette-accent/85">
                        Six colour roles, any number of palettes — scoped to
                        whatever subtree needs them.
                    </p>
                </div>

                <div className="flex flex-col gap-10 sm:flex-row sm:gap-16">
                    <FooterColumn title="Documentation">
                        {DOCS_LINKS.map((link) => (
                            <li key={link.href}>
                                <FooterLink href={link.href}>
                                    {link.text}
                                </FooterLink>
                            </li>
                        ))}
                    </FooterColumn>

                    <FooterColumn title="Project">
                        <li>
                            <FooterLink href={GITHUB_URL} external>
                                GitHub
                            </FooterLink>
                        </li>
                    </FooterColumn>
                </div>
            </div>

            <div className="border-t border-palette-line">
                <p className="mx-auto w-full max-w-5xl px-6 py-6 text-xs text-palette-accent/85">
                    MIT licensed. Built by{" "}
                    <FooterLink href="https://github.com/maurodesouza" external>
                        Mauro de Souza
                    </FooterLink>
                    .
                </p>
            </div>
        </footer>
    );
}

function FooterColumn({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <nav aria-label={title} className="flex flex-col gap-3">
            <span className="text-xs font-semibold uppercase tracking-wide text-palette-contrast">
                {title}
            </span>
            <ul className="flex flex-col gap-2 text-sm">{children}</ul>
        </nav>
    );
}

function FooterLink({
    href,
    external,
    children,
}: {
    href: string;
    external?: boolean;
    children: React.ReactNode;
}) {
    const className =
        "rounded-sm text-palette-accent/85 transition-colors hover:text-palette-contrast focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-palette-ring";

    if (external) {
        return (
            <a
                className={className}
                href={href}
                rel="noreferrer noopener"
                target="_blank"
            >
                {children}
            </a>
        );
    }

    return (
        <Link className={className} href={href}>
            {children}
        </Link>
    );
}
