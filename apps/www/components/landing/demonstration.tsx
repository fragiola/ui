import { PaletteShowcase } from "@/components/landing/palette-showcase";
import { Reveal } from "@/components/landing/reveal";
import { Section } from "@/components/landing/section";

// The closing section: the token system, demonstrated. A server component that
// wraps the client showcase, so the section shell, the copy and the reveal stay
// off the client bundle.

export function Demonstration() {
    return (
        <Section
            eyebrow="The demonstration"
            id="showcase"
            lead="One neutral floor, six palettes, one component. Nothing below is a variant: each button carries a palette-* class and reads the same six roles."
            title="Six palettes, one surface"
        >
            <Reveal>
                <PaletteShowcase />
            </Reveal>
        </Section>
    );
}
