import {
    createModel,
    type LayoutJson,
    type Middleware,
    type RowNode,
    type TabsetNode,
    veto,
} from "@fragiola/dockable-react";
import { useState } from "react";
import { Dockable } from "#/components/ui/dockable";

// The header's actions, each shown only while the model allows its command:
//   close     on every tab but "Home" (enableClose: false) and "Pinned";
//             "Audit log" is refused by a middleware veto — no button either.
//             Ctrl+Delete on a focused tab closes it from the keyboard.
//   maximize  on every tabset (a tabset alone in its layout has none); the
//             same button restores, `aria-pressed` says which.
//   overflow  the narrow tabset on the end hides what does not fit; the
//             trigger counts them and lists them in a DropdownMenu.

type Types = { tabs: { note: undefined } };

const tab = (label: string, extra: object = {}) => ({
    component: "note" as const,
    label,
    ...extra,
});

const json: LayoutJson<Types> = {
    version: 1,
    root: {
        type: "row",
        children: [
            {
                type: "tabset",
                weight: 65,
                children: [
                    tab("Home", { enableClose: false }),
                    tab("Pinned", { pinned: true }),
                    tab("Report"),
                    tab("Audit log"),
                ],
            },
            {
                type: "tabset",
                weight: 35,
                children: [
                    tab("Alpha"),
                    tab("Bravo"),
                    tab("Charlie"),
                    tab("Delta"),
                    tab("Echo"),
                    tab("Foxtrot"),
                    tab("Golf"),
                ],
            },
        ],
    },
};

const keepAuditLog: Middleware<Types> = (ctx, next) => {
    if (ctx.command === "tab.close") {
        const node = ctx.get("node-by", { id: ctx.payload.tabId });
        if (node && "label" in node && node.label === "Audit log") {
            return veto("The audit log stays open.");
        }
    }
    return next();
};

export default function DockableActions() {
    const [model] = useState(() => {
        const created = createModel<Types>(json);
        created.use(keepAuditLog);
        return created;
    });
    return (
        <div className="h-[26rem] w-[56rem] max-w-full overflow-hidden rounded-lg border border-palette-line">
            <Dockable.Root model={model} className="size-full">
                <Dockable.Row<Types>>{renderNode}</Dockable.Row>
                <Dockable.Panels<Types>>
                    {(node) => (
                        <Dockable.Panel node={node} className="p-4">
                            <p className="text-palette-accent/85">
                                {node.label}
                            </p>
                        </Dockable.Panel>
                    )}
                </Dockable.Panels>
                <Dockable.DropIndicator />
            </Dockable.Root>
        </div>
    );
}

function renderNode(node: TabsetNode<Types> | RowNode<Types>) {
    if (node.type === "row") {
        return <Dockable.Row node={node}>{renderNode}</Dockable.Row>;
    }
    return (
        <Dockable.TabSet node={node}>
            <Dockable.TabSetHeader>
                <Dockable.TabList<Types> aria-label="Tabs">
                    {(item) => (
                        <Dockable.Tab node={item}>
                            <Dockable.TabLabel>{item.label}</Dockable.TabLabel>
                            <Dockable.TabClose node={item} />
                        </Dockable.Tab>
                    )}
                </Dockable.TabList>
                <Dockable.TabOverflowMenu node={node} />
                <Dockable.TabSetActions>
                    <Dockable.MaximizeTrigger node={node} />
                </Dockable.TabSetActions>
            </Dockable.TabSetHeader>
            <Dockable.TabSetContent />
        </Dockable.TabSet>
    );
}
