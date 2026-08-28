import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Hero } from "@/components/landing/hero";
import { SiteFooter } from "@/components/landing/site-footer";
import { WhyFragiola } from "@/components/landing/why-fragiola";
import { baseOptions } from "@/lib/layout.shared";

// The landing page. A server component: nothing here needs interactivity, and
// the entrances are CSS, not JS.
//
// It is not a documentation page. What it used to be — a column of headings, a
// typography sampler and an install command — belongs to the docs, and the
// header link, the hero call to action and the footer are how a visitor gets
// there.

export default function HomePage() {
    return (
        <HomeLayout {...baseOptions()}>
            {/* A div, not a <main>: HomeLayout already renders the page's
                <main> (#nd-home-layout), and a second one would be invalid. */}
            <div className="flex flex-1 flex-col">
                <Hero />
                <WhyFragiola />
            </div>
            <SiteFooter />
        </HomeLayout>
    );
}
