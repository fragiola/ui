import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { syncTheme } from "../theme";
import { CreateShell } from "./shell/create-shell";
import "../styles.css";

// create.html — the Create page (contract v1.6). Its scheme is the host's
// (`?theme=` and `fragiola:example:theme`, as an example's); it says it is
// ready once mounted, and never sends `resize`: it fills the viewport.
syncTheme();

const root = document.getElementById("root");
if (!root) throw new Error("#root is missing from create.html");

createRoot(root).render(
    <StrictMode>
        <CreateShell />
        <Ready />
    </StrictMode>,
);

function Ready() {
    useEffect(() => {
        if (window.parent === window) return;
        window.parent.postMessage(
            { type: "fragiola:example:ready", id: "create" },
            window.location.origin,
        );
    }, []);
    return null;
}
