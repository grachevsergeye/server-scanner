import {
    useState,
} from "react";

import {
    Volume2,
    VolumeX,
} from "lucide-react";

import {
    isScanSoundEnabled,
    setScanSoundEnabled,
} from "../utils/scan-sound";

export default function ScanSoundToggle() {
    const [enabled, setEnabled] =
        useState(
            () =>
                isScanSoundEnabled()
        );

    const toggle = async () => {
        const next = !enabled;

        await setScanSoundEnabled(
            next
        );

        setEnabled(next);
    };

    const Icon = enabled
        ? Volume2
        : VolumeX;

    return (
        <button
            type="button"
            onClick={toggle}
            aria-pressed={enabled}
            title={
                enabled
                    ? "Scan completion sound enabled"
                    : "Scan completion sound disabled"
            }
            className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-gray-700
                bg-white/[0.025]
                text-[var(--text-secondary)]
                transition
                hover:bg-white/5
                hover:text-[var(--text-primary)]
            "
        >
            <Icon size={17} />
        </button>
    );
}