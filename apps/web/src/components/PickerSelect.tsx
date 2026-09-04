import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ChevronDown,
} from "lucide-react";

interface PickerSelectProps {
    value: number;
    options: number[];
    onChange: (value: number) => void;
    format?: (value: number) => string;
    className?: string;
}

interface YearPickerProps {
    value: number;
    onChange: (value: number) => void;
}

export function YearPicker({
    value,
    onChange,
}: YearPickerProps) {
    const currentYear =
        new Date().getFullYear();

    const years = Array.from(
        { length: 31 },
        (_, index) =>
            currentYear - 15 + index
    );

    return (
        <PickerSelect
            value={value}
            options={years}
            onChange={onChange}
        />
    );
}

export default function PickerSelect({
    value,
    options,
    onChange,
    format = (value) => String(value),
    className = "",
}: PickerSelectProps) {
    const [open, setOpen] =
        useState(false);

    const wrapperRef =
        useRef<HTMLDivElement>(null);

    const optionsRef =
        useRef<HTMLDivElement>(null);

    const selectedRef =
        useRef<HTMLButtonElement>(null);

    /*
     * Close when clicking outside.
     */
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

    /*
     * When opened, scroll ONLY the options
     * container to the selected value.
     *
     * This deliberately does NOT use
     * scrollIntoView(), because that can
     * scroll the entire page.
     */
    useEffect(() => {
        if (!open) {
            return;
        }

        requestAnimationFrame(() => {
            const container =
                optionsRef.current;

            const selected =
                selectedRef.current;

            if (!container || !selected) {
                return;
            }

            const targetTop =
                selected.offsetTop -
                container.clientHeight / 2 +
                selected.offsetHeight / 2;

            container.scrollTop =
                Math.max(0, targetTop);
        });
    }, [open, value]);

    return (
        <div
            ref={wrapperRef}
            className={`
                relative
                min-w-0
                flex-1
                ${className}
            `}
        >
            {/* SELECT BUTTON */}

            <button
                type="button"
                onClick={() =>
                    setOpen(
                        (current) => !current
                    )
                }
                aria-haspopup="listbox"
                aria-expanded={open}
                className="
                    flex
                    h-9
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
                    transition-all
                    duration-200
                    hover:border-gray-600
                    focus:border-blue-400/50
                    focus:ring-1
                    focus:ring-blue-400/20
                "
            >
                <span className="truncate">
                    {format(value)}
                </span>

                <ChevronDown
                    size={15}
                    className={`
                        shrink-0
                        text-[var(--text-muted)]
                        transition-transform
                        duration-200
                        ease-out
                        ${
                            open
                                ? "rotate-180"
                                : "rotate-0"
                        }
                    `}
                />
            </button>

            {/* DROPDOWN */}

            {open && (
                <div
                    className="
                        absolute
                        bottom-[calc(100%+6px)]
                        left-0
                        z-[100]
                        w-full
                        min-w-[90px]
                        overflow-hidden
                        rounded-xl
                        border
                        border-gray-700
                        bg-[var(--bg-primary)]
                        p-1
                        shadow-2xl
                        shadow-black/40
                        animate-in
                        fade-in
                        slide-in-from-bottom-2
                        duration-150
                    "
                >
                    <div
                        ref={optionsRef}
                        role="listbox"
                        className="
                            max-h-[180px]
                            overflow-y-auto
                            overscroll-contain
                            scrollbar-thin
                            scrollbar-thumb-gray-600
                            scrollbar-track-transparent
                        "
                    >
                        {options.map(
                            (option) => {
                                const selected =
                                    option === value;

                                return (
                                    <button
                                        key={option}
                                        ref={
                                            selected
                                                ? selectedRef
                                                : undefined
                                        }
                                        type="button"
                                        role="option"
                                        aria-selected={
                                            selected
                                        }
                                        onClick={() => {
                                            onChange(
                                                option
                                            );

                                            setOpen(
                                                false
                                            );
                                        }}
                                        className={`
                                            flex
                                            w-full
                                            items-center
                                            justify-center
                                            rounded-lg
                                            px-3
                                            py-2
                                            text-sm
                                            transition-all
                                            duration-150
                                            ${
                                                selected
                                                    ? `
                                                        bg-[var(--accent)]
                                                        text-white
                                                        shadow-sm
                                                    `
                                                    : `
                                                        text-[var(--text-primary)]
                                                        hover:bg-[var(--hover-bg)]
                                                    `
                                            }
                                        `}
                                    >
                                        {format(
                                            option
                                        )}
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
