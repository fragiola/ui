"use client";

import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import type * as React from "react";
import { foundation } from "#/families/foundation";
import { menu } from "#/families/menu";
import { createMenuParts } from "#/families/menu/parts";
import { cn } from "#/lib/cn";

// Menubar — an application's "File, Edit, View": a bar that is one tab stop,
// whose items each open a menu (the APG menubar). The arrows move along the
// bar and, while a menu is open, from one menu to the next; hovering another
// item switches the open menu.
//
// Its menus are ordinary menus, so everything below a Trigger comes from the
// menu parts factory, injected with the Menu namespace (as Dropdown Menu
// does): items, groups, labels, checkbox and radio items, submenus, Content.
// What is the bar's own:
//   Root     a panel (`foundation.panel`) packing the items, 4px apart.
//   Menu     one menu of the bar (the primitive's Menu.Root).
//   Trigger  the bar's item: `menu.barItem`, lit by hover and by its open
//            menu.
//   Content  the factory's Content; its side follows the bar's orientation
//            (below a horizontal bar, beside a vertical one).

const parts = createMenuParts(MenuPrimitive);

function MenubarRoot({ className, ...props }: MenubarPrimitive.Props) {
    return (
        <MenubarPrimitive
            data-slot="menubar"
            className={cn(
                foundation.panel(),
                "flex w-fit items-center gap-1 p-1 data-[orientation=vertical]:flex-col data-[orientation=vertical]:items-stretch",
                className as string,
            )}
            {...props}
        />
    );
}

function MenubarMenu({ ...props }: MenuPrimitive.Root.Props) {
    return <MenuPrimitive.Root data-slot="menubar-menu" {...props} />;
}

function MenubarTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
    return (
        <MenuPrimitive.Trigger
            data-slot="menubar-trigger"
            className={cn(menu.barItem(), className as string)}
            {...props}
        />
    );
}

function MenubarContent({
    align = "start",
    sideOffset = 4,
    ...props
}: React.ComponentProps<typeof parts.Content>) {
    return (
        <parts.Content
            data-slot="menubar-content"
            align={align}
            sideOffset={sideOffset}
            {...props}
        />
    );
}

function MenubarSubContent({
    align = "start",
    alignOffset = -3,
    side = "right",
    sideOffset = 0,
    ...props
}: React.ComponentProps<typeof parts.Content>) {
    return (
        <parts.Content
            data-slot="menubar-sub-content"
            align={align}
            alignOffset={alignOffset}
            side={side}
            sideOffset={sideOffset}
            {...props}
        />
    );
}

export const Menubar = {
    ...parts,
    Root: MenubarRoot,
    Menu: MenubarMenu,
    Trigger: MenubarTrigger,
    Content: MenubarContent,
    SubContent: MenubarSubContent,
};
