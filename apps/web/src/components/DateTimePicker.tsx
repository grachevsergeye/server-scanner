import {
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    useTranslation,
} from "react-i18next";

import {
    CalendarDays,
    ChevronLeft,
    ChevronRight,
    Clock3,
    X,
} from "lucide-react";

import PickerSelect, {
    YearPicker,
} from "./PickerSelect";

interface DateTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

const MONTH_KEYS = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
];

const WEEKDAY_KEYS = [
    "sun",
    "mon",
    "tue",
    "wed",
    "thu",
    "fri",
    "sat",
];

function pad(value: number) {
    return String(value).padStart(2, "0");
}

function parseValue(value: string) {
    if (!value) {
        return null;
    }

    const match = value.match(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/
    );

    if (!match) {
        return null;
    }

    return new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
        Number(match[4]),
        Number(match[5])
    );
}

function formatValue(date: Date) {
    return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate()),
    ].join("-") +
        `T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDisplay(value: string) {
    const date = parseValue(value);

    if (!date) {
        return "";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }
    ).format(date);
}

export default function DateTimePicker({
    value,
    onChange,
    placeholder,
}: DateTimePickerProps) {
    const wrapperRef =
        useRef<HTMLDivElement>(null);

    const { t } = useTranslation();

    const selectedDate =
        parseValue(value);

    const [open, setOpen] =
        useState(false);

    const [showMonthPicker, setShowMonthPicker] =
        useState(false);

    const initialDate =
        selectedDate ?? new Date();

    const [viewYear, setViewYear] =
        useState(initialDate.getFullYear());

    const [viewMonth, setViewMonth] =
        useState(initialDate.getMonth());

    const [hour, setHour] =
        useState(
            selectedDate?.getHours() ??
            initialDate.getHours()
        );

    const [minute, setMinute] =
        useState(
            selectedDate?.getMinutes() ??
            initialDate.getMinutes()
        );

    useEffect(() => {
        function handleOutsideClick(
            event: MouseEvent
        ) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(
                    event.target as Node
                )
            ) {
                setOpen(false);
                setShowMonthPicker(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
    }, []);

    const days = useMemo(() => {
        const firstDay =
            new Date(
                viewYear,
                viewMonth,
                1
            ).getDay();

        const daysInMonth =
            new Date(
                viewYear,
                viewMonth + 1,
                0
            ).getDate();

        const result: (
            number | null
        )[] = [];

        for (
            let i = 0;
            i < firstDay;
            i++
        ) {
            result.push(null);
        }

        for (
            let day = 1;
            day <= daysInMonth;
            day++
        ) {
            result.push(day);
        }

        return result;
    }, [viewYear, viewMonth]);

    function selectDay(day: number) {
        const next = new Date(
            viewYear,
            viewMonth,
            day,
            hour,
            minute
        );

        onChange(formatValue(next));
    }

    function changeMonth(
        direction: number
    ) {
        const next =
            new Date(
                viewYear,
                viewMonth + direction,
                1
            );

        setViewYear(
            next.getFullYear()
        );

        setViewMonth(
            next.getMonth()
        );
    }

    function selectMonth(
        month: number
    ) {
        setViewMonth(month);
        setShowMonthPicker(false);
    }

    function changeTime(
        nextHour: number,
        nextMinute: number
    ) {
        setHour(nextHour);
        setMinute(nextMinute);

        if (selectedDate) {
            const next =
                new Date(
                    selectedDate
                );

            next.setHours(
                nextHour,
                nextMinute
            );

            onChange(
                formatValue(next)
            );
        }
    }

    const selectedDay =
        selectedDate &&
        selectedDate.getFullYear() ===
            viewYear &&
        selectedDate.getMonth() ===
            viewMonth
            ? selectedDate.getDate()
            : null;

    return (
        <div
            ref={wrapperRef}
            className="relative w-full"
        >
            <button
                type="button"
                onClick={() => {
                    setOpen(
                        (current) =>
                            !current
                    );

                    if (!open) {
                        const date =
                            parseValue(value) ??
                            new Date();

                        setViewYear(
                            date.getFullYear()
                        );

                        setViewMonth(
                            date.getMonth()
                        );

                        setHour(
                            date.getHours()
                        );

                        setMinute(
                            date.getMinutes()
                        );
                    }
                }}
                className="
                    flex
                    h-10
                    w-full
                    items-center
                    justify-between
                    rounded-lg
                    border
                    border-gray-700
                    bg-[var(--bg-primary)]
                    px-3
                    text-sm
                    outline-none
                    transition
                    duration-200
                    hover:border-gray-600
                    focus:border-blue-400/50
                    focus:ring-1
                    focus:ring-blue-400/20
                "
            >
                <span
                    className={
                        value
                            ? "text-[var(--text-primary)]"
                            : "text-[var(--text-muted)]"
                    }
                >
                    {value
                        ? formatDisplay(
                              value
                          )
                                                : placeholder ??
                                                    t("dateTime.selectDateTime")}
                </span>

                <CalendarDays
                    size={17}
                    className="text-[var(--text-muted)]"
                />
            </button>

            {open && (
                <div
                    className="
                        absolute
                        left-0
                        top-[calc(100%+8px)]
                        z-50
                        w-full
                        overflow-visible
                        rounded-xl
                        border
                        border-gray-700
                        bg-[var(--bg-primary)]
                        shadow-2xl
                        shadow-black/40
                        animate-in
                        fade-in
                        slide-in-from-top-2
                        duration-150
                    "
                >
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            border-b
                            border-gray-700
                            px-4
                            py-3
                        "
                    >
                    <button
                        type="button"
                        onClick={() =>
                            setShowMonthPicker(
                                (current) => !current
                            )
                        }
                        className="
                            group
                            flex
                            items-center
                            gap-2
                            rounded-lg
                            px-2
                            py-1.5
                            text-sm
                            font-semibold
                            transition-all
                            duration-200
                            hover:bg-[var(--hover-bg)]
                        "
                    >
                        <span>
                            {t(
                                `dateTime.months.${MONTH_KEYS[viewMonth]}`
                            )}{" "}
                            {viewYear}
                        </span>

                        <ChevronRight
                            size={15}
                            className={`
                                text-[var(--text-muted)]
                                transition-transform
                                duration-200
                                ${
                                    showMonthPicker
                                        ? "rotate-90"
                                        : ""
                                }
                            `}
                        />
                    </button>

                        {!showMonthPicker && (
                            <div className="flex gap-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        changeMonth(
                                            -1
                                        )
                                    }
                                    className="
                                        rounded-lg
                                        p-1.5
                                        text-[var(--text-muted)]
                                        transition
                                        hover:bg-[var(--hover-bg)]
                                        hover:text-white
                                    "
                                >
                                    <ChevronLeft
                                        size={17}
                                    />
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        changeMonth(
                                            1
                                        )
                                    }
                                    className="
                                        rounded-lg
                                        p-1.5
                                        text-[var(--text-muted)]
                                        transition
                                        hover:bg-[var(--hover-bg)]
                                        hover:text-white
                                    "
                                >
                                    <ChevronRight
                                        size={17}
                                    />
                                </button>
                            </div>
                        )}
                    </div>

                    {showMonthPicker ? (
                        <div className="p-4">
                            <div className="
                                mb-4
                                flex
                                items-center
                                justify-between
                                gap-3
                            ">
                                <span className="
                                    text-xs
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-[var(--text-muted)]
                                ">
                                    {t("dateTime.year")}
                                </span>

                                <YearPicker
                                    value={viewYear}
                                    onChange={setViewYear}
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {MONTH_KEYS.map((month, index) => (
                                    <button
                                        key={month}
                                        type="button"
                                        onClick={() => selectMonth(index)}
                                        className={`
                                            rounded-lg
                                            px-2
                                            py-2
                                            text-sm
                                            transition-all
                                            duration-200
                                            ${
                                                index === viewMonth
                                                    ? "bg-[var(--accent)] text-white shadow-lg shadow-blue-500/20"
                                                    : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                                            }
                                        `}
                                    >
                                        {t(`dateTime.months.${month}`).slice(0, 3)}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-7 px-3 pt-3">
                            {WEEKDAY_KEYS.map((day) => (
                                <div
                                    key={day}
                                    className="
                                        py-2
                                        text-center
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        text-[var(--text-muted)]
                                    "
                                >
                                    {t(`dateTime.weekdays.${day}`)}
                                </div>
                            ))}

                                {days.map(
                                    (
                                        day,
                                        index
                                    ) => (
                                        <button
                                            key={
                                                `${day}-${index}`
                                            }
                                            type="button"
                                            disabled={
                                                day ===
                                                null
                                            }
                                            onClick={() => {
                                                if (
                                                    day
                                                ) {
                                                    selectDay(
                                                        day
                                                    );
                                                }
                                            }}
                                            className={`
                                                m-0.5
                                                flex
                                                h-9
                                                items-center
                                                justify-center
                                                rounded-lg
                                                text-sm
                                                transition
                                                ${
                                                    day ===
                                                    selectedDay
                                                        ? "bg-[var(--accent)] text-white"
                                                        : day
                                                        ? "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                                                        : ""
                                                }
                                            `}
                                        >
                                            {
                                                day
                                            }
                                        </button>
                                    )
                                )}
                            </div>

                            <div className="
                                mt-3
                                border-t
                                border-gray-700
                                p-3
                            ">
                                <div className="
                                    mb-2
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    font-medium
                                    text-[var(--text-muted)]
                                ">
                                    <Clock3
                                        size={14}
                                    />
                                    {t("dateTime.time")}
                                </div>

                                <div className="flex items-center gap-2">
                                    <PickerSelect
                                        value={hour}
                                        options={Array.from(
                                            { length: 24 },
                                            (_, index) => index
                                        )}
                                        onChange={(nextHour) =>
                                            changeTime(
                                                nextHour,
                                                minute
                                            )
                                        }
                                        format={(value) =>
                                            pad(value)
                                        }
                                    />

                                    <span className="text-[var(--text-muted)]">
                                        :
                                    </span>

                                    <PickerSelect
                                        value={minute}
                                        options={Array.from(
                                            { length: 60 },
                                            (_, index) => index
                                        )}
                                        onChange={(nextMinute) =>
                                            changeTime(
                                                hour,
                                                nextMinute
                                            )
                                        }
                                        format={(value) =>
                                            pad(value)
                                        }
                                    />
                                </div>

                                <div className="mt-2 flex justify-between">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            onChange("");
                                            setOpen(
                                                false
                                            );
                                        }}
                                        className="
                                            flex
                                            items-center
                                            gap-1.5
                                            rounded-md
                                            px-2
                                            py-1.5
                                            text-xs
                                            text-[var(--text-muted)]
                                            transition
                                            hover:bg-[var(--hover-bg)]
                                            hover:text-white
                                        "
                                    >
                                        <X
                                            size={13}
                                        />
                                        {t("dateTime.clear")}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}