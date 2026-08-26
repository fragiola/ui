"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

type Theme = "light" | "dark";
type Density = "compact" | "spacious" | "default";
type Direction = "ltr" | "rtl";

type Preferences = {
    theme: Theme;
    density: Density;
    direction: Direction;
    setTheme: (t: Theme) => void;
    toggleTheme: () => void;
    setDensity: (d: Density) => void;
    toggleDirection: () => void;
};

const PreferencesContext = createContext<Preferences | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("light");
    const [density, setDensityState] = useState<Density>("default");
    const [direction, setDirectionState] = useState<Direction>("ltr");

    useEffect(() => {
        const stored = document.documentElement.dataset.theme as
            | Theme
            | undefined;
        if (stored === "dark" || stored === "light") setThemeState(stored);
        const storedDensity = document.documentElement.dataset.density as
            | Density
            | undefined;
        if (storedDensity) setDensityState(storedDensity);
        if (document.documentElement.dir === "rtl") setDirectionState("rtl");
    }, []);

    const setTheme = useCallback((t: Theme) => {
        setThemeState(t);
        document.documentElement.dataset.theme = t;
        try {
            localStorage.setItem("fragiola-theme", t);
        } catch {
            // ignore
        }
    }, []);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => {
            const next = prev === "light" ? "dark" : "light";
            document.documentElement.dataset.theme = next;
            try {
                localStorage.setItem("fragiola-theme", next);
            } catch {
                // ignore
            }
            return next;
        });
    }, []);

    const setDensity = useCallback((d: Density) => {
        setDensityState(d);
        if (d === "default") {
            delete document.documentElement.dataset.density;
            try {
                localStorage.removeItem("fragiola-density");
            } catch {
                // ignore
            }
        } else {
            document.documentElement.dataset.density = d;
            try {
                localStorage.setItem("fragiola-density", d);
            } catch {
                // ignore
            }
        }
    }, []);

    const toggleDirection = useCallback(() => {
        setDirectionState((prev) => {
            const next = prev === "ltr" ? "rtl" : "ltr";
            document.documentElement.dir = next;
            try {
                localStorage.setItem("fragiola-dir", next);
            } catch {
                // ignore
            }
            return next;
        });
    }, []);

    return (
        <PreferencesContext.Provider
            value={{
                theme,
                density,
                direction,
                setTheme,
                toggleTheme,
                setDensity,
                toggleDirection,
            }}
        >
            {children}
        </PreferencesContext.Provider>
    );
}

export function usePreferences() {
    const ctx = useContext(PreferencesContext);
    if (!ctx) throw new Error("usePreferences must be used within Providers");
    return ctx;
}
