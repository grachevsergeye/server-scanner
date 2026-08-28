import { useMemo, useState } from "react";
import {
    ChevronDown,
    Search,
} from "lucide-react";

import type { ScanJob } from "../api";

interface ScanSelectorProps {
    scans: ScanJob[];
    value: string | null;
    onChange: (id: string) => void;
}

export default function ScanSelector({
    scans,
    value,
    onChange,
}: ScanSelectorProps) {
    const [open, setOpen] =
        useState(false);

    const [search, setSearch] =
        useState("");

    const filtered = useMemo(() => {
        const query =
            search.trim().toLowerCase();

        if (!query) {
            return scans;
        }

        return scans.filter((scan) =>
            scan.id
                .toLowerCase()
                .includes(query)
        );
    }, [scans, search]);

    const selected =
        scans.find(
            (scan) => scan.id === value
        ) ?? null;

    return (
        <div className="relative w-full max-w-xl">
            <button
                type="button"
                onClick={() =>
                    setOpen((current) => !current)
                }
                className="
                    flex
                    h-11
                    w-full
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-gray-700
                    bg-[var(--bg-primary)]
                    px-3
                    text-left
                    text-sm
                "
            >
                <span
                    className={
                        selected
                            ? "text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)]"
                    }
                >
                    {selected
                        ? selected.id
                        : "Select a scan..."}
                </span>

                <ChevronDown
                    size={17}
                    className="text-[var(--text-secondary)]"
                />
            </button>

            {open && (
                <div
                    className="
                        absolute
                        left-0
                        right-0
                        top-full
                        z-50
                        mt-2
                        overflow-hidden
                        rounded-lg
                        border
                        border-gray-700
                        bg-[var(--bg-secondary)]
                        shadow-2xl
                    "
                >
                    <div className="border-b border-gray-700 p-2">
                        <div className="relative">
                            <Search
                                size={15}
                                className="
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-[var(--text-secondary)]
                                "
                            />

                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search scan ID..."
                                className="
                                    h-9
                                    w-full
                                    rounded-md
                                    border
                                    border-gray-700
                                    bg-black/20
                                    pl-9
                                    pr-3
                                    text-sm
                                    outline-none
                                    focus:border-blue-400/50
                                "
                            />
                        </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {filtered.map((scan) => (
                            <button
                                key={scan.id}
                                type="button"
                                onClick={() => {
                                    onChange(scan.id);
                                    setOpen(false);
                                }}
                                className="
                                    w-full
                                    border-b
                                    border-gray-700
                                    px-4
                                    py-3
                                    text-left
                                    transition
                                    hover:bg-white/5
                                "
                            >
                                <div className="font-mono text-xs">
                                    {scan.id}
                                </div>

                                <div
                                    className="
                                        mt-1
                                        text-xs
                                        text-[var(--text-secondary)]
                                    "
                                >
                                    {scan.totalTargets} target
                                    {scan.totalTargets !== 1
                                        ? "s"
                                        : ""}

                                    {" • "}

                                    {scan.status}
                                </div>
                            </button>
                        ))}

                        {filtered.length === 0 && (
                            <div
                                className="
                                    px-4
                                    py-8
                                    text-center
                                    text-sm
                                    text-[var(--text-secondary)]
                                "
                            >
                                No scans found.
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}