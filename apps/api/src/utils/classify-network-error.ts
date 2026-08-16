import axios from "axios";

export type NetworkFailureCategory =
    | "refused"
    | "timeout"
    | "reset"
    | "unreachable"
    | "tls"
    | "network"
    | "unknown";

export interface ClassifiedNetworkError {
    category: NetworkFailureCategory;
    expected: boolean;
    message: string;
}

export function classifyNetworkError(
    error: unknown
): ClassifiedNetworkError {

    /*
     * Axios
     */
    if (axios.isAxiosError(error)) {

        switch (error.code) {

            case "ECONNREFUSED":
                return {
                    category: "refused",
                    expected: true,
                    message: "Connection refused",
                };

            case "ECONNABORTED":
            case "ETIMEDOUT":
                return {
                    category: "timeout",
                    expected: true,
                    message: "Connection timed out",
                };

            case "ECONNRESET":
                return {
                    category: "reset",
                    expected: true,
                    message: "Connection reset",
                };

            case "EHOSTUNREACH":
            case "ENETUNREACH":
                return {
                    category: "unreachable",
                    expected: true,
                    message: "Host unreachable",
                };

            default:
                return {
                    category: "network",
                    expected: false,
                    message: error.message,
                };
        }
    }

    /*
     * Node / TLS / SSH errors
     */
    if (error instanceof Error) {

        const nodeError =
            error as NodeJS.ErrnoException;

        const code =
            nodeError.code;

        switch (code) {

            case "ECONNREFUSED":
                return {
                    category: "refused",
                    expected: true,
                    message: "Connection refused",
                };

            case "ETIMEDOUT":
                return {
                    category: "timeout",
                    expected: true,
                    message: "Connection timed out",
                };

            case "ECONNRESET":
                return {
                    category: "reset",
                    expected: true,
                    message: "Connection reset",
                };

            case "EHOSTUNREACH":
            case "ENETUNREACH":
                return {
                    category: "unreachable",
                    expected: true,
                    message: "Host unreachable",
                };

            case "ECONNABORTED":
                return {
                    category: "timeout",
                    expected: true,
                    message: "Connection aborted",
                };
        }

        /*
         * TLS libraries sometimes expose useful
         * information only through the message.
         */
        const message =
            error.message.toLowerCase();

        if (
            message.includes("timed out") ||
            message.includes("timeout")
        ) {
            return {
                category: "timeout",
                expected: true,
                message: "Connection timed out",
            };
        }

        if (
            message.includes("connection refused") ||
            message.includes("connect econnrefused")
        ) {
            return {
                category: "refused",
                expected: true,
                message: "Connection refused",
            };
        }

        if (
            message.includes("connection reset") ||
            message.includes("econnreset")
        ) {
            return {
                category: "reset",
                expected: true,
                message: "Connection reset",
            };
        }

        /*
         * TLS handshake failures are expected when a port
         * is detected as HTTPS/SSL but does not actually
         * complete a TLS handshake.
         */
        if (
            message.includes("tls") ||
            message.includes("ssl") ||
            message.includes("handshake") ||
            message.includes("wrong version number") ||
            message.includes("certificate")
        ) {
            return {
                category: "tls",
                expected: true,
                message: "TLS handshake failed",
            };
        }

        return {
            category: "unknown",
            expected: false,
            message: error.message,
        };
    }

    return {
        category: "unknown",
        expected: false,
        message: String(error),
    };
}