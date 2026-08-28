import { useTranslation } from "react-i18next";
import type { ScanJob } from "../api";

interface ScanProgressProps {
    job: ScanJob;
}

export default function ScanProgress({
    job,
}: ScanProgressProps) {
    const { t } = useTranslation();

    const percentage =
        job.totalTargets > 0
            ? Math.round(
                  (job.completedTargets /
                      job.totalTargets) *
                      100
              )
            : 0;

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
            <div className="flex items-start justify-between gap-4">
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
                    {t(`status.${job.status}`)}
                </span>
            </div>

            <div className="mt-6">
                <div className="h-2 overflow-hidden rounded-full bg-white/5">
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
        </section>
    );
}