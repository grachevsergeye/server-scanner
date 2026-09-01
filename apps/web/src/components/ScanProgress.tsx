import {
    useEffect,
    useState
} from "react";
import { useTranslation } from "react-i18next";
import type { ScanJob } from "../api";

interface ScanProgressProps {
    job: ScanJob;
}

const SCAN_CONCURRENCY = 4;

function formatDuration(ms: number): string {
    const seconds = Math.max(
        0,
        Math.ceil(ms / 1000)
    );

    if (seconds < 60) {
        return `${seconds} second${
            seconds === 1 ? "" : "s"
        }`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (remainingSeconds === 0) {
        return `${minutes} minute${
            minutes === 1 ? "" : "s"
        }`;
    }

    return `${minutes}m ${remainingSeconds}s`;
}

export default function ScanProgress({
    job,
}: ScanProgressProps) {
    const { t } = useTranslation();

    const [now, setNow] = useState(Date.now());

    const percentage =
        job.totalTargets > 0
            ? Math.round(
                  (job.completedTargets /
                      job.totalTargets) *
                      100
              )
            : 0;

    const currentTarget =
        job.targets?.find(
            (target) =>
                target.status === "scanning" ||
                target.status === "inspecting" ||
                target.status === "fingerprinting" ||
                target.status === "risk"
        ) ?? null;

    const isActive =
        job.status === "queued" ||
        job.status === "running";

    const startedAt = job.startedAt
        ? new Date(job.startedAt).getTime()
        : null;

    const elapsedMs =
        job.durationMs != null
            ? job.durationMs
            : startedAt !== null
                ? Math.max(0, now - startedAt)
                : 0;

    const remaining =
        Math.max(
            0,
            job.totalTargets -
                job.completedTargets
        );

    const averagePerTargetMs =
        job.completedTargets > 0
            ? elapsedMs /
              job.completedTargets
            : 0;

    const estimatedRemainingMs =
        averagePerTargetMs > 0
            ? (remaining /
                  SCAN_CONCURRENCY) *
              averagePerTargetMs
            : 0;

    const showEta =
        isActive &&
        job.completedTargets > 0 &&
        remaining > 0;

    useEffect(() => {
        if (!isActive) {
            return;
        }

        const interval = window.setInterval(() => {
            setNow(Date.now());
        }, 1000);

        return () => {
            window.clearInterval(interval);
        };
    }, [isActive]);

    return (
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
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >
                <div>
                    <h2 className="text-base font-semibold">
                        {t("scanProgress")}
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[var(--text-secondary)]
                        "
                    >
                        {t(`status.${job.status}`)}
                    </p>
                </div>

                <span
                    className="
                        rounded-full
                        border
                        border-blue-400/20
                        bg-blue-400/10
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-blue-400
                    "
                >
                    {percentage}%
                </span>
            </div>

            <div className="mt-6">
                <div
                    className="
                        h-2
                        overflow-hidden
                        rounded-full
                        bg-white/5
                    "
                >
                    <div
                        className="
                            h-full
                            rounded-full
                            bg-blue-400
                            transition-all
                            duration-500
                        "
                        style={{
                            width: `${percentage}%`,
                        }}
                    />
                </div>

                <div
                    className="
                        mt-2
                        flex
                        justify-between
                        text-xs
                        text-[var(--text-secondary)]
                    "
                >
                    <span>
                        {job.completedTargets} /{" "}
                        {job.totalTargets}{" "}
                        {t("targets")}
                    </span>

                    <span className="font-medium text-blue-400">
                        {percentage}%
                    </span>
                </div>
            </div>

            {isActive && (
                <div
                    className="
                        mt-6
                        grid
                        gap-3
                        sm:grid-cols-3
                    "
                >
                    <div
                        className="
                            rounded-lg
                            border
                            border-gray-700
                            bg-black/10
                            p-4
                        "
                    >
                        <div
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-[var(--text-secondary)]
                            "
                        >
                            {t("currenttarget")}
                        </div>

                        <div
                            className="
                                mt-2
                                font-mono
                                text-sm
                                text-[var(--text-primary)]
                            "
                        >
                            {currentTarget?.host ??
                                "Waiting..."}
                        </div>
                    </div>

                    <div
                        className="
                            rounded-lg
                            border
                            border-gray-700
                            bg-black/10
                            p-4
                        "
                    >
                        <div
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-[var(--text-secondary)]
                            "
                        >
                            {t("etimatedtime")}
                        </div>

                        <div
                            className="
                                mt-2
                                text-sm
                                font-medium
                                text-blue-400
                            "
                        >
                            {showEta
                                ? `~${formatDuration(
                                      estimatedRemainingMs
                                  )}`
                                : "Calculating..."}
                        </div>
                    </div>

                    <div
                        className="
                            rounded-lg
                            border
                            border-gray-700
                            bg-black/10
                            p-4
                        "
                    >
                        <div
                            className="
                                text-xs
                                font-medium
                                uppercase
                                tracking-wide
                                text-[var(--text-secondary)]
                            "
                        >
                            {t("scantime")}
                        </div>

                        <div
                            className="
                                mt-2
                                text-sm
                                font-medium
                                text-blue-400
                            "
                        >
                            {formatDuration(elapsedMs)}
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}