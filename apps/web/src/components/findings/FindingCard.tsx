import { useTranslation } from "react-i18next";
import type { SecurityFinding } from "../../api";
import { Link } from "react-router-dom";

interface FindingCardProps {
    finding: SecurityFinding;
    scanId?: string;
}

export default function FindingCard({
    finding,
    scanId,
}: FindingCardProps) {
    const { t } = useTranslation();

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
        severityStyles[
            finding.severity as keyof typeof severityStyles
        ] ?? severityStyles.info;

        const content = (
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
                    <div>
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
                            {finding.title}
                        </h3>
                    </div>

                    {finding.port && (
                        <span
                            className="
                                shrink-0
                                font-mono
                                text-xs
                                text-[var(--text-secondary)]
                            "
                        >
                            :{finding.port}
                        </span>
                    )}
                </div>

                <p
                    className="
                        mt-3
                        text-sm
                        leading-6
                        text-[var(--text-secondary)]
                    "
                >
                    {finding.description}
                </p>

                {finding.service && (
                    <div
                        className="
                            mt-4
                            flex
                            items-center
                            gap-2
                            text-xs
                        "
                    >
                        <span className="text-[var(--text-secondary)]">
                            {t("service")}
                        </span>

                        <strong className="font-medium">
                            {finding.service}
                        </strong>
                    </div>
                )}

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
                            {finding.evidence.map(
                                (item, index) => (
                                    <li
                                        key={`${item}-${index}`}
                                        className="
                                            font-mono
                                            text-xs
                                            leading-5
                                            text-[var(--text-secondary)]
                                        "
                                    >
                                        {item}
                                    </li>
                                )
                            )}
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
            </article>
        );

        if (!scanId) {
            return content;
        }

        return (
            <Link
                to={`/findings/${scanId}/${finding.id}`}
                className="block"
            >
                {content}
            </Link>
        );
}