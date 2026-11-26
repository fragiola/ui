import { Menubar } from "#/components/ui/menubar";

// A vertical menubar beside a horizontal one (Epic #166): in the vertical
// bar Up and Down move along it and the menus open on its inline end (Right
// opens one in LTR, Left in RTL); a disabled item is focusable and opens
// nothing; `modal` makes every menu of the bar modal on either base.
function Menus({ disabled = false }: { disabled?: boolean }) {
    return (
        <>
            {["File", "Edit", "View"].map((name) => (
                <Menubar.Menu key={name}>
                    <Menubar.Trigger disabled={disabled && name === "Edit"}>
                        {name}
                    </Menubar.Trigger>
                    <Menubar.Content>
                        <Menubar.Item>
                            <span>{name} one</span>
                            <Menubar.Shortcut>⌘1</Menubar.Shortcut>
                        </Menubar.Item>
                        <Menubar.Item>
                            <span>{name} two</span>
                        </Menubar.Item>
                        <Menubar.Sub>
                            <Menubar.SubTrigger>
                                <span>More</span>
                            </Menubar.SubTrigger>
                            <Menubar.SubContent>
                                <Menubar.Item>
                                    <span>Deeper</span>
                                </Menubar.Item>
                            </Menubar.SubContent>
                        </Menubar.Sub>
                    </Menubar.Content>
                </Menubar.Menu>
            ))}
        </>
    );
}

export default function MenubarVertical() {
    return (
        <div className="palette-surface flex flex-wrap items-start gap-8 rounded-lg border border-palette-line bg-palette-base p-6 text-palette-contrast">
            <Menubar.Root aria-label="Horizontal, Edit disabled">
                <Menus disabled />
            </Menubar.Root>
            <Menubar.Root orientation="vertical" aria-label="Vertical">
                <Menus />
            </Menubar.Root>
            <Menubar.Root modal aria-label="Modal">
                <Menus />
            </Menubar.Root>
        </div>
    );
}
