import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import ScanForm from "../components/ScanForm";
import ScanProgress from "../components/ScanProgress";
import ScanSummary from "../components/ScanSummary";
import PortsTable from "../components/PortsTable";
import FindingsList from "../components/findings/FindingsList";

import {
    useScanSession,
} from "../context/ScanSessionContext";

export default function Scanner() {
    const { t } = useTranslation();

    const [target, setTarget] =
        useState("");

    const {
        job,
        isScanning,
        startScan,
    } = useScanSession();

    const parseTargets = (input: string): string[] => {
        return input
            .split(/[\n,\s]+/)
            .map((target) => target.trim())
            .filter(Boolean);
    };

    const handleScan = async () => {
        const targets = parseTargets(target);

        if (targets.length === 0 || isScanning) {
            return;
        }

        try {
            await startScan(targets);
        } catch (error) {
            console.error("[Frontend] Scan failed:", error);
        }
    };

    const findings = useMemo(() => {
        return (
            job?.targets?.flatMap(
                (target) =>
                    target.analysis?.findings ?? []
            ) ?? []
        );
    }, [job]);

    const ports = useMemo(() => {
        return (
            job?.targets?.flatMap(
                (target) =>
                    target.result?.ports ?? []
            ) ?? []
        );
    }, [job]);

    return (
        <main
            className="
                mx-auto
                w-full
                max-w-[1600px]
                px-4
                py-8
                sm:px-6
                lg:px-8
            "
        >
            <div className="mb-8">
                <div
                    className="
                        mb-2
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-[var(--accent)]
                    "
                >
                    {t("csrdpscanner")}
                </div>

                <h1
                    className="
                        text-3xl
                        font-semibold
                        tracking-tight
                        text-[var(--text-primary)]
                    "
                >
                    {t("infrastructure")}
                </h1>
            </div>

            <ScanForm
                target={target}
                disabled={Boolean(
                    isScanning
                )}
                onChange={setTarget}
                onSubmit={handleScan}
            />

            {job && (
                <div className="mt-6 space-y-6">
                    <ScanProgress
                        job={job}
                    />

                    <ScanSummary
                        job={job}
                    />

                    {job.targets &&
                        job.targets.length >
                            0 && (
                            <>
                                <PortsTable
                                    ports={
                                        ports
                                    }
                                />

                                <FindingsList
                                    findings={findings}
                                    status={job.status}
                                />
                            </>
                        )}
                </div>
            )}
        </main>
    );
}