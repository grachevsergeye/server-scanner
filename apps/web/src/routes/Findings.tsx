import {
    useEffect,
    useState,
} from "react";

import {
    useTranslation,
} from "react-i18next";

import {
    getScan,
    getScanHistory,
    type FindingWithScan,
} from "../api";

import FindingCard
    from "../components/findings/FindingCard";

export default function Findings() {
    const { t } = useTranslation();

    const [findings, setFindings] =
        useState<FindingWithScan[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const history =
                    await getScanHistory();

                const fullScans =
                    await Promise.all(
                        history.map((scan) =>
                            getScan(scan.id)
                        )
                    );

                if (cancelled) {
                    return;
                }

                const allFindings:
                    FindingWithScan[] =
                    fullScans.flatMap(
                        (scan) =>
                            (
                                scan.targets ?? []
                            ).flatMap(
                                (target) =>
                                    (
                                        target
                                            .analysis
                                            ?.findings ??
                                        []
                                    ).map(
                                        (
                                            finding
                                        ) => ({
                                            ...finding,
                                            scanId:
                                                scan.id,
                                            host:
                                                target.host,
                                            createdAt:
                                                scan.createdAt,
                                        })
                                    )
                            )
                    );

                setFindings(
                    allFindings
                );
            } catch (error) {
                if (!cancelled) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load findings"
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
                    "
                >
                    {t("findings")}
                </h1>

                <p
                    className="
                        mt-1
                        text-sm
                        text-[var(--text-secondary)]
                    "
                >
                    Security issues discovered
                    across your infrastructure
                    scans.
                </p>
            </div>

            {loading && (
                <div
                    className="
                        rounded-xl
                        border
                        border-gray-700
                        bg-white/[0.025]
                        p-8
                        text-sm
                        text-[var(--text-secondary)]
                    "
                >
                    Loading findings...
                </div>
            )}

            {error && (
                <div
                    className="
                        rounded-xl
                        border
                        border-red-400/20
                        bg-red-400/5
                        p-5
                        text-sm
                        text-red-400
                    "
                >
                    {error}
                </div>
            )}

            {!loading && !error && (
                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-gray-700
                        bg-white/[0.025]
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-gray-700
                            p-5
                            sm:p-6
                        "
                    >
                        <div>
                            <h2 className="text-base font-semibold">
                                {t(
                                    "securityFindings"
                                )}
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-sm
                                    text-[var(--text-secondary)]
                                "
                            >
                                Security findings
                                discovered during
                                your scans.
                            </p>
                        </div>

                        <span
                            className="
                                rounded-full
                                bg-white/5
                                px-2.5
                                py-1
                                text-xs
                                font-medium
                                text-[var(--text-secondary)]
                            "
                        >
                            {findings.length}
                        </span>
                    </div>

                    {findings.length === 0 ? (
                        <div
                            className="
                                px-5
                                py-12
                                text-center
                                text-sm
                                text-emerald-400
                                sm:px-6
                            "
                        >
                            ✓ No findings have
                            been detected.
                        </div>
                    ) : (
                        <div className="divide-y divide-white/10">
                            {findings.map(
                                (finding) => (
                                    <FindingCard
                                        key={`${finding.scanId}-${finding.id}`}
                                        finding={
                                            finding
                                        }
                                        scanId={
                                            finding.scanId
                                        }
                                    />
                                )
                            )}
                        </div>
                    )}
                </section>
            )}
        </main>
    );
}