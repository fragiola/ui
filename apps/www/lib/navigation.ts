export type NavItem = {
    href: string;
    label: string;
};

export const navItems: NavItem[] = [
    { href: "/", label: "Introduction" },
    { href: "/docs/installation", label: "Installation" },
    { href: "/docs/theming", label: "Theming" },
    { href: "/docs/palettes", label: "Palettes" },
    { href: "/docs/style-families", label: "Style families" },
    { href: "/docs/composition", label: "Composition" },
    { href: "/docs/dark-mode", label: "Dark mode" },
    { href: "/docs/rtl", label: "RTL" },
    { href: "/docs/density", label: "Density" },
    { href: "/docs/registry", label: "Registry" },
];
