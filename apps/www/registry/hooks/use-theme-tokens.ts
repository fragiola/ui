"use client";

import * as React from "react";
import { getToken } from "#/lib/get-token";

// useThemeTokens — reads the active theme's chart tokens from the document
// and returns them as a stable object. Re-reads on theme change via a
// MutationObserver on documentElement's data-theme attribute.
//
// The chart tokens are defined in global.css as CSS custom properties:
//   --chart-1 through --chart-8 (categorical, derived from --palette-base)
//   --chart-ramp-1 through --chart-ramp-5 (ordinal ramp)
//   --palette-base, --palette-soft, --palette-line, --palette-contrast,
//   --palette-accent, --palette-ring (the six roles)
//
// The categorical derivation lives in global.css (theme machinery), not in
// a palette — no role describes "the third series", and reusing danger as
// series 4 breaks its meaning.

export type ThemeTokens = {
    categorical: string[];
    ramp: string[];
    palette: {
        base: string;
        soft: string;
        line: string;
        contrast: string;
        accent: string;
        ring: string;
    };
};

const CATEGORICAL_KEYS = Array.from(
    { length: 8 },
    (_, i) => `--chart-${i + 1}`,
);
const RAMP_KEYS = Array.from({ length: 5 }, (_, i) => `--chart-ramp-${i + 1}`);

export function useThemeTokens(): ThemeTokens {
    const [tokens, setTokens] = React.useState<ThemeTokens>(() => readTokens());

    React.useEffect(() => {
        const observer = new MutationObserver(() => {
            setTokens(readTokens());
        });
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["data-theme"],
        });
        return () => observer.disconnect();
    }, []);

    return tokens;
}

function readTokens(): ThemeTokens {
    const categorical = CATEGORICAL_KEYS.map((key) =>
        getToken(key, { fallbackReturn: "" }),
    );
    const ramp = RAMP_KEYS.map((key) => getToken(key, { fallbackReturn: "" }));
    return {
        categorical,
        ramp,
        palette: {
            base: getToken("--palette-base", { fallbackReturn: "" }),
            soft: getToken("--palette-soft", { fallbackReturn: "" }),
            line: getToken("--palette-line", { fallbackReturn: "" }),
            contrast: getToken("--palette-contrast", { fallbackReturn: "" }),
            accent: getToken("--palette-accent", { fallbackReturn: "" }),
            ring: getToken("--palette-ring", { fallbackReturn: "" }),
        },
    };
}
