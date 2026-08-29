import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    Link,
    useParams,
} from "react-router-dom";

import {
    useTranslation,
} from "react-i18next";

import {
    getScan,
    type ScanJob,
} from "../api";

import FindingCard
    from "../components/findings/FindingCard";

export default function ScanFindings() {
    const { t } =
        useTranslation();

    const { scanId } =
        useParams<{
            scanId: string;
        }>();

    const [
        scan,
        setScan,
    ] =
        useState<
            ScanJob | null
        >(null);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState<
        string | null
    >(null);

    useEffect(() => {
        if (!scanId) {
            setError(
                "Missing scan ID"
            );

            setLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const result =
                    await getScan(
                        scanId!
                    );

                if (!cancelled) {
                    setScan(
                        result
                    );
                }
            } catch (error) {
                if (!cancelled) {
                    setError(
                        error instanceof
                        Error
                            ? error.message
                            : "Failed to load scan findings"
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(
                        false
                    );
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [scanId]);

    const findings =
        useMemo(
            () =>
                (
                    scan?.targets ??
                    []
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
                                finding,
                                target,
                            })
                        )
                ),
            [scan]
        );

    if (loading) {
        return (
            <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
                {t(
                    "loadingFindings",
                    {
                        defaultValue:
                            "Loading findings...",
                    }
                )}
            </main>
        );
    }

    if (error || !scan) {
        return (
            <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    to="/findings"
                    className="text-sm text-blue-400"
                >
                    {" "}
                    {t(
                        "Backfindings"
                    )}
                </Link>

                <div className="mt-6 text-red-400">
                    {error ??
                        "Scan not found"}
                </div>
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link
                    to="/findings"
                    className="
                        text-sm
                        text-[var(--text-secondary)]
                        hover:text-[var(--text-primary)]
                    "
                >
                    {" "}
                    {t(
                        "Backfindings"
                    )}
                </Link>

                <div className="mt-5">
                    <div
                        className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-[var(--accent)]
                        "
                    >
                        {t(
                            "csrdpscanner"
                        )}
                    </div>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                        {t(
                            "securityFindings"
                        )}
                    </h1>

                    <p className="mt-2 font-mono text-xs text-[var(--text-secondary)]">
                        {scan.id}
                    </p>
                </div>
            </div>

            <section
                className="
                    mb-6
                    grid
                    gap-3
                    sm:grid-cols-3
                "
            >
                <div className="rounded-xl border border-gray-700 bg-white/[0.025] p-4">
                    <div className="text-xs text-[var(--text-secondary)]">
                        {t(
                            "targets"
                        )}
                    </div>

                    <div className="mt-1 text-xl font-semibold">
                        {
                            scan.totalTargets
                        }
                    </div>
                </div>

                <div className="rounded-xl border border-gray-700 bg-white/[0.025] p-4">
                    <div className="text-xs text-[var(--text-secondary)]">
                        {t(
                            "findings1"
                        )}
                    </div>

                    <div className="mt-1 text-xl font-semibold">
                        {
                            findings.length
                        }
                    </div>
                </div>

                <div className="rounded-xl border border-gray-700 bg-white/[0.025] p-4">
                    <div className="text-xs text-[var(--text-secondary)]">
                        {t(
                            "statusLabel"
                        )}
                    </div>

                    <div className="mt-1 text-sm font-medium">
                        {t(
                            `status.${scan.status}`
                        )}
                    </div>
                </div>
            </section>

            {findings.length ===
            0 ? (
                <div className="rounded-xl border border-gray-700 bg-white/[0.025] p-10 text-center text-sm text-[var(--text-secondary)]">
                    {t(
                        "noFindings"
                    )}
                </div>
            ) : (
                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-gray-700
                        bg-white/[0.025]
                        divide-y
                        divide-gray-700
                    "
                >
                    {findings.map(
                        ({
                            finding,
                            target,
                        }) => (
                            <FindingCard
                                key={`${target.id}-${finding.id}`}
                                finding={
                                    finding
                                }
                                scanId={
                                    scan.id
                                }
                                targetId={
                                    target.id
                                }
                                host={
                                    target.host
                                }
                                createdAt={
                                    target.completedAt ??
                                    scan.completedAt ??
                                    scan.createdAt
                                }
                            />
                        )
                    )}
                </section>
            )}
        </main>
    );
}