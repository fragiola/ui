export default function DocsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="px-6 py-10 max-w-3xl w-full">{children}</div>;
}
