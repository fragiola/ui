import {
    type ComponentType,
    type ReactNode,
    useLayoutEffect,
    useRef,
    useState,
} from "react";
import { Tooltip } from "#/components/ui/tooltip";
import { DesignVersion, Tone } from "./card";
import * as charts from "./cards/charts";
import * as data from "./cards/data";
import * as forms from "./cards/forms";
import * as misc from "./cards/misc";
import * as navigation from "./cards/navigation";
import * as overlays from "./cards/overlays";
import * as settings from "./cards/settings";
import * as status from "./cards/status";
import { COLUMN_COUNT, COLUMN_WIDTH, GAP } from "./layout";

// The canvas: a band of wide panels for the special components, then every
// card in a masonry of fixed columns, far wider and taller than any screen
// (10 × 380px ≈ 4,000px), so the preview scrolls on both axes — inside the
// Create page's inset panel, which this document fills.
//
// The masonry places each card, in order, in the shortest column, by its
// measured height: the columns end together, and scrolling to any corner
// shows cards, not an empty floor. A design changes the cards' sizes (the
// density, the type scale), so it is re-measured on every change.

// The order cards are dealt in: varied, so neighbours differ in kind.
const CARDS: ComponentType[] = [
    charts.ContributionHistory,
    forms.PayoutThreshold,
    status.SavingsTargets,
    forms.BuyInvestment,
    forms.AccountAccess,
    forms.ReceivingMethod,
    navigation.OverviewMenu,
    charts.RevenueTrend,
    forms.SignUp,
    charts.TrafficSources,
    status.DistributeTrack,
    status.ClaimableBalance,
    data.RecentTransactions,
    navigation.PaymentsList,
    status.CardBalance,
    charts.PowerUsage,
    navigation.AccountMenu,
    data.Invoices,
    overlays.ShareMenu,
    overlays.Toolbar,
    misc.TypeSpecimen,
    forms.Preferences,
    navigation.HelpTabs,
    overlays.SmartLock,
    charts.YearlyActivity,
    status.ConnectBank,
    status.CoverArt,
    overlays.EditProfile,
    misc.Notifications,
    misc.AvatarStack,
    charts.DividendIncome,
    charts.SavingsGoal,
    settings.Ratings,
    misc.Shortcuts,
    forms.TransferFunds,
    misc.UpcomingPayments,
    misc.CodeSnippet,
    misc.BadgeShelf,
    status.LoadingCard,
    settings.OrderSummary,
    settings.Webhooks,
    settings.ShippingAddress,
    settings.Sessions,
    settings.Uploads,
    misc.CookieConsent,
    forms.ReportBug,
    settings.WeeklyGoal,
    settings.DangerZone,
    settings.ApiKeys,
    overlays.FileContext,
    settings.Checklist,
    forms.ContactForm,
    misc.NowPlaying,
    navigation.ProductNav,
    settings.LanguageRegion,
    status.StorageUsage,
    settings.TwoFactor,
    data.TeamMembers,
    settings.Mixer,
    forms.InviteTeam,
    misc.Pricing,
    overlays.SettingsDrawer,
    settings.ActivityFeed,
    charts.StackedSignups,
    forms.FeedbackForm,
];

/** How many cards the masonry shows. */
export const CARD_COUNT = CARDS.length;

export function Canvas({
    action,
    control,
    version,
    band,
}: {
    action: string;
    control: string;
    version: string;
    band?: ReactNode;
}) {
    return (
        <Tone.Provider value={{ action, control }}>
            <DesignVersion.Provider value={version}>
                <Tooltip.Provider>
                    {/* The stage is the scroller, not the document: overlay
                            promotion pins it where it is while a modal covers
                            the page, and a pinned element keeps its scroll
                            offsets — the canvas does not move under the modal. */}
                    <div
                        data-stage=""
                        className="palette-surface h-dvh w-dvw overflow-auto bg-palette-base text-palette-contrast"
                    >
                        <div className="flex w-max flex-col gap-4 p-6">
                            {band}
                            <Masonry cards={CARDS} measureKey={version} />
                        </div>
                    </div>
                </Tooltip.Provider>
            </DesignVersion.Provider>
        </Tone.Provider>
    );
}

// Deal the cards into the shortest column, by measured height. The first
// render deals them round-robin; once every card has a height, it deals them
// again by height and re-measures whenever a card's size changes. A card's
// height does not depend on its column (every column has one width), so the
// layout settles in one pass.
function Masonry({
    cards,
    measureKey,
}: {
    cards: ComponentType[];
    measureKey: string;
}) {
    const heights = useRef(new Map<number, number>());
    const [columns, setColumns] = useState<number[][]>(() =>
        Array.from({ length: COLUMN_COUNT }, (_, c) =>
            cards.flatMap((_, i) => (i % COLUMN_COUNT === c ? [i] : [])),
        ),
    );
    const root = useRef<HTMLDivElement>(null);

    // biome-ignore lint/correctness/useExhaustiveDependencies: a design change re-measures
    useLayoutEffect(() => {
        const element = root.current;
        if (!element) return;
        const deal = () => {
            for (const card of element.querySelectorAll<HTMLElement>(
                "[data-card]",
            )) {
                heights.current.set(
                    Number(card.dataset.card),
                    card.offsetHeight,
                );
            }
            if (heights.current.size < cards.length) return;
            const next: number[][] = Array.from(
                { length: COLUMN_COUNT },
                () => [],
            );
            const totals = new Array<number>(COLUMN_COUNT).fill(0);
            cards.forEach((_, i) => {
                const shortest = totals.indexOf(Math.min(...totals));
                next[shortest]?.push(i);
                totals[shortest] =
                    (totals[shortest] ?? 0) +
                    (heights.current.get(i) ?? 0) +
                    GAP;
            });
            setColumns((current) =>
                JSON.stringify(current) === JSON.stringify(next)
                    ? current
                    : next,
            );
        };
        deal();
        const observer = new ResizeObserver(deal);
        for (const card of element.querySelectorAll("[data-card]"))
            observer.observe(card);
        return () => observer.disconnect();
    }, [cards, measureKey, columns]);

    return (
        <div ref={root} className="flex items-start" style={{ gap: GAP }}>
            {columns.map((indexes, c) => (
                <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: the columns are a fixed layout
                    key={c}
                    data-column=""
                    className="flex shrink-0 flex-col"
                    style={{ width: COLUMN_WIDTH, gap: GAP }}
                >
                    {indexes.map((i) => {
                        const Card = cards[i];
                        return Card ? (
                            <div key={Card.name} data-card={i}>
                                <Card />
                            </div>
                        ) : null;
                    })}
                </div>
            ))}
        </div>
    );
}
