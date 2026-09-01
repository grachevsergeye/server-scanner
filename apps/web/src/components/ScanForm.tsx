import { useTranslation } from "react-i18next";
import { Radar } from "lucide-react";

interface ScanFormProps {
    target: string;
    disabled?: boolean;
    onChange: (value: string) => void;
    onSubmit: () => void;
}

export default function ScanForm({
    target,
    disabled = false,
    onChange,
    onSubmit,
}: ScanFormProps) {
    const { t } = useTranslation();

    return (
        <section
            className="
                rounded-xl
                border
                border-gray-700
                bg-white/[0.025]
                p-5
                shadow-sm
                sm:p-6
            "
        >
            <div className="mb-6 flex items-start gap-3">
                <div
                    className="
                        flex
                        h-9
                        w-9
                        mt-2
                        shrink-0
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-400/10
                        text-blue-400
                    "
                >
                    <Radar size={19} />
                </div>

                <div>
                    <h2 className="text-base font-semibold">
                        {t("newScan")}
                    </h2>

                    <p
                        className="
                            mt-1
                            text-sm
                            text-[var(--text-secondary)]
                        "
                    >
                        {t("newScanDescription")}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                <div className="flex-1">
                    <label
                        className="
                            mb-2
                            block
                            text-xs
                            font-medium
                            text-[var(--text-secondary)]
                        "
                    >
                        {t("target")}
                    </label>

                    <textarea
                        value={target}
                        disabled={disabled}
                        onChange={(event) =>
                            onChange(event.target.value)
                        }
                        onKeyDown={(event) => {
                            if (
                                event.key === "Enter" &&
                                (event.ctrlKey || event.metaKey)
                            ) {
                                event.preventDefault();
                                onSubmit();
                            }
                        }}
                        placeholder={`8.8.8.8
            1.1.1.1
            5.253.57.246
            5.253.57.247`}
                        rows={5}
                        className="
                            min-h-32
                            w-full
                            resize-y
                            rounded-lg
                            border
                            border-gray-700
                            bg-[var(--bg-primary)]
                            px-3
                            py-3
                            text-sm
                            leading-6
                            text-[var(--text-primary)]
                            outline-none
                            transition
                            placeholder:text-[var(--text-secondary)]
                            focus:border-blue-400/50
                            focus:ring-2
                            focus:ring-blue-400/10
                            disabled:cursor-not-allowed
                            disabled:opacity-50
                        "
                    />

                    <span
                        className="
                            mt-2
                            block
                            text-xs
                            text-[var(--text-secondary)]
                        "
                    >
                        {t("targetHelp")}
                    </span>
                </div>

                <button
                    disabled={disabled || !target.trim()}
                    onClick={onSubmit}
                    className="
                        h-11
                        shrink-0
                        rounded-lg
                        bg-blue-500
                        px-5
                        text-sm
                        font-medium
                        text-white
                        shadow-lg
                        shadow-blue-500/10
                        transition
                        hover:bg-blue-400
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        lg:mb-7
                    "
                >
                    {disabled ? t("scanning") : t("startScan")}
                </button>
            </div>
            <span
                className="
                    mt-2
                    block
                    text-xs
                    text-[var(--text-secondary)]
                "
            >
            </span>
        </section>
    );
}