import { MoreHorizontalIcon } from "lucide-react";
import { Badge } from "#/components/atoms/badge";
import { Clickable } from "#/components/atoms/clickable";
import { Card } from "#/components/ui/card";
import { Progress } from "#/components/ui/progress";

// A billing page's two cards, in the default look. A card is the raised
// tier: a step above the floor, a line stroke and a light shadow, so it
// stands apart from the page by its edge, not by a colour of its own. The
// plan card carries its badge in the header's Action, its usage in the
// Content and its buttons in the Footer, the primary one palette-neutral;
// the second card is a header and a footer, with a rule between them.
export default function CardDemo() {
    return (
        <div className="palette-surface grid w-full items-start gap-6 bg-palette-base text-palette-contrast md:grid-cols-2">
            <Card.Root>
                <Card.Header>
                    <Card.Title>Team plan</Card.Title>
                    <Card.Description>
                        $48 per month, billed on the 1st.
                    </Card.Description>
                    <Card.Action>
                        <Badge>Current</Badge>
                    </Card.Action>
                </Card.Header>
                <Card.Content className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                        <span>Seats</span>
                        <span className="tabular-nums text-palette-accent/85">
                            8 of 10
                        </span>
                    </div>
                    <Progress.Root value={80} aria-label="Seats used">
                        <Progress.Track>
                            <Progress.Indicator />
                        </Progress.Track>
                    </Progress.Root>
                </Card.Content>
                <Card.Footer className="justify-end">
                    <Clickable.Button variant="outline">
                        Cancel plan
                    </Clickable.Button>
                    <Clickable.Button className="palette-neutral">
                        Add seats
                    </Clickable.Button>
                </Card.Footer>
            </Card.Root>

            <Card.Root>
                <Card.Header>
                    <Card.Title>Invoices</Card.Title>
                    <Card.Description>
                        Sent to billing@northwind.com when each one is issued.
                    </Card.Description>
                    <Card.Action>
                        <Clickable.Button
                            variant="icon"
                            shape="square"
                            aria-label="Invoice options"
                        >
                            <MoreHorizontalIcon />
                        </Clickable.Button>
                    </Card.Action>
                </Card.Header>
                <Card.Content>
                    <ul className="flex flex-col divide-y divide-palette-line">
                        <li className="flex justify-between py-2">
                            <span>November 2026</span>
                            <span className="tabular-nums">$48.00</span>
                        </li>
                        <li className="flex justify-between py-2">
                            <span>October 2026</span>
                            <span className="tabular-nums">$48.00</span>
                        </li>
                    </ul>
                </Card.Content>
                <Card.Footer className="border-t border-palette-line pt-6">
                    <Clickable.Button variant="outline">
                        Download all
                    </Clickable.Button>
                </Card.Footer>
            </Card.Root>
        </div>
    );
}
