import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { useLocation } from "react-router-dom";

import {
    createScan,
    getScan,
    type ScanJob,
} from "../api";

interface ScanSessionContextValue {
    job: ScanJob | null;
    isScanning: boolean;
    startScan: (targets: string[]) => Promise<void>;
    refreshScan: () => Promise<void>;
    clearScan: () => void;
}

const ScanSessionContext =
    createContext<ScanSessionContextValue | null>(null);

export function ScanSessionProvider({
    children,
}: {
    children: ReactNode;
}) {
    const location = useLocation();

    const isScannerPage =
        location.pathname === "/";

    const [job, setJob] =
        useState<ScanJob | null>(null);

    const isScanning =
        job?.status === "queued" ||
        job?.status === "running";

    const startScan = async (targets: string[]) => {
        if (targets.length === 0 || isScanning) {
            return;
        }

        const newJob = await createScan(targets);
        setJob(newJob);
    };

    const refreshScan = async () => {
        if (!job?.id) {
            return;
        }

        const updated =
            await getScan(job.id);

        setJob(updated);
    };

    useEffect(() => {
        if (
            !job?.id ||
            !isScanning ||
            !isScannerPage
        ) {
            return;
        }

        const interval =
            window.setInterval(async () => {
                try {
                    const updated =
                        await getScan(job.id);

                    setJob(updated);
                } catch (error) {
                    console.error(
                        "[Scanner] Poll failed:",
                        error
                    );
                }
            }, 1000);

        return () => {
            window.clearInterval(interval);
        };
    }, [
        job?.id,
        isScanning,
        isScannerPage,
    ]);

    useEffect(() => {
        if (
            !isScannerPage ||
            !job?.id
        ) {
            return;
        }

        refreshScan();
    }, [isScannerPage]);

    const clearScan = () => {
        setJob(null);
    };

    return (
        <ScanSessionContext.Provider
            value={{
                job,
                isScanning,
                startScan,
                refreshScan,
                clearScan,
            }}
        >
            {children}
        </ScanSessionContext.Provider>
    );
}

export function useScanSession() {
    const context =
        useContext(ScanSessionContext);

    if (!context) {
        throw new Error(
            "useScanSession must be used inside ScanSessionProvider"
        );
    }

    return context;
}