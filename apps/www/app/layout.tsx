import { RootProvider } from "fumadocs-ui/provider/next";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "Fragiola UI",
    description:
        "A copy-paste component library built on Base UI and Tailwind v4.",
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
