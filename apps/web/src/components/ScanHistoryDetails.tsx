import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ChevronDown,
    ChevronRight,
} from "lucide-react";

import type { ScanJob } from "../api";
import PortsTable from "./PortsTable";
import FindingCard from "./findings/FindingCard";

interface Props {
    scan: ScanJob;
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

export default function ScanHistoryDetails({
    scan,
}: Props) {
    const { t } = useTranslation();

    const targets =
    scan.targets ?? [];

    const [expandedTargets, setExpandedTargets] =
        useState<Set<string>>(
            () => new Set()
        );

    const toggleTarget = (
        targetId: string
    ) => {
        setExpandedTargets(
            (current) => {
                const next =
                    new Set(current);

                if (
                    next.has(targetId)
                ) {
                    next.delete(
                        targetId
                    );
                } else {
                    next.add(
                        targetId
                    );
                }

                return next;
            }
        );
    };

    const totalFindings = useMemo(
        () =>
            (scan.targets ?? []).reduce(
                (total, target) =>
                    total +
                    (target.analysis
                        ?.findings
                        ?.length ?? 0),
                0
            ),
        [scan.targets]
    );

    return (
        <div className="space-y-6">
            <section
                className="
                    rounded-xl
                    border
                    border-gray-700
                    bg-white/[0.025]
                    p-5
                    sm:p-6
                "
            >
                <div
                    className="
                        grid
                        gap-6
                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >
                    <div>
                        <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                            {t("statusLabel")}
                        </div>

                        <div className="mt-1 font-medium">
                            {t(
                                `status.${scan.status}`
                            )}
                        </div>
                    </div>

                    <div>
                        <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                            {t("targets")}
                        </div>

                        <div className="mt-1 font-medium">
                            {
                                scan.completedTargets
                            }
                            /
                            {
                                scan.totalTargets
                            }
                        </div>
                    </div>

                    <div>
                        <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                            {t("failed")}
                        </div>

                        <div className="mt-1 font-medium">
                            {
                                scan.failedTargets
                            }
                        </div>
                    </div>

                    <div>
                        <div className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">
                            {t("created")}
                        </div>

                        <div className="mt-1 text-sm font-medium">
                            {formatDate(
                                scan.createdAt
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">
                        {t(
                            "targetCount",
                            {
                                count:
                                    targets.length,
                            }
                        )}
                    </h2>

                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {t(
                            "scanTargetsDescription"
                        )}
                    </p>
                </div>

                <div className="space-y-3">
                    {(scan.targets ?? []).map(
                        (target) => {
                            const expanded =
                                expandedTargets.has(
                                    target.id
                                );

                            const ports =
                                target.result
                                    ?.ports ??
                                [];

                            const state =
                                target.result
                                    ?.state ??
                                target.hostState ??
                                "unknown";

                            return (
                                <div
                                    key={
                                        target.id
                                    }
                                    className="
                                        overflow-hidden
                                        rounded-xl
                                        border
                                        border-gray-700
                                        bg-white/[0.025]
                                    "
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            toggleTarget(
                                                target.id
                                            )
                                        }
                                        className="
                                            flex
                                            w-full
                                            items-center
                                            justify-between
                                            gap-4
                                            p-5
                                            text-left
                                            transition
                                            hover:bg-white/[0.025]
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-3
                                            "
                                        >
                                            <div className="text-[var(--text-secondary)]">
                                                {expanded ? (
                                                    <ChevronDown
                                                        size={
                                                            18
                                                        }
                                                    />
                                                ) : (
                                                    <ChevronRight
                                                        size={
                                                            18
                                                        }
                                                    />
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="font-mono text-sm font-medium">
                                                    {
                                                        target.host
                                                    }
                                                </div>

                                                <div
                                                    className="
                                                        mt-1
                                                        flex
                                                        flex-wrap
                                                        gap-x-3
                                                        gap-y-1
                                                        text-xs
                                                        text-[var(--text-secondary)]
                                                    "
                                                >
                                                    <span>
                                                        {t("state")}:{" "}
                                                        {t(`hostState.${state}`, {
                                                            defaultValue: state,
                                                        })}
                                                    </span>

                                                    <span>
                                                        {t(
                                                            "portsDiscovered"
                                                        )}
                                                        {
                                                            ports.length
                                                        }{" "}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <span
                                            className="
                                                shrink-0
                                                rounded-full
                                                bg-white/5
                                                px-2.5
                                                py-1
                                                text-xs
                                                text-[var(--text-secondary)]
                                            "
                                        >
                                            {t(
                                                `targetStatus.${target.status}`,
                                                {
                                                    defaultValue:
                                                        target.status,
                                                }
                                            )}
                                        </span>
                                    </button>

                                    {expanded && (
                                        <div
                                            className="
                                                space-y-5
                                                border-t
                                                border-gray-700
                                                p-5
                                            "
                                        >
                                            <div
                                                className="
                                                    grid
                                                    gap-3
                                                    sm:grid-cols-2
                                                    lg:grid-cols-4
                                                "
                                            >
                                                <div>
                                                    <div className="text-xs text-[var(--text-secondary)]">
                                                        {t(
                                                            "targetId"
                                                        )}
                                                    </div>

                                                    <div className="mt-1 truncate font-mono text-xs">
                                                        {
                                                            target.id
                                                        }
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-xs text-[var(--text-secondary)]">
                                                        {t(
                                                            "hostState1"
                                                        )}
                                                    </div>

                                                    <div className="mt-1 text-sm">
                                                        {t(`hostState.${state}`, {
                                                            defaultValue: state,
                                                        })}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-xs text-[var(--text-secondary)]">
                                                        {t(
                                                            "started"
                                                        )}
                                                    </div>

                                                    <div className="mt-1 text-xs">
                                                        {formatDate(
                                                            target.startedAt
                                                        )}
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="text-xs text-[var(--text-secondary)]">
                                                        {t(
                                                            "completed"
                                                        )}
                                                    </div>

                                                    <div className="mt-1 text-xs">
                                                        {formatDate(
                                                            target.completedAt
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <PortsTable
                                                ports={
                                                    ports
                                                }
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        }
                    )}
                </div>
            </section>

            <section>
                <div
                    className="
                        mb-4
                        flex
                        items-end
                        justify-between
                        gap-4
                    "
                >
                    <div>
                        <h2 className="text-xl font-semibold">
                            {t(
                                "findings1"
                            )}
                        </h2>

                        <p className="mt-1 text-sm text-[var(--text-secondary)] text-center">
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
                            text-[var(--text-secondary)]
                        "
                    >
                        {totalFindings}
                    </span>
                </div>

                {totalFindings === 0 ? (
                    <div
                        className="
                            rounded-xl
                            border
                            border-gray-700
                            bg-white/[0.025]
                            p-8
                            text-center
                            text-sm
                            text-[var(--text-secondary)]
                        "
                    >
                        {t("noFindings")}
                    </div>
                ) : (
                    <div
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
                        {(scan.targets ?? []).flatMap(
                            (target) =>
                                (
                                    target.analysis
                                        ?.findings ??
                                    []
                                ).map(
                                    (
                                        finding
                                    ) => (
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
                                )
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}