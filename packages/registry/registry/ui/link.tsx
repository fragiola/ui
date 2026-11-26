"use client";

import { Link as LinkPrimitive } from "@fragiola/primitives-react/link";
import { LINK_TEXT } from "#/atoms/text";
import { foundation } from "#/families/foundation";
import { cn } from "#/lib/cn";
import type { PrimitivesProps } from "#/lib/primitives-backed";

// Link — a link that knows the two states an app's navigation gives it:
// `current` (the page the app is on, `aria-current="page"`) and `disabled`
// (still in the tab order and announced, its press navigating nowhere and
// reaching no handler, a router's included). It renders the app's anchor,
// or its router link through `render` (`render={<RouterLink to="/docs" />}`).
//
// Primitives-backed (docs/architecture.md §5, "Bases"): Base UI has no
// link, so this one shared file wraps Fragiola Primitives' on every base.
//
// The look is `Text.Link`'s (`LINK_TEXT`): `contrast`, underlined in `line`,
// the underline taking the text's colour on hover. The current page keeps
// the underline in the text's colour and the label weight; a disabled link
// is the foundation's `disabled`.

function Link({
    className,
    ...props
}: PrimitivesProps<typeof LinkPrimitive, "a">) {
    return (
        <LinkPrimitive
            data-slot="link"
            className={cn(
                LINK_TEXT,
                foundation.disabled(),
                "data-current:font-medium data-current:decoration-current",
                className as string,
            )}
            {...props}
        />
    );
}

export { Link };
