function escapeCsvValue(value: unknown): string {
    if (value === null || value === undefined) {
        return "";
    }

    const stringValue = String(value);

    if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n") ||
        stringValue.includes("\r")
    ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }

    return stringValue;
}

export function toCsv(
    rows: Record<string, unknown>[],
): string {
    if (rows.length === 0) {
        return "";
    }

    const headers = Object.keys(rows[0]);

    return [
        headers.map(escapeCsvValue).join(","),
        ...rows.map((row) =>
            headers
                .map((header) =>
                    escapeCsvValue(row[header]),
                )
                .join(","),
        ),
    ].join("\r\n");
}