import {
    NavLink,
} from "react-router-dom";

import {
    useTranslation,
} from "react-i18next";

import {
    Search,
    History,
    ShieldAlert,
    BarChart3,
    X,
} from "lucide-react";

import { useTheme } from "../context/ThemeContext";

import MobileLanguageSwitcher from "./langcomponent/MobileLanguageSwitcher";

interface SidebarProps {
    active?: string;
    open?: boolean;
    onClose?: () => void;
}

export default function Sidebar({
    open = false,
    onClose,
}: SidebarProps) {
    const { t } =
        useTranslation();

    const { theme } = useTheme();

    const items = [
        {
            key: "scanner",
            to: "/",
            label: t("scanner"),
            icon: Search,
        },
        {
            key: "scans",
            to: "/scans",
            label: t("scanHistory"),
            icon: History,
        },
        {
            key: "findings",
            to: "/findings",
            label: t("findings1"),
            icon: ShieldAlert,
        },
        {
            key: "analytics",
            to: "/analytics",
            label: t("analytics"),
            icon: BarChart3,
        },
    ];

    return (
        <aside
            className={[
                "fixed",
                "left-0",
                "top-0",
                "z-[200]",
                "flex",
                "h-screen",
                "w-[280px]",
                "flex-col",
                "border-r",
                "border-gray-700",
                "bg-[var(--bg-primary)]",
                "p-4",
                "transition-transform",
                "duration-200",
                "lg:translate-x-0",
                "shadow-xl",
                open
                    ? "translate-x-0"
                    : "-translate-x-full",
            ].join(" ")}
        >
            <div className="flex items-center justify-between px-3">
                <NavLink to="/">
                    <img
                        src={theme === "dark"
                            ? "/csrdp.svg"
                            : theme === "light"
                            ? "/csrdp-light3.svg"
                            : "/csrdp.svg"}
                        alt="CSRDP"
                        className="h-8"
                    />
                </NavLink>

                <button
                    type="button"
                    onClick={onClose}
                    className="
                        rounded-lg
                        p-2
                        text-[var(--text-secondary)]
                        hover:bg-[var(--hover-bg)]
                        lg:hidden
                    "
                >
                    <X size={20} />
                </button>
            </div>

            <div className="mt-10">
                <div
                    className="
                        mb-3
                        px-3
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-[var(--text-muted)]
                    "
                >
                    {t("workspace")}
                </div>

                <nav className="space-y-1">
                    {items.map((item) => {
                        const Icon =
                            item.icon;

                        return (
                            <NavLink
                                key={item.key}
                                to={item.to}
                                onClick={onClose}
                                end={
                                    item.to ===
                                    "/"
                                }
                            className={({ isActive }) =>
                                [
                                    "relative",
                                    "flex",
                                    "items-center",
                                    "gap-3",
                                    "rounded-lg",
                                    "px-3",
                                    "py-2.5",
                                    "text-sm",
                                    "transition-colors",
                                    "duration-150",

                                    isActive
                                        ? "bg-[var(--accent-soft)] text-[var(--accent)]"
                                        : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)] hover:text-[var(--text-primary)]",
                                ].join(" ")
                            }
                            >
                                {({
                                    isActive,
                                }) => (
                                    <>
                                        {isActive && (
                                            <span
                                                className="
                                                    absolute
                                                    inset-y-0
                                                    left-0
                                                    w-1
                                                    rounded-r
                                                    bg-[var(--accent)]
                                                "
                                            />
                                        )}

                                        <Icon
                                            size={
                                                18
                                            }
                                        />

                                        <span>
                                            {
                                                item.label
                                            }
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
                <div className="lg:hidden flex items-center justify-center mt-4 border-t border-gray-700 p-3">
                    <MobileLanguageSwitcher />
                </div>
            </div>
        </aside>
    );
}