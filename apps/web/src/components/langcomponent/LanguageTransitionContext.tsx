import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

import { useTranslation } from "react-i18next";

type SupportedLanguage = "en" | "ru";

interface LanguageTransitionContextValue {
    transitioning: boolean;
    changeLanguage: (
        language: SupportedLanguage
    ) => Promise<void>;
}

const LanguageTransitionContext =
    createContext<
        LanguageTransitionContextValue | undefined
    >(undefined);

interface LanguageTransitionProviderProps {
    children: ReactNode;
}

export default function LanguageTransitionProvider({
    children,
}: LanguageTransitionProviderProps) {
    const { i18n } = useTranslation();

    const [transitioning, setTransitioning] =
        useState(false);

    const changeLanguage = useCallback(
        async (language: SupportedLanguage) => {
            const currentLanguage =
                i18n.language.startsWith("ru")
                    ? "ru"
                    : "en";

            if (language === currentLanguage) {
                return;
            }

            setTransitioning(true);

            await new Promise<void>((resolve) =>
                setTimeout(resolve, 250)
            );

            await i18n.changeLanguage(language);

            localStorage.setItem(
                "i18nextLng",
                language
            );

            await new Promise<void>((resolve) =>
                requestAnimationFrame(() =>
                    resolve()
                )
            );

            setTransitioning(false);
        },
        [i18n]
    );

    return (
        <LanguageTransitionContext.Provider
            value={{
                transitioning,
                changeLanguage,
            }}
        >
            <div
                className={`
                    transition-opacity
                    duration-200
                    ${
                        transitioning
                            ? "opacity-0"
                            : "opacity-100"
                    }
                `}
            >
                {children}
            </div>
        </LanguageTransitionContext.Provider>
    );
}

export function useLanguageTransition(): LanguageTransitionContextValue {
    const context = useContext(
        LanguageTransitionContext
    );

    if (!context) {
        throw new Error(
            "useLanguageTransition must be used inside LanguageTransitionProvider"
        );
    }

    return context;
}