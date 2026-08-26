import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteSidebar } from "@/components/site-sidebar";
import "./globals.css";

export const metadata: Metadata = {
    title: "Fragiola UI",
    description:
        "A copy-paste component library built on Base UI and Tailwind v4.",
};

// No-flash theme script: sets data-theme before first paint from localStorage,
// falling back to prefers-color-scheme. Prevents the flash of wrong theme.
const themeScript = `(function(){try{var t=localStorage.getItem("fragiola-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}document.documentElement.dataset.theme=t;var d=localStorage.getItem("fragiola-density");if(d)document.documentElement.dataset.density=d;var dir=localStorage.getItem("fragiola-dir");if(dir==="rtl")document.documentElement.dir="rtl";}catch(e){}})();`;

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" data-theme="light" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body className="palette-surface">
                <Providers>
                    <div className="min-h-screen flex flex-col">
                        <SiteHeader />
                        <div className="flex flex-1">
                            <SiteSidebar />
                            <main className="flex-1 min-w-0 ps-0 pe-0">
                                {children}
                            </main>
                        </div>
                    </div>
                </Providers>
            </body>
        </html>
    );
}
