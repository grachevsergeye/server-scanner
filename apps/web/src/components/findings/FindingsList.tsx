import { useTranslation } from "react-i18next";

import type {
    ScanStatus,
    SecurityFinding,
} from "../../api";

import FindingCard from "./FindingCard";

interface FindingsListProps {
    findings: SecurityFinding[];
    status: ScanStatus;
}

export default function FindingsList({
    findings,
    status,
}: FindingsListProps) {
    const { t } = useTranslation();

    const isScanning =
        status === "queued" ||
        status === "running";

    return (
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
                        {t("securityFindings")}
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[var(--text-secondary)]
                        "
                    >
                        {t(
                            "securityFindingsDescription"
                        )}
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

            {isScanning ? (
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        px-5
                        py-10
                        text-sm
                        text-[var(--text-secondary)]
                        sm:px-6
                        text-center
                    "
                >
                    <span className="animate-pulse">
                        •
                    </span>

                    {t("findingsScanning")}
                </div>
            ) : findings.length === 0 ? (
                <div
                    className="
                        flex
                        items-center
                        gap-2
                        px-5
                        py-10
                        text-sm
                        text-emerald-400
                        sm:px-6
                    "
                >
                    <span>✓</span>

                    {t("noFindings")}
                </div>
            ) : (
                <div className="divide-y divide-white/10">
                    {findings.map((finding) => (
                        <FindingCard
                            key={finding.id}
                            finding={finding}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}