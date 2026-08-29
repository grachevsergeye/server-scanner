import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { SecurityFinding } from "../../api";

interface FindingCardProps {
    finding: SecurityFinding;
    scanId?: string;
    targetId?: string;
    host?: string;
    createdAt?: string;
}

function formatDate(value?: string) {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "medium",
        }
    ).format(new Date(value));
}

export default function FindingCard({
    finding,
    scanId,
    targetId,
    host,
    createdAt,
}: FindingCardProps) {
    const { t } = useTranslation();

    const severityStyles = {
        critical: {
            badge:
                "bg-red-400/10 text-red-400 border-red-400/20",
            border:
                "border-l-red-500",
        },
        high: {
            badge:
                "bg-orange-400/10 text-orange-400 border-orange-400/20",
            border:
                "border-l-orange-500",
        },
        medium: {
            badge:
                "bg-yellow-400/10 text-yellow-400 border-yellow-400/20",
            border:
                "border-l-yellow-500",
        },
        low: {
            badge:
                "bg-blue-400/10 text-blue-400 border-blue-400/20",
            border:
                "border-l-blue-500",
        },
        info: {
            badge:
                "bg-slate-400/10 text-slate-400 border-slate-400/20",
            border:
                "border-l-slate-500",
        },
    };

    const styles =
        severityStyles[finding.severity] ??
        severityStyles.info;

    const hasContext =
        Boolean(scanId) ||
        Boolean(host) ||
        Boolean(createdAt) ||
        Boolean(targetId);

    return (
        <article
            className={`
                border-l-2
                ${styles.border}
                p-5
                transition
                hover:bg-white/[0.015]
                sm:p-6
            `}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <span
                        className={`
                            inline-flex
                            rounded-full
                            border
                            px-2
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

                    <h3
                        className="
                            mt-3
                            text-sm
                            font-semibold
                            text-[var(--text-primary)]
                        "
                    >
                        {t(finding.titleKey)}
                    </h3>

                    {(host ||
                        finding.port !== undefined ||
                        finding.service) && (
                        <div
                            className="
                                mt-2
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >
                            {host && (
                                <span className="font-mono text-sm">
                                    {host}
                                    {finding.port !==
                                        undefined
                                        ? `:${finding.port}`
                                        : ""}
                                </span>
                            )}

                            {!host &&
                                finding.port !==
                                    undefined && (
                                    <span className="font-mono text-sm">
                                        :{finding.port}
                                    </span>
                                )}

                            {finding.service && (
                                <span
                                    className="
                                        rounded-md
                                        bg-white/5
                                        px-2
                                        py-0.5
                                        text-xs
                                        text-[var(--text-secondary)]
                                    "
                                >
                                    {finding.service}
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <p
                className="
                    mt-4
                    text-sm
                    leading-6
                    text-[var(--text-secondary)]
                "
            >
                {t(finding.descriptionKey)}
            </p>

            {finding.evidence.length > 0 && (
                <div
                    className="
                        mt-5
                        rounded-lg
                        border
                        border-gray-700
                        bg-black/20
                        p-4
                    "
                >
                    <div
                        className="
                            mb-2
                            text-xs
                            font-medium
                            text-[var(--text-secondary)]
                        "
                    >
                        {t("evidence")}
                    </div>

                    <ul className="space-y-1.5">
                        {finding.evidence.map((item, index) => (
                            <li
                                key={`${item.key}-${index}`}
                                className="
                                    font-mono
                                    text-xs
                                    leading-5
                                    text-[var(--text-secondary)]
                                "
                            >
                                {t(item.key, item.params)}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div
                className="
                    mt-4
                    text-xs
                    text-[var(--text-secondary)]
                "
            >
                {t("confidence")}:{" "}
                <span className="font-medium text-[var(--text-primary)]">
                    {Math.round(
                        finding.confidence * 100
                    )}
                    %
                </span>
            </div>

            {hasContext && (
                <div
                    className="
                        mt-5
                        grid
                        gap-3
                        border-t
                        border-gray-700
                        pt-5
                        sm:grid-cols-2
                        lg:grid-cols-3
                    "
                >
                    {host && (
                        <div>
                            <div className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">
                                {t("target")}
                            </div>

                            <div className="mt-1 font-mono text-xs">
                                {host}
                            </div>
                        </div>
                    )}

                    {createdAt && (
                        <div>
                            <div className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">
                                {t("detected")}
                            </div>

                            <div className="mt-1 text-xs">
                                {formatDate(
                                    createdAt
                                )}
                            </div>
                        </div>
                    )}

                    {targetId && (
                        <div className="min-w-0">
                            <div className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">
                                {t("targetId")}
                            </div>

                            <div className="mt-1 truncate font-mono text-xs">
                                {targetId}
                            </div>
                        </div>
                    )}

                    {scanId && (
                        <div className="min-w-0 sm:col-span-2">
                            <div className="text-[11px] uppercase tracking-wide text-[var(--text-secondary)]">
                                {t("scan")}
                            </div>

                            <Link
                                to={`/scans/${scanId}`}
                                className="
                                    mt-1
                                    block
                                    truncate
                                    font-mono
                                    text-xs
                                    text-blue-400
                                    hover:text-blue-300
                                "
                            >
                                {scanId}
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {scanId && (
                <div
                    className="
                        mt-5
                        flex
                        justify-end
                    "
                >
                    <Link
                        to={`/findings/${scanId}/${targetId}/${finding.id}`}
                        className="
                            text-xs
                            font-medium
                            text-blue-400
                            transition
                            hover:text-blue-300
                        "
                    >
                        {t("viewFinding")} →
                    </Link>
                </div>
            )}
        </article>
    );
}