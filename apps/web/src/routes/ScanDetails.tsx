import { useEffect, useMemo, useState } from "react";
import {
    useParams,
    Link,
} from "react-router-dom";

import {
    getScan,
    type ScanJob,
    type SecurityFinding,
} from "../api.js";

import ScanHistoryDetails from "../components/ScanHistoryDetails.js";

export default function ScanDetails() {
    const { id } = useParams<{
        id: string;
    }>();

    const [scan, setScan] =
        useState<ScanJob | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setError("Missing scan ID");
            setLoading(false);
            return;
        }

        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const result =
                    await getScan(id!);

                if (!cancelled) {
                    setScan(result);
                }
            } catch (error) {
                if (!cancelled) {
                    setError(
                        error instanceof Error
                            ? error.message
                            : "Failed to load scan"
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, [id]);

    const findings = useMemo(() => {
        if (!scan?.targets) {
            return [];
        }

        const result: SecurityFinding[] = [];

        for (const target of scan.targets) {
            if (!target.analysis?.findings) {
                continue;
            }

            result.push(
                ...target.analysis.findings
            );
        }

        return result;
    }, [scan]);

    if (loading) {
        return (
            <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
                Loading scan...
            </main>
        );
    }

    if (error) {
        return (
            <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
                <div className="text-red-500">
                    {error}
                </div>
            </main>
        );
    }

    if (!scan) {
        return (
            <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
                Scan not found.
            </main>
        );
    }

    return (
        <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link
                    to="/scans"
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to scan history
                </Link>

                <div className="mt-4">
                    <h1 className="text-3xl font-semibold">
                        Scan details
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {scan.id}
                    </p>
                </div>
            </div>

            <ScanHistoryDetails
                scan={scan}
                findings={findings}
            />
        </main>
    );
}