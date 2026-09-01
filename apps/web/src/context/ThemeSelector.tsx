import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    Check,
    ChevronDown,
} from "lucide-react";

import {
    useTheme,
    type ThemeId,
} from "./ThemeContext";

interface ThemeSelectorProps {
    mobile?: boolean;
}

export default function ThemeSelector({
    mobile = false,
}: ThemeSelectorProps) {
    const {
        theme,
        setTheme,
        themes,
    } = useTheme();

    const [open, setOpen] = useState(false);

    const closeTimeout =
        useRef<ReturnType<typeof setTimeout> | null>(
            null
        );

    useEffect(() => {
        return () => {
            if (closeTimeout.current) {
                clearTimeout(closeTimeout.current);
            }
        };
    }, []);

    const openMenu = () => {
        if (closeTimeout.current) {
            clearTimeout(closeTimeout.current);
        }

        setOpen(true);
    };

    const closeMenu = () => {
        closeTimeout.current = setTimeout(() => {
            setOpen(false);
        }, 150);
    };

    const selectTheme = (id: ThemeId) => {
        setTheme(id);
        setOpen(false);
    };

    const currentTheme =
        themes.find((item) => item.id === theme);

    return (
        <div
            className={[
                "relative",
                "text-[var(--text-primary)]",
                mobile
                    ? "w-full"
                    : "text-sm",
            ].join(" ")}
            onMouseEnter={openMenu}
            onMouseLeave={closeMenu}
        >
            <button
                type="button"
                onClick={() =>
                    setOpen((value) => !value)
                }
                className="
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-1
                    rounded-xl
                    border
                    border-gray-700
                    bg-[var(--bg-primary)]
                    px-3
                    py-2
                    transition
                    hover:bg-[var(--hover-bg)]
                "
            >
                <span>
                    {currentTheme?.label}
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
                            mt-2
                            w-56
                            overflow-hidden
                            rounded-xl
                            border
                            border-gray-700
                            bg-[var(--bg-primary)]
                            shadow-2xl
                        "
                    >
                        {themes.map((item) => (
                            <button
                                type="button"
                                key={item.id}
                                onClick={() =>
                                    selectTheme(
                                        item.id
                                    )
                                }
                                className="
                                    flex
                                    w-full
                                    items-center
                                    justify-between
                                    px-4
                                    py-3
                                    text-left
                                    text-[var(--text-primary)]
                                    transition
                                    hover:bg-[var(--hover-bg)]
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="
                                            h-5
                                            w-5
                                            shrink-0
                                            rounded-full
                                            border
                                            p-[1px]
                                        "
                                        style={{
                                            borderColor:
                                                "border-gray-700",
                                        }}
                                    >
                                        <div
                                            className="h-full w-full rounded-full"
                                            style={{
                                                background:
                                                    `linear-gradient(
                                                        135deg,
                                                        ${item.bg} 50%,
                                                        ${item.text} 50%
                                                    )`,
                                            }}
                                        />
                                    </div>

                                    <span>
                                        {item.label}
                                    </span>
                                </div>

                                {theme === item.id && (
                                    <Check size={16} />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}