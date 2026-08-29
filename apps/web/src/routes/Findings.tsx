import {
    useEffect,
    useState,
} from "react";

import {
    useTranslation,
} from "react-i18next";

import {
    ShieldAlert,
    Server,
    ArrowRight,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    getScanHistory,
    type ScanHistorySummary,
} from "../api";

function formatDate(
    value?: string
) {
    if (!value) {
        return "—";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
        }
    ).format(
        new Date(value)
    );
}

export default function Findings() {
    const { t } =
        useTranslation();

    const [
        scans,
        setScans,
    ] = useState<
        ScanHistorySummary[]
    >([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState<
        string | null
    >(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            try {
                setLoading(true);
                setError(null);

                const history =
                    await getScanHistory();

                if (cancelled) {
                    return;
                }

                const withFindings =
                    history
                        .filter(
                            (scan) =>
                                scan.findingCount >
                                0
                        )
                        .sort(
                            (a, b) =>
                                new Date(
                                    b.completedAt ??
                                        b.createdAt
                                ).getTime() -
                                new Date(
                                    a.completedAt ??
                                        a.createdAt
                                ).getTime()
                        );

                setScans(
                    withFindings
                );
            } catch (error) {
                if (!cancelled) {
                    setError(
                        error instanceof
                        Error
                            ? error.message
                            : "Failed to load findings"
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(
                        false
                    );
                }
            }
        }

        load();

        return () => {
            cancelled = true;
        };
    }, []);

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
                    {t(
                        "csrdpscanner"
                    )}
                </div>

                <h1
                    className="
                        text-3xl
                        font-semibold
                        tracking-tight
                    "
                >
                    {t("findings1")}
                </h1>

                <p
                    className="
                        mt-1
                        text-sm
                        text-[var(--text-secondary)]
                    "
                >
                    {t(
                        "securityissues"
                    )}
                </p>
            </div>

            {loading && (
                <div
                    className="
                        rounded-xl
                        border
                        border-gray-700
                        bg-white/[0.025]
                        p-8
                        text-sm
                        text-[var(--text-secondary)]
                    "
                >
                    {t(
                        "loadingFindings",
                        {
                            defaultValue:
                                "Loading findings...",
                        }
                    )}
                </div>
            )}

            {error && (
                <div
                    className="
                        rounded-xl
                        border
                        border-red-400/20
                        bg-red-400/5
                        p-5
                        text-sm
                        text-red-400
                    "
                >
                    {error}
                </div>
            )}

            {!loading &&
                !error &&
                scans.length ===
                    0 && (
                    <div
                        className="
                            rounded-xl
                            border
                            border-gray-700
                            bg-white/[0.025]
                            p-10
                            text-center
                        "
                    >
                        <ShieldAlert
                            size={24}
                            className="
                                mx-auto
                                text-emerald-400
                            "
                        />

                        <div className="mt-3 text-sm font-medium">
                            {t(
                                "noFindings"
                            )}
                        </div>
                    </div>
                )}

            {!loading &&
                !error &&
                scans.length >
                    0 && (
                    <div className="space-y-3">
                        {scans.map(
                            (scan) => (
                                <Link
                                    key={
                                        scan.id
                                    }
                                    to={`/findings/${scan.id}`}
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
                                        <div
                                            className="
                                                flex
                                                items-start
                                                justify-between
                                                gap-4
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    min-w-0
                                                    items-start
                                                    gap-3
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        h-9
                                                        w-9
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-lg
                                                        bg-orange-400/10
                                                        text-orange-400
                                                    "
                                                >
                                                    <ShieldAlert
                                                        size={
                                                            18
                                                        }
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <div
                                                        className="
                                                            text-xs
                                                            uppercase
                                                            tracking-wide
                                                            text-[var(--text-secondary)]
                                                        "
                                                    >
                                                        {t(
                                                            "scan"
                                                        )}
                                                    </div>

                                                    <div
                                                        className="
                                                            mt-1
                                                            truncate
                                                            font-mono
                                                            text-sm
                                                            font-medium
                                                        "
                                                    >
                                                        {
                                                            scan.id
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                            <span
                                                className="
                                                    flex
                                                    shrink-0
                                                    items-center
                                                    gap-1.5
                                                    text-xs
                                                    font-medium
                                                    text-blue-400
                                                "
                                            >
                                                {t(
                                                    "view",
                                                    {
                                                        defaultValue:
                                                            "View",
                                                    }
                                                )}

                                                <ArrowRight
                                                    size={
                                                        14
                                                    }
                                                />
                                            </span>
                                        </div>

                                        <div
                                            className="
                                                mt-5
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
                                                    px-4
                                                    py-3
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-xs
                                                        text-[var(--text-secondary)]
                                                    "
                                                >
                                                    <Server
                                                        size={
                                                            14
                                                        }
                                                    />

                                                    {t(
                                                        "targets"
                                                    )}
                                                </div>

                                                <div className="mt-1 text-sm font-semibold">
                                                    {
                                                        scan.totalTargets
                                                    }
                                                </div>
                                            </div>

                                            <div
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-gray-700
                                                    bg-black/10
                                                    px-4
                                                    py-3
                                                "
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        items-center
                                                        gap-2
                                                        text-xs
                                                        text-[var(--text-secondary)]
                                                    "
                                                >
                                                    <ShieldAlert
                                                        size={
                                                            14
                                                        }
                                                    />

                                                    {t(
                                                        "findings1"
                                                    )}
                                                </div>

                                                <div className="mt-1 text-sm font-semibold">
                                                    {
                                                        scan.findingCount
                                                    }
                                                </div>
                                            </div>

                                            <div
                                                className="
                                                    rounded-lg
                                                    border
                                                    border-gray-700
                                                    bg-black/10
                                                    px-4
                                                    py-3
                                                "
                                            >
                                                <div className="text-xs text-[var(--text-secondary)]">
                                                    {t(
                                                        "completed"
                                                    )}
                                                </div>

                                                <div className="mt-1 text-xs font-medium">
                                                    {formatDate(
                                                        scan.completedAt ??
                                                            scan.createdAt
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        )}
                    </div>
                )}
        </main>
    );
}