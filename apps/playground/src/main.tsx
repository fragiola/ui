import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { keepNavigationInPlace } from "../../../examples/react/src/navigation.ts";
import { App } from "./app";
import "./styles.css";

// The shell's own links handle their clicks first; any other link — an
// example's `?page=2`, a navigation menu's `/docs/field` — stays put instead
// of replacing the playground.
keepNavigationInPlace();

const root = document.getElementById("root");
if (!root) throw new Error("#root is missing from index.html");

createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>,
);
