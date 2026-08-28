import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
    getScan,
    type ScanJob,
    type SecurityFinding,
} from "../../api";

export default function FindingDetails() {
    const { t } = useTranslation();

    const { scanId, findingId } = useParams<{
        scanId: string;
        findingId: string;
    }>();

    const [scan, setScan] = useState<ScanJob | null>(null);
    const [finding, setFinding] = useState<SecurityFinding | null>(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!scanId || !findingId) {
            setError("Missing finding information");
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const result = await getScan(scanId!);

                if (cancelled) {
                    return;
                }

                setScan(result);

                let found: SecurityFinding | undefined;

                for (const target of result.targets ?? []) {
                    const targetFinding =
                        target.analysis?.findings?.find(
                            (item) => item.id === findingId
                        );

                    if (targetFinding) {
                        found = targetFinding;
                        break;
                    }
                }

                if (!found) {
                    setError("Finding not found");
                    return;
                }

                setFinding(found);
            } catch (error) {
                if (!cancelled) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load finding"
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
    }, [scanId, findingId]);

    if (loading) {
        return (
            <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-xl border border-gray-700 bg-white/[0.025] p-8 text-sm text-[var(--text-secondary)]">
                    Loading finding...
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
                <Link
                    to="/findings"
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to findings
                </Link>

                <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 p-5 text-sm text-red-400">
                    {error}
                </div>
            </main>
        );
    }

    if (!finding || !scan) {
        return null;
    }

    const severityStyles = {
        critical: {
            badge: "bg-red-400/10 text-red-400 border-red-400/20",
            border: "border-l-red-500",
        },
        high: {
            badge: "bg-orange-400/10 text-orange-400 border-orange-400/20",
            border: "border-l-orange-500",
        },
        medium: {
            badge: "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
            border: "border-l-yellow-500",
        },
        low: {
            badge: "bg-blue-400/10 text-blue-400 border-blue-400/20",
            border: "border-l-blue-500",
        },
        info: {
            badge: "bg-slate-400/10 text-slate-400 border-slate-400/20",
            border: "border-l-slate-500",
        },
    };

    const styles =
        severityStyles[finding.severity] ??
        severityStyles.info;

    const target = scan.targets?.find((target) =>
        target.analysis?.findings?.some(
            (item) => item.id === finding.id
        )
    );

    return (
        <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link
                    to="/findings"
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to findings
                </Link>

                <div className="mt-5">
                    <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
                        {t("csrdpscanner")}
                    </div>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                        Finding details
                    </h1>

                    <p className="mt-1 font-mono text-xs text-[var(--text-secondary)]">
                        {finding.id}
                    </p>
                </div>
            </div>

            <section className="overflow-hidden rounded-xl border border-gray-700 bg-white/[0.025]">
                <div
                    className={`
                        border-l-2
                        ${styles.border}
                        p-6
                        sm:p-8
                    `}
                >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <span
                                className={`
                                    inline-flex
                                    rounded-full
                                    border
                                    px-2.5
                                    py-1
                                    text-[11px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    ${styles.badge}
                                `}
                            >
                                {t(
                                    `severity.${finding.severity}`
                                )}
                            </span>

                            <h2 className="mt-4 text-xl font-semibold text-[var(--text-primary)]">
                                {finding.title}
                            </h2>
                        </div>

                        {finding.port !== undefined && (
                            <span className="shrink-0 font-mono text-sm text-[var(--text-secondary)]">
                                :{finding.port}
                            </span>
                        )}
                    </div>

                    <p className="mt-5 max-w-4xl text-sm leading-7 text-[var(--text-secondary)]">
                        {finding.description}
                    </p>

                    {finding.service && (
                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <div className="rounded-lg border border-gray-700 bg-black/20 p-4">
                                <div className="text-xs text-[var(--text-secondary)]">
                                    {t("service")}
                                </div>

                                <div className="mt-1 font-mono text-sm">
                                    {finding.service}
                                </div>
                            </div>

                            {target && (
                                <div className="rounded-lg border border-gray-700 bg-black/20 p-4">
                                    <div className="text-xs text-[var(--text-secondary)]">
                                        Host
                                    </div>

                                    <div className="mt-1 font-mono text-sm">
                                        {target.host}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="border-t border-gray-700 p-6 sm:p-8">
                    <h3 className="text-sm font-semibold">
                        {t("evidence")}
                    </h3>

                    {finding.evidence.length > 0 ? (
                        <div className="mt-4 rounded-lg border border-gray-700 bg-black/20 p-4">
                            <ul className="space-y-2">
                                {finding.evidence.map(
                                    (item, index) => (
                                        <li
                                            key={`${item}-${index}`}
                                            className="font-mono text-xs leading-6 text-[var(--text-secondary)]"
                                        >
                                            {item}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-[var(--text-secondary)]">
                            No evidence was recorded.
                        </p>
                    )}
                </div>

                <div className="border-t border-gray-700 p-6 sm:p-8">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <div className="text-xs text-[var(--text-secondary)]">
                                Confidence
                            </div>

                            <div className="mt-1 text-sm font-medium">
                                {Math.round(
                                    finding.confidence * 100
                                )}
                                %
                            </div>
                        </div>

                        <div>
                            <div className="text-xs text-[var(--text-secondary)]">
                                Scan
                            </div>

                            <Link
                                to={`/scans/${scan.id}`}
                                className="mt-1 block truncate font-mono text-xs text-[var(--accent)] hover:underline"
                            >
                                {scan.id}
                            </Link>
                        </div>

                        {target && (
                            <div>
                                <div className="text-xs text-[var(--text-secondary)]">
                                    Target
                                </div>

                                <div className="mt-1 font-mono text-sm">
                                    {target.host}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}