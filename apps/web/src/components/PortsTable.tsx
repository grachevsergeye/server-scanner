import { useTranslation } from "react-i18next";
import type { ScanPort } from "../api";

interface PortsTableProps {
    ports: ScanPort[];
}

export default function PortsTable({
    ports,
}: PortsTableProps) {
    const { t } = useTranslation();

    return (
        <section
            className="
                overflow-hidden
                rounded-xl
                border
                border-gray-700
                bg-white/[0.025]
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                    border-b
                    border-gray-700
                    p-5
                    sm:p-6
                "
            >
                <div>
                    <h2 className="text-base font-semibold">
                        {t("services")}
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[var(--text-secondary)]
                        "
                    >
                        {t("servicesDescription")}
                    </p>
                </div>

                <span
                    className="
                        rounded-full
                        bg-white/5
                        px-2.5
                        py-1
                        text-xs
                        font-medium
                        text-[var(--text-secondary)]
                    "
                >
                    {ports.length}
                </span>
            </div>

            {ports.length === 0 ? (
                <div
                    className="
                        px-5
                        py-10
                        text-center
                        text-sm
                        text-[var(--text-secondary)]
                    "
                >
                    {t("noOpenPorts")}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px] text-left text-sm">
                        <thead>
                            <tr
                                className="
                                    border-b
                                    border-gray-700
                                    text-xs
                                    uppercase
                                    tracking-wide
                                    text-[var(--text-secondary)]
                                "
                            >
                                <th className="px-5 py-3 font-medium">
                                    {t("port")}
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    {t("protocol")}
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    {t("state")}
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    {t("service")}
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    {t("product")}
                                </th>

                                <th className="px-5 py-3 font-medium">
                                    {t("version")}
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-white/5">
                            {ports.map((port) => (
                                <tr
                                    key={`${port.protocol}-${port.port}`}
                                    className="transition hover:bg-white/[0.025]"
                                >
                                    <td className="px-5 py-3.5 font-medium">
                                        {port.port}
                                    </td>

                                    <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                                        {port.protocol.toUpperCase()}
                                    </td>

                                    <td className="px-5 py-3.5">
                                        <span
                                            className={`
                                                inline-flex
                                                rounded-full
                                                px-2
                                                py-1
                                                text-xs
                                                font-medium

                                                ${
                                                    port.state ===
                                                    "open"
                                                        ? "bg-emerald-400/10 text-emerald-400"
                                                        : "bg-white/5 text-[var(--text-secondary)]"
                                                }
                                            `}
                                        >
                                            {t(
                                                `portState.${port.state}`
                                            )}
                                        </span>
                                    </td>

                                    <td className="px-5 py-3.5">
                                        {port.service || "—"}
                                    </td>

                                    <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                                        {port.product || "—"}
                                    </td>

                                    <td className="px-5 py-3.5 text-[var(--text-secondary)]">
                                        {port.version || "—"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}