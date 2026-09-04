import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import {
    SlidersHorizontal,
    RotateCcw,
    Download,
    Eye,
    ShieldCheck,
} from "lucide-react";

import {
    getAnalyticsOverview,
    getAnalytics,
    previewAnalyticsDelete,
    deleteAnalytics,
    exportAnalyticsCsv,
    type AnalyticsOverview,
    type AnalyticsDataset,
    type AnalyticsFilters,
    type AnalyticsQueryResult,
    type AnalyticsClick,
    type AnalyticsClickEvent,
} from "../api";

import DateTimePicker from "../components/DateTimePicker";
import AnimatedSelect from "../components/AnimatedSelect";

type AnalyticsMode =
    | "viewer"
    | "admin";

type DeleteMode =
    | "filtered"
    | "last"
    | "range";

export default function Analytics() {
    const { t } = useTranslation();

    const [mode, setMode] =
        useState<AnalyticsMode>("viewer");

    const [filters, setFilters] =
        useState<AnalyticsFilters>({
            dataset: "click_events",
            source: "",
            trafficSource: "",
            ip: "",
            targetUrl: "",
            from: "",
            to: "",
            limit: 50,
            offset: 0,
        });

    const [appliedFilters, setAppliedFilters] =
        useState<AnalyticsFilters>(filters);

    const [rows, setRows] = useState<
        (AnalyticsClick | AnalyticsClickEvent)[]
    >([]);

    const [total, setTotal] = useState(0);

    const [deleteMode, setDeleteMode] =
        useState<DeleteMode>("filtered");

    const [deleteLastCount, setDeleteLastCount] =
        useState(3);

    const [deletePreviewCount, setDeletePreviewCount] =
        useState<number | null>(null);

    const [confirmDelete, setConfirmDelete] =
        useState(false);

    const [overview, setOverview] =
        useState<AnalyticsOverview | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const [adminLoading, setAdminLoading] =
        useState(false);

    const [adminMessage, setAdminMessage] =
        useState("");

    const inputClass = `
        h-10
        w-full
        rounded-lg
        border
        border-gray-700
        bg-[var(--bg-primary)]
        px-3
        text-sm
        text-[var(--text-primary)]
        placeholder:text-[var(--text-muted)]
        transition
        duration-150
        focus:border-blue-400/50
        focus:outline-none
        focus:ring-1
        focus:ring-blue-400/20
        disabled:cursor-not-allowed
        disabled:opacity-40
    `;

    function eventLabel(value?: string) {
        if (!value) {
            return "—";
        }

        const translations: Record<string, string> = {
            tariff_vps_1m: t("eventTariffVps1m"),
            tariff_vds_1m_fin: t(
                "eventTariffVds1mFin",
            ),
            login_click: t("eventLoginClick"),
            register_click: t("eventRegisterClick"),
        };

        return translations[value] ?? value;
    }

    async function loadAnalytics(
        nextFilters = appliedFilters
    ) {
        try {
            setLoading(true);
            setError(null);

            const [
                overviewData,
                analyticsData,
            ] = (await Promise.all([
                getAnalyticsOverview(),
                getAnalytics<
                    AnalyticsClick | AnalyticsClickEvent
                >(nextFilters),
            ])) as [
                AnalyticsOverview,
                AnalyticsQueryResult<
                    AnalyticsClick | AnalyticsClickEvent
                >,
            ];

            setOverview(overviewData);
            setRows(analyticsData.rows);
            setTotal(analyticsData.total);
        } catch (error) {
            console.error(error);
            setError("Failed to load analytics");
        } finally {
            setLoading(false);
        }
    }

    async function prepareDelete() {
        setAdminLoading(true);
        setAdminMessage("");

        try {
            if (deleteMode === "filtered") {
                const hasFilter =
                    Boolean(
                        appliedFilters.source ||
                        appliedFilters.trafficSource ||
                        appliedFilters.ip ||
                        appliedFilters.targetUrl ||
                        appliedFilters.from ||
                        appliedFilters.to
                    );

                if (!hasFilter) {
                    throw new Error(
                        "Add at least one filter before deleting filtered results."
                    );
                }
            }

            if (deleteMode === "range") {
                if (
                    !appliedFilters.from ||
                    !appliedFilters.to
                ) {
                    throw new Error(
                        "Select both a start and end date."
                    );
                }

                if (
                    appliedFilters.from >
                    appliedFilters.to
                ) {
                    throw new Error(
                        "The start date must be before the end date."
                    );
                }
            }

            const preview =
                await previewAnalyticsDelete(
                    appliedFilters,
                    deleteMode,
                    deleteMode === "last"
                        ? deleteLastCount
                        : undefined,
                );

            if (preview.count === 0) {
                setAdminMessage(
                    "No matching records found."
                );
                return;
            }

            setDeletePreviewCount(
                preview.count
            );

            setConfirmDelete(true);
        } catch (error) {
            setAdminMessage(
                error instanceof Error
                    ? error.message
                    : "Failed to prepare deletion."
            );
        } finally {
            setAdminLoading(false);
        }
    }

    async function executeDelete() {
        setAdminLoading(true);
        setAdminMessage("");

        try {
            const result =
                await deleteAnalytics({
                    dataset:
                        appliedFilters.dataset,

                    mode: deleteMode,

                    filters: appliedFilters,

                    ...(deleteMode === "last"
                        ? {
                            count:
                                deleteLastCount,
                        }
                        : {}),
                });

            setAdminMessage(
                `Deleted ${result.deleted} record${
                    result.deleted === 1
                        ? ""
                        : "s"
                }.`
            );

            setConfirmDelete(false);
            setDeletePreviewCount(null);

            const [
                overviewData,
                analyticsData,
            ] = await Promise.all([
                getAnalyticsOverview(),
                getAnalytics<
                    AnalyticsClick | AnalyticsClickEvent
                >(
                    appliedFilters
                ),
            ]);

            setOverview(
                overviewData
            );

            setRows(
                analyticsData.rows
            );

            setTotal(
                analyticsData.total
            );
        } catch (error) {
            setAdminMessage(
                error instanceof Error
                    ? error.message
                    : "Delete failed."
            );
        } finally {
            setAdminLoading(false);
        }
    }

    useEffect(() => {
        loadAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                Loading analytics...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div
            className="
                mx-auto
                w-full
                max-w-[1600px]
                px-4
                py-8
                sm:px-6
                lg:px-8
                mb-8
            "
        >
            {/* Page heading */}
            <div className="mb-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        {t("analytics")}
                    </h1>

                    <p className="mt-1 text-sm text-[var(--text-muted)]">
                        {t("analyticsDescription")}
                    </p>
                </div>

                <div
                    className="
                        relative
                        flex
                        w-[210px]
                        rounded-xl
                        border
                        border-gray-700
                        bg-black/20
                        p-1
                        shadow-inner
                    "
                >
                    {/* Sliding indicator */}
                    <div
                        className="
                            pointer-events-none
                            absolute
                            inset-y-1
                            left-1
                            w-[calc(50%_-_4px)]
                            rounded-lg
                            bg-gradient-to-br
                            from-[var(--accent)]
                            to-blue-500
                            shadow-lg
                            shadow-blue-500/30
                            transition-all
                            duration-300
                            ease-[cubic-bezier(0.22,1,0.36,1)]
                        "
                        style={{
                            transform:
                                mode === "admin"
                                    ? "translateX(calc(100% + 4px))"
                                    : "translateX(0)",
                        }}
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setMode("viewer")
                        }
                        className={`
                            relative
                            z-10
                            flex
                            h-10
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            text-sm
                            font-medium
                            transition-all
                            duration-300
                            ${
                                mode === "viewer"
                                    ? "scale-[1.02] text-white"
                                    : "text-[var(--text-muted)] hover:text-white"
                            }
                        `}
                    >
                        <Eye
                            size={16}
                            className={`
                                transition-all
                                duration-300
                                ${
                                    mode === "viewer"
                                        ? "scale-110"
                                        : "scale-100"
                                }
                            `}
                        />

                        <span>
                            {t("viewer")}
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setMode("admin")
                        }
                        className={`
                            relative
                            z-10
                            flex
                            h-10
                            flex-1
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            text-sm
                            font-medium
                            transition-all
                            duration-300
                            ${
                                mode === "admin"
                                    ? "scale-[1.02] text-white"
                                    : "text-[var(--text-muted)] hover:text-white"
                            }
                        `}
                    >
                        <ShieldCheck
                            size={16}
                            className={`
                                transition-all
                                duration-300
                                ${
                                    mode === "admin"
                                        ? "scale-110"
                                        : "scale-100"
                                }
                            `}
                        />

                        <span>
                            {t("admin")}
                        </span>
                    </button>
                </div>

            </div>

            <div className="
                mt-6
                rounded-xl
                border
                border-gray-700
                bg-white/[0.025]
                p-5
            ">
                <div className="mb-4">
                    <h2 className="font-semibold">
                        {t("filters")}
                    </h2>

                    <p className="
                        mt-1
                        text-sm
                        text-[var(--text-muted)]
                    ">
                        {t("analyticsFiltersDescription")}
                    </p>
                </div>

                <div className="
                    grid
                    gap-3
                    md:grid-cols-2
                    xl:grid-cols-4
                ">
                <AnimatedSelect
                    value={filters.dataset}
                    onChange={(dataset) => {
                        setFilters((current) => ({
                            ...current,
                            dataset,
                            offset: 0,
                        }));
                    }}
                    options={[
                        {
                            value: "click_events",
                            label: t("clickevents"),
                        },
                        {
                            value: "link_clicks",
                            label: t("linkclicks"),
                        },
                    ]}
                />

                    <input
                        value={filters.source ?? ""}
                        onChange={(event) =>
                            setFilters((current) => ({
                                ...current,
                                source:
                                    event.target.value,
                            }))
                        }
                        placeholder={t("event")}
                        className={inputClass}
                    />

                    <input
                        value={
                            filters.trafficSource ??
                            ""
                        }
                        onChange={(event) =>
                            setFilters((current) => ({
                                ...current,

                                trafficSource:
                                    event.target.value,
                            }))
                        }
                        disabled={
                            filters.dataset !==
                            "click_events"
                        }
                        placeholder={t("trafficsource")}
                        className={inputClass}
                    />

                    <input
                        value={filters.ip ?? ""}
                        onChange={(event) =>
                            setFilters((current) => ({
                                ...current,
                                ip:
                                    event.target.value,
                            }))
                        }
                        placeholder={t("ipaddress")}
                        className={inputClass}
                    />

                    <DateTimePicker
                        value={filters.from ?? ""}
                        onChange={(value) =>
                            setFilters((current) => ({
                                ...current,
                                from: value,
                            }))
                        }
                        placeholder={t("fromDate")}
                    />

                    <DateTimePicker
                        value={filters.to ?? ""}
                        onChange={(value) =>
                            setFilters((current) => ({
                                ...current,
                                to: value,
                            }))
                        }
                        placeholder={t("toDate")}
                    />

                    <input
                        value={
                            filters.targetUrl ?? ""
                        }
                        onChange={(event) =>
                            setFilters((current) => ({
                                ...current,

                                targetUrl:
                                    event.target.value,
                            }))
                        }
                        disabled={
                            filters.dataset !==
                            "click_events"
                        }
                        placeholder={t("targeturl")}
                        className={inputClass}
                    />

                    <AnimatedSelect<number>
                        value={filters.limit ?? 50}
                        onChange={(limit) =>
                            setFilters((current) => ({
                                ...current,
                                limit,
                            }))
                        }
                        options={[
                            { value: 25, label: "25" },
                            { value: 50, label: "50" },
                            { value: 100, label: "100" },
                            { value: 250, label: "250" },
                        ]}
                    />

                </div>

                <div className="
                    mt-4
                    flex
                    flex-wrap
                    gap-3
                ">
                    <button
                        type="button"
                        onClick={() => {
                            const nextFilters: AnalyticsFilters = {
                                ...filters,
                                offset: 0,
                            };

                            setAppliedFilters(nextFilters);
                            loadAnalytics(nextFilters);
                        }}
                        className="
                            inline-flex
                            h-10
                            items-center
                            gap-2
                            rounded-lg
                            bg-[var(--accent)]
                            px-4
                            text-sm
                            font-medium
                            text-white
                            shadow-sm
                            transition
                            duration-150
                            hover:brightness-110
                            active:scale-[0.98]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-[var(--accent)]/30
                        "
                    >
                        <SlidersHorizontal size={16} />
                        {t("applyFilters")}
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            const reset: AnalyticsFilters = {
                                dataset: "click_events",
                                source: "",
                                trafficSource: "",
                                ip: "",
                                targetUrl: "",
                                from: "",
                                to: "",
                                limit: 50,
                                offset: 0,
                            };

                            setFilters(reset);
                            setAppliedFilters(reset);
                            loadAnalytics(reset);
                        }}
                        className="
                            inline-flex
                            h-10
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-gray-700
                            bg-white/[0.02]
                            px-4
                            text-sm
                            font-medium
                            text-[var(--text-primary)]
                            transition
                            duration-150
                            hover:border-gray-600
                            hover:bg-[var(--hover-bg)]
                            active:scale-[0.98]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-400/20
                        "
                    >
                        <RotateCcw size={16} />
                        {t("reset")}
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            exportAnalyticsCsv(appliedFilters)
                        }
                        className="
                            inline-flex
                            h-10
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-gray-700
                            bg-white/[0.02]
                            px-4
                            text-sm
                            font-medium
                            text-[var(--text-primary)]
                            transition
                            duration-150
                            hover:border-blue-400/30
                            hover:bg-blue-400/[0.06]
                            hover:text-blue-300
                            active:scale-[0.98]
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-400/20
                        "
                    >
                        <Download size={16} />
                        {t("exportCsv")}
                    </button>

                </div>
            </div>
            {overview && (
                <div className="
                    mt-6
                    grid
                    gap-4
                    sm:grid-cols-2
                    lg:grid-cols-4
                ">
                    <div className="
                        rounded-xl
                        border
                        border-gray-700
                        bg-white/[0.025]
                        p-5
                    ">
                        <div className="text-sm text-[var(--text-muted)]">
                            {t("registrations")}
                        </div>

                        <div className="mt-2 text-2xl font-semibold">
                            {overview.registrations}
                        </div>
                    </div>

                    <div className="
                        rounded-xl
                        border
                        border-gray-700
                        bg-white/[0.025]
                        p-5
                    ">
                        <div className="text-sm text-[var(--text-muted)]">
                            {t("linkclicks")}
                        </div>

                        <div className="mt-2 text-2xl font-semibold">
                            {overview.link_clicks}
                        </div>
                    </div>

                    <div className="
                        rounded-xl
                        border
                        border-gray-700
                        bg-white/[0.025]
                        p-5
                    ">
                        <div className="text-sm text-[var(--text-muted)]">
                            {t("clickevents")}
                        </div>

                        <div className="mt-2 text-2xl font-semibold">
                            {overview.click_events}
                        </div>
                    </div>

                    <div className="
                        rounded-xl
                        border
                        border-gray-700
                        bg-white/[0.025]
                        p-5
                    ">
                        <div className="text-sm text-[var(--text-muted)]">
                            {t("filteredResults")}
                        </div>

                        <div className="mt-2 text-2xl font-semibold">
                            {total}
                        </div>
                    </div>
                </div>
            )}
            {mode === "admin" && (
                <div className="
                    mt-6
                    rounded-xl
                    border
                    border-red-500/20
                    bg-white/[0.025]
                    p-5
                ">
                    <div className="mb-4">
                        <h2 className="font-semibold">
                            {t("dataManagement")}
                        </h2>

                        <p className="mt-1 text-sm text-[var(--text-muted)]">
                            {t("analyticsDeleteDescription")}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">

                    <AnimatedSelect<DeleteMode>
                        value={deleteMode}
                        onChange={setDeleteMode}
                        options={[
                            {
                                value: "filtered",
                                label: t("deleteFiltered"),
                            },
                            {
                                value: "last",
                                label: t("deleteLast"),
                            },
                            {
                                value: "range",
                                label: t("deleteDateRange"),
                            },
                        ]}
                    />

                        {deleteMode === "last" && (
                            <input
                                type="number"
                                min={1}
                                max={10000}
                                value={deleteLastCount}
                                onChange={(event) =>
                                    setDeleteLastCount(
                                        Math.min(
                                            10000,
                                            Math.max(
                                                1,
                                                Number(
                                                    event.target.value
                                                )
                                            )
                                        )
                                    )
                                }
                                className="
                                    h-10
                                    w-28
                                    rounded-lg
                                    border
                                    border-gray-700
                                    bg-[var(--bg-primary)]
                                    px-3
                                    text-sm
                                "
                            />
                        )}

                        <button
                            type="button"
                            onClick={prepareDelete}
                            disabled={adminLoading}
                            className="
                                h-10
                                rounded-lg
                                bg-red-600
                                px-4
                                text-sm
                                font-medium
                                text-white
                                disabled:opacity-50
                            "
                        >
                            {adminLoading
                                ? t("processing")
                                : t("delete")}
                        </button>
                    </div>

                    {adminMessage && (
                        <div className="
                            mt-4
                            rounded-lg
                            border
                            border-gray-700
                            bg-black/10
                            p-3
                            text-sm
                        ">
                            {adminMessage}
                        </div>
                    )}
                </div>
            )}
            {mode === "admin" &&
                confirmDelete &&
                deletePreviewCount !== null && (
                    <div className="
                        fixed
                        inset-0
                        z-50
                        flex
                        items-center
                        justify-center
                        bg-black/60
                        p-4
                    ">
                        <div className="
                            w-full
                            max-w-md
                            rounded-xl
                            border
                            border-gray-700
                            bg-[var(--bg-primary)]
                            p-6
                            shadow-2xl
                        ">
                            <h2 className="text-lg font-semibold">
                                {t("confirmDeletion")}
                            </h2>

                            <p className="
                                mt-3
                                text-sm
                                text-[var(--text-muted)]
                            ">
                                {t("confirmDeletionDescription", {
                                    count: deletePreviewCount,
                                })}
                            </p>

                            <div className="
                                mt-6
                                flex
                                justify-end
                                gap-3
                            ">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setConfirmDelete(false);
                                        setDeletePreviewCount(null);
                                    }}
                                    disabled={adminLoading}
                                    className="
                                        h-10
                                        rounded-lg
                                        border
                                        border-gray-700
                                        px-4
                                        text-sm
                                    "
                                >
                                    {t("cancel")}
                                </button>

                                <button
                                    type="button"
                                    onClick={executeDelete}
                                    disabled={adminLoading}
                                    className="
                                        h-10
                                        rounded-lg
                                        bg-red-600
                                        px-4
                                        text-sm
                                        font-medium
                                        text-white
                                        disabled:opacity-50
                                    "
                                >
                                    {adminLoading
                                        ? t("deleting")
                                        : t("confirmDelete")}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            <div className="
                mt-6
                overflow-hidden
                rounded-xl
                border
                border-gray-700
                bg-white/[0.025]
            ">
                <div className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-gray-700
                    px-5
                    py-4
                ">
                    <h2 className="font-semibold">
                        {t("results")}
                    </h2>

                    <span className="
                        text-sm
                        text-[var(--text-muted)]
                    ">
                        {total}
                    </span>
                </div>

                {rows.length === 0 ? (
                    <div className="
                        p-8
                        text-center
                        text-sm
                        text-[var(--text-muted)]
                    ">
                        {t("noResults")}
                    </div>
                ) : (
                    <div className="divide-y divide-gray-700">
                        {rows.map((row) => (
                            <div
                                key={row.id}
                                className="p-5"
                            >
                                <div className="
                                    flex
                                    flex-wrap
                                    items-center
                                    justify-between
                                    gap-3
                                ">
                                    <div>
                                        <div className="font-medium">
                                            {"source_name" in row
                                                ? eventLabel(
                                                    row.source_name
                                                )
                                                : "—"}
                                        </div>

                                        <div className="
                                            mt-1
                                            text-sm
                                            text-[var(--text-muted)]
                                        ">
                                            {row.ip_address}
                                        </div>
                                    </div>

                                    <div className="
                                        text-sm
                                        text-[var(--text-muted)]
                                    ">
                                        {new Date(
                                            row.created_at
                                        ).toLocaleString()}
                                    </div>
                                </div>

                                {"traffic_source" in row &&
                                    row.traffic_source && (
                                        <div className="
                                            mt-3
                                            text-sm
                                        ">
                                            <span className="text-[var(--text-muted)]">
                                                {t("trafficsource")}:
                                            </span>{" "}
                                            {row.traffic_source}
                                        </div>
                                    )}

                                {"target_url" in row &&
                                    row.target_url && (
                                        <div className="
                                            mt-1
                                            break-all
                                            text-sm
                                        ">
                                            <span className="text-[var(--text-muted)]">
                                                {t("targeturl")}:
                                            </span>{" "}
                                            {row.target_url}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}