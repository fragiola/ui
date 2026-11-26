import { Carousel } from "#/components/ui/carousel";

// The carousel's other shapes (Epic #166): the tabbed one (its dots are a
// tablist: the arrows move and select, Home and End reach the ends), a loop
// whose arrows never disable, and both under `dir="rtl"` on the subtree,
// where the first slide is on the right and the arrows and dots mirror.
const SLIDES = ["One", "Two", "Three", "Four", "Five"];

function Example({
    label,
    variant,
    loop,
}: {
    label: string;
    variant?: "basic" | "tabbed";
    loop?: boolean;
}) {
    return (
        <Carousel.Root
            slideCount={SLIDES.length}
            variant={variant}
            loop={loop}
            aria-label={label}
            className="max-w-md"
        >
            <Carousel.Viewport>
                <Carousel.ItemGroup>
                    {SLIDES.map((slide, index) => (
                        <Carousel.Item
                            key={slide}
                            index={index}
                            aria-label={`${index + 1} of ${SLIDES.length}`}
                        >
                            <div className="flex aspect-video items-center justify-center rounded-lg border border-palette-line text-2xl font-semibold">
                                {slide}
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel.ItemGroup>
                <Carousel.PrevTrigger />
                <Carousel.NextTrigger />
            </Carousel.Viewport>
            <Carousel.IndicatorGroup aria-label="Choose slide to display">
                {SLIDES.map((slide, index) => (
                    <Carousel.Indicator
                        key={slide}
                        index={index}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </Carousel.IndicatorGroup>
        </Carousel.Root>
    );
}

export default function CarouselVariants() {
    return (
        <div className="palette-surface flex flex-col gap-8 rounded-lg border border-palette-line bg-palette-base p-6 text-palette-contrast">
            <Example label="Tabbed" variant="tabbed" />
            <Example label="Loop" loop />
            <div dir="rtl" className="flex flex-col gap-8">
                <Example label="Tabbed, RTL" variant="tabbed" />
                <Example label="Loop, RTL" loop />
            </div>
        </div>
    );
}
