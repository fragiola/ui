import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./globals.css";

// The settled positioning, declared once and reused by the page title, the
// Open Graph card and the Twitter card. No image fields: there is no OG image
// asset in the repository, and pointing at one that does not exist is worse
// than omitting it.
const TITLE = "Fragiola UI";
const DESCRIPTION =
    "A copy-paste component library built on Base UI and Tailwind v4. Six colour roles, any number of palettes — scope one to a page, a card, or a single button.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        siteName: TITLE,
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: TITLE,
        description: DESCRIPTION,
    },
};

// next-themes is configured to emit BOTH the .dark class (for Fumadocs UI's
// own styles) AND data-theme="light"|"dark" (for Fragiola's palette files,
// which key off :root[data-theme="light"|"dark"]). Both must be emitted for
// the same state, with no flash on first paint — next-themes handles the
// no-flash script internally.

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="palette-surface flex min-h-screen flex-col">
                <RootProvider
                    theme={{
                        attribute: ["class", "data-theme"],
                        defaultTheme: "light",
                        enableSystem: true,
                    }}
                >
                    {children}
                </RootProvider>
            </body>
        </html>
    );
}
