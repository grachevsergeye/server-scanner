import {
    useEffect,
    useRef,
    useState,
} from "react";

import { useTranslation } from "react-i18next";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    ChevronDown,
} from "lucide-react";

import {
    useLanguageTransition,
} from "./LanguageTransitionContext";

type LanguageCode = "en" | "ru";

interface Language {
    code: LanguageCode;
    label: string;
    flag: string;
}

const languages: Language[] = [
    {
        code: "en",
        label: "ENG",
        flag: "/usa.svg",
    },
    {
        code: "ru",
        label: "RUS",
        flag: "/russia.png",
    },
];

const CustomLanguageSwitcher =
    () => {
        const { i18n } =
            useTranslation();

        const [open, setOpen] =
            useState(false);

        const closeTimeout =
            useRef<ReturnType<
                typeof setTimeout
            > | null>(null);

        const {
            changeLanguage,
        } = useLanguageTransition();

        useEffect(() => {
            return () => {
                if (closeTimeout.current) {
                    clearTimeout(
                        closeTimeout.current
                    );
                }
            };
        }, []);

        const language: LanguageCode =
            i18n.language.startsWith("ru")
                ? "ru"
                : "en";

        const currentLanguage =
            languages.find(
                (item) =>
                    item.code === language
            ) ?? languages[0];

        const openMenu = () => {
            if (closeTimeout.current) {
                clearTimeout(
                    closeTimeout.current
                );
            }

            setOpen(true);
        };

        const closeMenu = () => {
            closeTimeout.current =
                setTimeout(() => {
                    setOpen(false);
                }, 150);
        };

        const handleLanguageChange = async (
            nextLanguage: LanguageCode
        ) => {
            await changeLanguage(
                nextLanguage
            );

            setOpen(false);
        };

        return (
            <div
                className="
                    relative
                    z-50
                    text-[var(--text-primary)]
                "
                onMouseEnter={openMenu}
                onMouseLeave={closeMenu}
            >
                <button
                    type="button"
                    onClick={() =>
                        setOpen(
                            (value) =>
                                !value
                        )
                    }
                    className="
                        flex
                        items-center
                        gap-1
                        rounded-xl
                        border
                        border-gray-700
                        bg-[var(--bg-primary)]
                        px-2
                        py-2
                        text-sm
                        transition
                        hover:bg-[var(--hover-bg)]
                    "
                >
                    <img
                        src={
                            currentLanguage.flag
                        }
                        alt={
                            currentLanguage.label
                        }
                        className="
                            h-4
                            w-5
                            rounded-sm
                            object-cover
                        "
                    />

                    <span>
                        {
                            currentLanguage.label
                        }
                    </span>

                    <ChevronDown
                        size={15}
                        className={[
                            "transition-transform",
                            open
                                ? "rotate-180"
                                : "",
                        ].join(" ")}
                    />
                </button>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{
                                opacity: 0,
                                y: -6,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            exit={{
                                opacity: 0,
                                y: -6,
                            }}
                            transition={{
                                duration: 0.15,
                            }}
                            className="
                                absolute
                                right-0
                                top-full
                                z-[300]
                                mt-1
                                min-w-full
                                overflow-hidden
                                rounded-xl
                                border
                                border-gray-700
                                bg-[var(--bg-primary)]
                                p-1
                                shadow-2xl
                            "
                        >
                            {languages.map(
                                (item) => (
                                    <button
                                        type="button"
                                        key={
                                            item.code
                                        }
                                        onClick={() =>
                                            handleLanguageChange(
                                                item.code
                                            )
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            gap-2
                                            rounded-lg
                                            px-2
                                            py-2
                                            text-left
                                            text-sm
                                            text-[var(--text-primary)]
                                            transition
                                            hover:bg-[var(--hover-bg)]
                                        "
                                    >
                                        <img
                                            src={
                                                item.flag
                                            }
                                            alt={
                                                item.label
                                            }
                                            className="
                                                h-4
                                                w-5
                                                rounded-sm
                                                object-cover
                                            "
                                        />

                                        <span>
                                            {
                                                item.label
                                            }
                                        </span>
                                    </button>
                                )
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    };

export default CustomLanguageSwitcher;