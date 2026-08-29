import { useTranslation } from "react-i18next";
import {
    Menu
} from "lucide-react";
import ThemeSelector from "../context/ThemeSelector";
import { useTheme } from "../context/ThemeContext";
import CustomLanguageSwitcher from "./langcomponent/CustomLanguageSwitcher";
import ScanSoundToggle
    from "./ScanSoundToggle";

interface TopbarProps {
    onMenuClick?: () => void;
}

export default function Topbar({
    onMenuClick,
}: TopbarProps) {
    const { t } = useTranslation();
    useTheme();

    return (
        <header
            className="
                sticky
                top-0
                z-[100]
                flex
                h-16
                items-center
                justify-between
                border-b
                border-gray-700
                bg-[var(--bg-primary)]/90
                px-4
                backdrop-blur-xl
                sm:px-6
                lg:px-8
            "
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="
                        rounded-lg
                        p-2
                        text-[var(--text-secondary)]
                        transition
                        hover:bg-white/5
                        hover:text-[var(--text-primary)]
                        lg:hidden
                    "
                    aria-label="Open menu"
                >
                    <Menu size={20} />
                </button>

                <div
                    className="
                        text-sm
                        font-medium
                        text-[var(--text-primary)]
                    "
                >
                    {t("infrastructure")}
                </div>
            </div>

            <div className="flex items-center gap-2">
                    <div className="hidden lg:block">
                    <CustomLanguageSwitcher />
                    </div>
                    <ThemeSelector />

                <div className="mt-auto hidden lg:block">
                    <div
                        className="
                            flex
                            items-center
                            gap-3
                            rounded-xl
                            border
                            border-gray-700
                            px-2
                            py-2
                        "
                    >
                        <span
                            className="
                                h-2
                                w-2
                                rounded-full
                                bg-emerald-400
                            "
                        />

                        <span className="text-sm">
                            {t("api")}
                        </span>

                        <span
                            className="
                                ml-auto
                                text-xs
                                text-emerald-400
                            "
                        >
                            {t("online")}
                        </span>
                    </div>
                </div>

                    <ScanSoundToggle />

            </div>
        </header>
    );
}