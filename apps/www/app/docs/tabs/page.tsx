import { InstallCommand } from "@/components/install-command";
import { ComponentPreview } from "@/components/preview";

export default function TabsPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold text-palette-contrast">
                    Tabs
                </h1>
                <p className="text-sm text-palette-accent/85">
                    A strip of triggers where one is current, with an animated
                    indicator. The indicator uses the primitive's CSS variables
                    (<code>--active-tab-*</code>), not React measurement — it
                    tracks on resize and under RTL automatically.
                </p>
            </div>

            <InstallCommand name="tabs" />

            <ComponentPreview name="tabs-demo" />

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    No navigation family
                </h2>
                <p className="text-sm text-palette-accent/85">
                    Tabs, navigation-menu and pagination are all "a strip of
                    triggers", but the overlap is thinner than it first looks.
                    Tabs and navigation-menu share state normalisation (the{" "}
                    <code>highlighted</code> custom variant) but differ in
                    cursor, rounding and state-specific treatments. Pagination
                    is <code>Clickable</code> in a <code>&lt;nav&gt;</code>. No
                    family was created — the negative result is recorded in the
                    port report.
                </p>
            </section>

            <section className="flex flex-col gap-3">
                <h2 className="text-xl font-semibold text-palette-contrast">
                    Parts
                </h2>
                <table className="w-full text-sm border border-palette-line rounded-md overflow-hidden">
                    <thead className="bg-palette-soft">
                        <tr>
                            <th className="text-start px-3 py-2 text-palette-contrast font-semibold">
                                Part
                            </th>
                            <th className="text-start px-3 py-2 text-palette-contrast font-semibold">
                                Source
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-palette-line">
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Root</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                Base UI <code>Tabs.Root</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>List</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                layout + <code>border-palette-line</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Tab</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>highlighted</code> +{" "}
                                <code>palette-ring</code> + layout
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Indicator</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                primitive CSS variables +{" "}
                                <code>bg-palette-base</code>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-3 py-2 text-palette-accent/85">
                                <code>Panel</code>
                            </td>
                            <td className="px-3 py-2 text-palette-accent/85">
                                Base UI <code>Tabs.Panel</code>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>
        </div>
    );
}
