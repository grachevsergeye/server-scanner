import { useTranslation } from "react-i18next";
import {
    Server,
    Radio,
    Network,
    ShieldAlert,
} from "lucide-react";

import type { ScanJob } from "../api";

interface ScanSummaryProps {
    job: ScanJob;
}

export default function ScanSummary({
    job,
}: ScanSummaryProps) {
    const { t } = useTranslation();

    const targets = job.targets ?? [];

    const hostsUp = targets.filter(
        (target) =>
            target.result?.state === "up"
    ).length;

    const openPorts = targets.reduce(
        (total, target) =>
            total +
            (target.result?.ports.filter(
                (port) =>
                    port.state === "open"
            ).length ?? 0),
        0
    );

    const findings = targets.reduce(
        (total, target) =>
            total +
            (target.analysis?.findings
                ?.length ?? 0),
        0
    );

    const stats = [
        {
            label: t("hosts"),
            value: job.totalTargets,
            icon: Server,
        },
        {
            label: t("hostsUp"),
            value: hostsUp,
            icon: Radio,
        },
        {
            label: t("openPorts"),
            value: openPorts,
            icon: Network,
        },
        {
            label: t("findings1"),
            value: findings,
            icon: ShieldAlert,
        },
    ];

    return (
        <section
            className="
                grid
                grid-cols-2
                gap-3
                lg:grid-cols-4
            "
        >
            {stats.map((stat) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={stat.label}
                        className="
                            rounded-xl
                            border
                            border-gray-700
                            bg-white/[0.025]
                            p-4
                            sm:p-5
                        "
                    >
                        <div className="flex items-center justify-between">
                            <span
                                className="
                                    text-xs
                                    font-medium
                                    uppercase
                                    tracking-wide
                                    text-[var(--text-secondary)]
                                "
                            >
                                {stat.label}
                            </span>

                            <Icon
                                size={16}
                                className="text-blue-400/70"
                            />
                        </div>

                        <strong
                            className="
                                mt-3
                                block
                                text-2xl
                                font-semibold
                            "
                        >
                            {stat.value}
                        </strong>
                    </div>
                );
            })}
        </section>
    );
}