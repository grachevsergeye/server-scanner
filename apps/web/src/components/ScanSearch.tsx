interface ScanSearchProps {
    value: string;
    onChange: (value: string) => void;
}

export default function ScanSearch({
    value,
    onChange,
}: ScanSearchProps) {

    return (
        <input
            value={value}
            onChange={event =>
                onChange(event.target.value)
            }
            placeholder="Search by IP or hostname..."
            className="
                w-full
                py-2
                rounded-lg
                border
              border-gray-700
                bg-black/10
                px-3
                text-sm
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
    );
}