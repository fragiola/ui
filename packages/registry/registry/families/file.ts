// Family `file` — dropping and listing files: Drop Zone and File Upload
// (Epic #172). Untitled UI's file upload is the anatomy (a drop target with
// an icon, a line of copy and a hint; then a list of files, each a row with
// a preview, its name, its size or its error, and a delete button); the
// look is the visual language's.
//
//   dropZone  the drop target, a button: a dashed `line` box with secondary
//             text, the `hover` fill, the standalone focus ring; while files
//             are dragged over it (`data-drop-target`) it is the libraries'
//             drop outline, a dashed `ring` stroke over a `ring/15` fill (the
//             Grid Layout placeholder's, families/tile.ts); dimmed when
//             disabled
//   icon      the featured icon at its top: a bordered square
//   list      the list of files, a column
//   item      one file: a control box (`foundation.box`), so a rejected file
//             (`rejected`, below) is a red stroke with red text, never a red
//             block
//   rejected  what a rejected file adds: `palette-danger`, a plain class a
//             variant cannot switch, so the wrapper adds it from the Item's
//             state (as Grid Layout's `refused`)
//   preview   the file's thumbnail (an image) or its type icon, a recessed
//             `soft` square
//   image     the preview's image, cropped to the square
//   text      the name and the size (or the error) beside the preview
//   label     a line of copy in the drop target (its call to action),
//             medium weight, wrapping
//   name      the file's name, truncated
//   meta      the size, a status or an error: secondary text
//
// Zero variants (tests/file.test.ts).

import { tv } from "tailwind-variants";
import { foundation } from "./foundation";

const dropZone = tv({
    base: [
        foundation.focus(),
        foundation.hover(),
        foundation.disabled(),
        foundation.secondary(),
        `
        flex w-full cursor-pointer flex-col items-center justify-center gap-3
        rounded-lg border border-dashed border-palette-line px-6 py-6
        text-center text-sm transition-colors duration-150
        data-drop-target:border-palette-ring data-drop-target:bg-palette-ring/15
        `,
    ],
});

const icon = tv({
    base: `
        flex size-10 shrink-0 items-center justify-center rounded-lg border
        border-palette-line bg-palette-base text-palette-accent shadow-sm
        [&_svg:not([class*='size-'])]:size-icon
    `,
});

const list = tv({
    base: "flex flex-col gap-2",
});

const item = tv({
    base: [
        foundation.box(),
        "flex w-full min-w-0 items-center gap-3 rounded-lg p-3 text-sm",
    ],
});

const rejected = tv({
    base: "palette-danger",
});

const preview = tv({
    base: [
        foundation.secondary(),
        `
        flex size-10 shrink-0 items-center justify-center overflow-hidden
        rounded-md bg-palette-soft
        [&_svg:not([class*='size-'])]:size-icon
    `,
    ],
});

const image = tv({
    base: "size-full object-cover",
});

const text = tv({
    base: "flex min-w-0 flex-1 flex-col gap-1",
});

const label = tv({
    base: "font-medium",
});

const name = tv({
    base: "truncate font-medium",
});

const meta = tv({
    base: [foundation.secondary(), "text-xs"],
});

export const file = {
    dropZone,
    icon,
    list,
    item,
    rejected,
    preview,
    image,
    text,
    label,
    name,
    meta,
};
