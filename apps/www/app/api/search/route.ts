import { createFromSource } from "fumadocs-core/search/server";
import { source } from "@/lib/source";

// Static search: `staticGET` returns the whole index as JSON once, at build
// time, and the export writes it to out/api/search. The search dialog
// (RootProvider in app/layout.tsx, `type: "static"`) fetches that file and
// queries it in the browser. `revalidate = false` marks the route as fully
// static, which `output: "export"` requires of every route handler.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source);
