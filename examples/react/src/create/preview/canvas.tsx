import type { ComponentType } from "react";
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

// The canvas: every card on a fixed grid of columns far wider and taller than
// any screen (10 × 380px ≈ 4,000px), so the preview scrolls on both axes —
// inside the Create page's inset panel, which this document fills. Cards
// stack in their column (masonry by columns); `content-visibility` lets the
// browser skip the columns off screen.

const COLUMNS: ComponentType[][] = [
    [
        charts.ContributionHistory,
        status.DistributeTrack,
        misc.TypeSpecimen,
        charts.DividendIncome,
        settings.Webhooks,
        settings.Checklist,
        forms.ContactForm,
    ],
    [
        forms.PayoutThreshold,
        status.ClaimableBalance,
        forms.Preferences,
        charts.SavingsGoal,
        settings.ShippingAddress,
    ],
    [
        status.SavingsTargets,
        data.RecentTransactions,
        navigation.HelpTabs,
        settings.Ratings,
        settings.Sessions,
        misc.NowPlaying,
    ],
    [
        forms.BuyInvestment,
        navigation.PaymentsList,
        overlays.SmartLock,
        misc.Shortcuts,
        settings.Uploads,
        navigation.ProductNav,
        settings.ActivityFeed,
    ],
    [
        forms.AccountAccess,
        status.CardBalance,
        charts.YearlyActivity,
        forms.TransferFunds,
        misc.CookieConsent,
        settings.LanguageRegion,
    ],
    [
        forms.ReceivingMethod,
        charts.PowerUsage,
        status.ConnectBank,
        misc.UpcomingPayments,
        forms.ReportBug,
        status.StorageUsage,
    ],
    [
        navigation.OverviewMenu,
        navigation.AccountMenu,
        status.CoverArt,
        misc.CodeSnippet,
        settings.WeeklyGoal,
        settings.TwoFactor,
        charts.StackedSignups,
    ],
    [
        charts.RevenueTrend,
        data.Invoices,
        overlays.EditProfile,
        misc.BadgeShelf,
        settings.DangerZone,
        data.TeamMembers,
        forms.FeedbackForm,
    ],
    [
        forms.SignUp,
        overlays.ShareMenu,
        misc.Notifications,
        status.LoadingCard,
        settings.ApiKeys,
        settings.Mixer,
    ],
    [
        data.PeopleGrid,
        charts.TrafficSources,
        overlays.Toolbar,
        misc.AvatarStack,
        settings.OrderSummary,
        overlays.FileContext,
        forms.InviteTeam,
        data.FileTree,
        misc.Pricing,
        overlays.SettingsDrawer,
    ],
];

/** How many cards the canvas shows. */
export const CARD_COUNT = COLUMNS.flat().length;

export function Canvas({
    action,
    control,
    version,
}: {
    action: string;
    control: string;
    version: string;
}) {
    return (
        <Tone.Provider value={{ action, control }}>
            <DesignVersion.Provider value={version}>
                <Tooltip.Provider>
                    <div className="flex w-max gap-4 p-6">
                        {COLUMNS.map((cards, i) => (
                            <div
                                // biome-ignore lint/suspicious/noArrayIndexKey: the columns are a fixed layout
                                key={i}
                                className="flex w-[380px] shrink-0 flex-col gap-4 [content-visibility:auto] [contain-intrinsic-size:380px_3000px]"
                            >
                                {cards.map((Card) => (
                                    <Card key={Card.name} />
                                ))}
                            </div>
                        ))}
                    </div>
                </Tooltip.Provider>
            </DesignVersion.Provider>
        </Tone.Provider>
    );
}
