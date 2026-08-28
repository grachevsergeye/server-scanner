import type {
    ScanJob,
    SecurityFinding,
} from "../api.js";

interface Props {
    scan: ScanJob;
    findings: SecurityFinding[];
}

function formatDate(
    value?: string
) {
    if (!value) {
        return "—";
    }

    return new Date(value).toLocaleString();
}

function severityClass(
    severity: SecurityFinding["severity"]
) {
    switch (severity) {
        case "critical":
            return "text-red-500";

        case "high":
            return "text-orange-500";

        case "medium":
            return "text-yellow-500";

        case "low":
            return "text-blue-500";

        case "info":
            return "text-muted-foreground";
    }
}

export default function ScanHistoryDetails({
    scan,
    findings,
}: Props) {
    return (
        <div className="space-y-6">

            {/* Scan summary */}

            <section
                className="
                    rounded-xl
                    border
                    border-gray-700
                    bg-[var(--bg-secondary)]
                    p-6
                "
            >
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

                    <div>
                        <div className="text-sm text-muted-foreground">
                            Status
                        </div>

                        <div className="mt-1 font-medium">
                            {scan.status}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-muted-foreground">
                            Targets
                        </div>

                        <div className="mt-1 font-medium">
                            {scan.completedTargets}
                            /
                            {scan.totalTargets}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-muted-foreground">
                            Failed
                        </div>

                        <div className="mt-1 font-medium">
                            {scan.failedTargets}
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-muted-foreground">
                            Created
                        </div>

                        <div className="mt-1 font-medium">
                            {formatDate(
                                scan.createdAt
                            )}
                        </div>
                    </div>

                </div>
            </section>

            {/* Targets */}

            <section>
                <div className="mb-4">
                    <h2 className="text-xl font-semibold">
                        Targets
                    </h2>
                </div>

                <div className="space-y-3">
                    {scan.targets?.map(
                        (target) => (
                            <div
                                key={target.id}
                                className="
                                    rounded-xl
                                    border
                                    border-gray-700
                                    bg-[var(--bg-secondary)]
                                    p-5
                                "
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="font-medium">
                                            {target.host}
                                        </div>

                                        <div className="mt-1 text-sm text-muted-foreground">
                                            {target.hostState ??
                                                "Unknown state"}
                                        </div>
                                    </div>

                                    <div className="text-sm">
                                        {target.status}
                                    </div>
                                </div>

                                {target.result && (
                                    <div className="mt-4 text-sm text-muted-foreground">
                                        {target.result.ports.length}
                                        {" "}
                                        ports discovered
                                    </div>
                                )}
                            </div>
                        )
                    )}
                </div>
            </section>

            {/* Findings */}

            <section>
                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Findings
                            </h2>

                            <p className="mt-1 text-sm text-muted-foreground">
                                Security findings discovered during this scan.
                            </p>
                        </div>

                        <div className="text-sm text-muted-foreground">
                            {findings.length}
                        </div>
                    </div>
                </div>

                {findings.length === 0 ? (
                    <div
                        className="
                            rounded-xl
                            border
                            border-gray-700
                            bg-[var(--bg-secondary)]
                            p-8
                            text-center
                            text-muted-foreground
                        "
                    >
                        No findings were detected.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {findings.map(
                            (finding) => (
                                <div
                                    key={finding.id}
                                    className="
                                        rounded-xl
                                        border
                                        border-gray-700
                                        bg-[var(--bg-secondary)]
                                        p-5
                                    "
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <h3 className="font-medium">
                                                {finding.title}
                                            </h3>

                                            <div className="mt-1 text-sm text-muted-foreground">
                                                {finding.service ??
                                                    "Unknown service"}

                                                {finding.port !==
                                                    undefined &&
                                                    ` · Port ${finding.port}`}
                                            </div>
                                        </div>

                                        <div
                                            className={`shrink-0 text-sm font-semibold uppercase ${severityClass(
                                                finding.severity
                                            )}`}
                                        >
                                            {finding.severity}
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-muted-foreground">
                                        {finding.description}
                                    </p>

                                    {finding.evidence.length >
                                        0 && (
                                        <div className="mt-4">
                                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                Evidence
                                            </div>

                                            <div className="space-y-1">
                                                {finding.evidence.map(
                                                    (
                                                        evidence,
                                                        index
                                                    ) => (
                                                        <div
                                                            key={
                                                                index
                                                            }
                                                            className="
                                                                rounded-md
                                                                bg-black/20
                                                                px-3
                                                                py-2
                                                                font-mono
                                                                text-xs
                                                            "
                                                        >
                                                            {evidence}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4 text-xs text-muted-foreground">
                                        Confidence:{" "}
                                        {Math.round(
                                            finding.confidence *
                                                100
                                        )}
                                        %
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}