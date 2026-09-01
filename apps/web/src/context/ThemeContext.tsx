import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

export type ThemeId =
    | "dark"
    | "light"
    | "matrix"
    | "kanagawa"
    | "night"
    | "aura";

export interface ThemeDefinition {
    id: ThemeId;
    label: string;
    bg: string;
    text: string;
}

export const THEMES: ThemeDefinition[] = [
    {
        id: "dark",
        label: "Dark",
        bg: "#000000",
        text: "#ffffff",
    },
    {
        id: "light",
        label: "Light",
        bg: "#ffffff",
        text: "#020203",
    },
    {
        id: "matrix",
        label: "Matrix",
        bg: "#141729",
        text: "#1bb55e",
    },
    {
        id: "kanagawa",
        label: "Kanagawa",
        bg: "#1f1f28",
        text: "#becbb0",
    },
    {
        id: "night",
        label: "Night Owl",
        bg: "#011627",
        text: "#b4d1eb",
    },
    {
        id: "aura",
        label: "Aura",
        bg: "#21202e",
        text: "#d3ece8",
    },
];

interface ThemeContextValue {
    theme: ThemeId;
    setTheme: (theme: ThemeId) => void;
    themes: ThemeDefinition[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(
    undefined
);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({
    children,
}: ThemeProviderProps) {
    const [theme, setThemeState] = useState<ThemeId>(() => {
        const stored = localStorage.getItem("theme");

        if (
            stored === "dark" ||
            stored === "light" ||
            stored === "matrix" ||
            stored === "kanagawa" ||
            stored === "night" ||
            stored === "aura"
        ) {
            return stored;
        }

        return "dark";
    });

    const setTheme = (nextTheme: ThemeId) => {
        setThemeState(nextTheme);
    };

    useEffect(() => {
        const root = document.documentElement;

        // Remove previous theme classes.
        root.classList.remove(
            "dark-theme",
            "light-theme",
            "matrix-theme",
            "kanagawa-theme",
            "night-theme",
            "aura-theme"
        );

        // Add current theme.
        root.classList.add(`${theme}-theme`);

        localStorage.setItem("theme", theme);
    }, [theme]);

    return (
        <ThemeContext.Provider
            value={{
                theme,
                setTheme,
                themes: THEMES,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            "useTheme must be used inside ThemeProvider"
        );
    }

    return context;
}