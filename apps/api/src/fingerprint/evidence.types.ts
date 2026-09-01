import type { TlsInspection } from "../inspection/types.js";

export interface FingerprintEvidence {
    service: string;

    product?: string;
    version?: string;

    poweredBy?: string;

    url?: string;
    status?: number;
    headers?: Record<string, string>;
    server?: string;
    title?: string;
    technologies?: string[];

    tlsProtocol?: string;
    tlsCipher?: string;

    certificate?: TlsInspection["certificate"];

    redirects?: {
        url: string;
        status: number;
        location: string;
    }[];

    finalUrl?: string;

    favicon?: {
        exists: boolean;
        status: number;
        md5?: string;
        sha256?: string;
        hash?: string;
    };

    robots?: {
        exists: boolean;
        status: number;
    };

    banner?: string;
    welcome?: string;
}