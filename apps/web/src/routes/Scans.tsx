import { useEffect, useState } from "react";
import {
    getScanHistory,
    type ScanHistorySummary,
} from "../api.js";

import ScanSearch from "../components/ScanSearch.js";
import ScanHistoryCard from "../components/ScanHistoryCard.js";

import { useTranslation } from "react-i18next";

export default function Scans() {

    const { t } = useTranslation();

    const [scans, setScans] =
        useState<ScanHistorySummary[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [search, setSearch] =
        useState("");

    useEffect(() => {

        let cancelled = false;

        async function load() {

            try {

                setLoading(true);
                setError(null);

                const result =
                    await getScanHistory();

                if (!cancelled) {
                    setScans(result);
                }

            } catch (error) {

                if (!cancelled) {

                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load scan history"
                    );
                }

            } finally {

                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };

    }, []);

    const filteredScans =
        scans.filter(scan => {

            if (!search.trim()) {
                return true;
            }

            const query =
                search
                    .trim()
                    .toLowerCase();

            return scan.targets?.some(
                target =>
                    target.host
                        .toLowerCase()
                        .includes(query)
            );
        });

    return (
        <main
            className="
                mx-auto
                w-full
                max-w-[1600px]
                px-4
                py-8
                sm:px-6
                lg:px-8
            "
        >
            <div className="mb-8">
                <div
                    className="
                        mb-2
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-[var(--accent)]
                    "
                >
                    {t("csrdpscanner")}
                </div>

                <h1
                    className="
                        text-3xl
                        font-semibold
                        tracking-tight
                        text-[var(--text-primary)]
                    "
                >
                    {t("scanHistory")}
                </h1>

                <p className="mt-1 text-sm text-[var(--text-secondary)]">
                    {t("previousscan")}
                </p>
            </div>

            <div className="space-y-4">
                <ScanSearch
                    value={search}
                    onChange={setSearch}
                />

                {loading && (
                    <div className="rounded-xl border border-gray-700 bg-white/[0.025] p-8 text-sm text-[var(--text-secondary)]">
                        Loading scans...
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-5 text-sm text-red-400">
                        {error}
                    </div>
                )}

                {!loading &&
                    !error &&
                    filteredScans.length === 0 && (
                        <div className="rounded-xl border border-gray-7000 bg-white/[0.025] p-10 text-center">
                            <div className="text-sm font-medium">
                                No scans found
                            </div>

                            <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                Try another IP address or hostname.
                            </p>
                        </div>
                    )}

                {!loading &&
                    !error &&
                    filteredScans.length > 0 && (
                        <div className="space-y-3">
                            {filteredScans.map((scan) => (
                                <ScanHistoryCard
                                    key={scan.id}
                                    scan={scan}
                                />
                            ))}
                        </div>
                    )}
            </div>
        </main>
    );
}