import {
    ArrowRight,
    CheckCircle2,
    CircleAlert,
    Clock3,
    Server,
    ShieldAlert,
} from "lucide-react";

import { Link } from "react-router-dom";
import type { ScanHistorySummary } from "../api.js";

import { useTranslation } from "react-i18next";

interface Props {
    scan: ScanHistorySummary;
}

function formatDate(value: string) {
    return new Date(value).toLocaleString();
}

function getStatusConfig(
    status: ScanHistorySummary["status"]
) {
    switch (status) {
        case "completed":
            return {
                className:
                    "border-emerald-400/20 bg-emerald-400/10 text-emerald-400",
                icon: CheckCircle2,
            };

        case "failed":
            return {
                className:
                    "border-red-400/20 bg-red-400/10 text-red-400",
                icon: CircleAlert,
            };

        case "running":
            return {
                className:
                    "border-blue-400/20 bg-blue-400/10 text-blue-400",
                icon: Clock3,
            };

        case "queued":
            return {
                className:
                    "border-yellow-400/20 bg-yellow-400/10 text-yellow-400",
                icon: Clock3,
            };

        case "cancelled":
        default:
            return {
                className:
                    "border-gray-700 bg-white/5 text-[var(--text-secondary)]",
                icon: CircleAlert,
            };
    }
}

function Stat({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Server;
    label: string;
    value: string | number;
}) {
    return (
        <div className="rounded-lg border border-gray-700 bg-black/10 px-4 py-3">
            <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                <Icon size={14} />
                {label}
            </div>

            <div className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
                {value}
            </div>
        </div>
    );
}

export default function ScanHistoryCard({
    scan,
}: Props) {
    const status = getStatusConfig(scan.status);
    const StatusIcon = status.icon;

    const { t } = useTranslation();

    const title =
        scan.targets.length === 1
            ? scan.targets[0]?.host ??
            t("unknownTarget")
            : t("targetCount", {
                count:
                    scan.targets.length,
            });

    return (
        <Link
            to={`/scans/${scan.id}`}
            className="
                group
                block
                overflow-hidden
                rounded-xl
                border
                border-gray-700
                bg-white/[0.025]
                transition
                hover:border-blue-400/20
                hover:bg-white/[0.04]
            "
        >
            <div className="p-5 sm:p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <div className="flex items-center gap-3">
                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-400/10
                                    text-blue-400
                                "
                            >
                                <Server size={18} />
                            </div>

                            <div className="min-w-0">
                                <h2 className="truncate text-base font-semibold">
                                    {title}
                                </h2>

                                <p className="mt-1 text-xs text-[var(--text-secondary)]">
                                    {formatDate(scan.createdAt)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <span
                        className={`
                            inline-flex
                            w-fit
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            px-2.5
                            py-1
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-wide
                            ${status.className}
                        `}
                    >
                        <StatusIcon size={13} />
                        {t(`status.${scan.status}`)}
                    </span>
                </div>

                <div
                    className="
                        mt-5
                        grid
                        grid-cols-2
                        gap-3
                        sm:grid-cols-4
                    "
                >
                    <Stat
                        icon={Server}
                        label={t("targets")}
                        value={`${scan.completedTargets}/${scan.totalTargets}`}
                    />

                    <Stat
                        icon={Server}
                        label={t("ports")}
                        value={scan.portCount}
                    />

                    <Stat
                        icon={ShieldAlert}
                        label={t("findings1")}
                        value={scan.findingCount}
                    />

                    <Stat
                        icon={CircleAlert}
                        label={t("failed")}
                        value={scan.failedTargets}
                    />
                </div>
            </div>

            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-t
                    border-gray-700
                    bg-black/10
                    px-5
                    py-3
                    text-xs
                    text-[var(--text-secondary)]
                    sm:px-6
                "
            >
                <span className="font-mono">
                    {scan.id}
                </span>

                <span
                    className="
                        flex
                        items-center
                        gap-1.5
                        font-medium
                        text-blue-400
                        transition
                        group-hover:gap-2
                    "
                >
                    {t("viewScan")}
                    <ArrowRight size={14} />
                </span>
            </div>
        </Link>
    );
}