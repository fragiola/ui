"use client";

import { Carousel } from "#/components/ui/carousel";

// A featured-projects carousel: one slide a page, Previous and Next on the
// slides' edges, the dots under them, and a rotation that stops when the
// focus enters it (the button first, as the APG asks). Swipe, a trackpad or
// a mouse drag scroll it too. Then two slides a page; switch to RTL and the
// first slide starts on the right.
const PROJECTS = [
    { title: "Field notes", note: "A journal app for researchers." },
    { title: "Night trains", note: "Europe's sleeper routes, mapped." },
    { title: "Salt and stone", note: "A cookbook from the coast." },
    { title: "Open water", note: "Swim spots and their tides." },
];

function Slide({ title, note }: { title: string; note: string }) {
    return (
        <div className="flex aspect-video flex-col justify-end gap-1 rounded-lg border border-palette-line bg-palette-line/40 p-5">
            <span className="text-lg font-semibold">{title}</span>
            <span className="text-sm text-palette-accent/85">{note}</span>
        </div>
    );
}

export default function CarouselDemo() {
    return (
        <div className="palette-surface flex w-full flex-col gap-10 bg-palette-base text-palette-contrast">
            <Carousel.Root
                slideCount={PROJECTS.length}
                aria-label="Featured projects"
                defaultPlaying
                className="max-w-xl"
            >
                <Carousel.Viewport>
                    <Carousel.ItemGroup>
                        {PROJECTS.map((project, index) => (
                            <Carousel.Item
                                key={project.title}
                                index={index}
                                aria-label={`${index + 1} of ${PROJECTS.length}`}
                            >
                                <Slide {...project} />
                            </Carousel.Item>
                        ))}
                    </Carousel.ItemGroup>
                    <Carousel.PrevTrigger />
                    <Carousel.NextTrigger />
                </Carousel.Viewport>
                <div className="flex items-center justify-center gap-2">
                    <Carousel.AutoplayTrigger />
                    <Carousel.IndicatorGroup aria-label="Choose slide to display">
                        {PROJECTS.map((project, index) => (
                            <Carousel.Indicator
                                key={project.title}
                                index={index}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </Carousel.IndicatorGroup>
                </div>
            </Carousel.Root>

            <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-palette-accent/85">
                    two slides a page
                </span>
                <Carousel.Root
                    slideCount={PROJECTS.length}
                    slidesPerPage={2}
                    spacing="12px"
                    aria-label="Projects"
                    className="max-w-xl"
                >
                    <Carousel.Viewport>
                        <Carousel.ItemGroup>
                            {PROJECTS.map((project, index) => (
                                <Carousel.Item
                                    key={project.title}
                                    index={index}
                                    aria-label={`${index + 1} of ${PROJECTS.length}`}
                                >
                                    <Slide {...project} />
                                </Carousel.Item>
                            ))}
                        </Carousel.ItemGroup>
                        <Carousel.PrevTrigger />
                        <Carousel.NextTrigger />
                    </Carousel.Viewport>
                </Carousel.Root>
            </div>
        </div>
    );
}
