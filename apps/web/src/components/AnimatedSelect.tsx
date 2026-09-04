import {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    Check,
    ChevronDown,
} from "lucide-react";

interface Option<T extends string | number> {
    value: T;
    label: string;
}

interface AnimatedSelectProps<
    T extends string | number
> {
    value: T;
    options: Option<T>[];
    onChange: (value: T) => void;
    className?: string;
}

export default function AnimatedSelect<
    T extends string | number
>({
    value,
    options,
    onChange,
    className = "",
}: AnimatedSelectProps<T>) {
    const [open, setOpen] =
        useState(false);

    const ref =
        useRef<HTMLDivElement>(null);

    const selected =
        options.find(
            (option) =>
                option.value === value
        );

    useEffect(() => {
        function handleClickOutside(
            event: MouseEvent
        ) {
            if (
                ref.current &&
                !ref.current.contains(
                    event.target as Node
                )
            ) {
                setOpen(false);
            }
        }

        document.addEventListener(
            "mousedown",
            handleClickOutside
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <div
            ref={ref}
            className={`
                relative
                ${className}
            `}
        >
            <button
                type="button"
                onClick={() =>
                    setOpen(
                        (current) =>
                            !current
                    )
                }
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
                    transition
                    duration-150
                    hover:border-gray-600
                    focus:border-blue-400/50
                    focus:outline-none
                    focus:ring-1
                    focus:ring-blue-400/20
                "
            >
                <span>
                    {selected?.label}
                </span>

                <ChevronDown
                    size={16}
                    className={`
                        text-[var(--text-muted)]
                        transition-transform
                        duration-200
                        ${
                            open
                                ? "rotate-180"
                                : ""
                        }
                    `}
                />
            </button>

            {open && (
                <div className="
                    absolute
                    left-0
                    top-[calc(100%+6px)]
                    z-[100]
                    w-full
                    overflow-hidden
                    rounded-xl
                    border
                    border-gray-700
                    bg-[var(--bg-primary)]
                    p-1
                    space-y-1
                    shadow-2xl
                ">
                    {options.map(
                        (option) => {
                            const active =
                                option.value ===
                                value;

                            return (
                                <button
                                    key={
                                        option.value
                                    }
                                    type="button"
                                    onClick={() => {
                                        onChange(
                                            option.value
                                        );
                                        setOpen(
                                            false
                                        );
                                    }}
                                    className={`
                                        flex
                                        w-full
                                        items-center
                                        justify-between
                                        rounded-lg
                                        px-3
                                        py-2.5
                                        text-left
                                        text-sm
                                        transition
                                        ${
                                            active
                                                ? "bg-blue-500/10 text-blue-300"
                                                : "text-[var(--text-primary)] hover:bg-[var(--hover-bg)]"
                                        }
                                    `}
                                >
                                    <span>
                                        {
                                            option.label
                                        }
                                    </span>

                                    {active && (
                                        <Check
                                            size={
                                                15
                                            }
                                            className="text-blue-400"
                                        />
                                    )}
                                </button>
                            );
                        }
                    )}
                </div>
            )}
        </div>
    );
}