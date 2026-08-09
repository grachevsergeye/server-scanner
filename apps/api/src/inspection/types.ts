import type {
    FaviconInspection,
    RobotsInspection
} from "../inspectors/inspector.interface.js";

export interface HttpInspection {

    url: string;

    status: number;

    title?: string;

    server?: string;

    poweredBy?: string;

    headers?: Record<string, string>;

    technologies?: string[];

    body?: string;
}

export interface RedirectInspection {

    finalUrl: string;

    redirects: Array<{
        url: string;
        status: number;
        location: string;
    }>;

    maxRedirectsReached?: boolean;
}

export interface TlsInspection {

    protocol: string;

    cipher?: {

        name: string;

        standardName?: string;

        version?: string;
    };

    certificate?: {

        subject?: {

            commonName?: string;

            organization?: string;
        };

        issuer?: {

            commonName?: string;

            organization?: string;
        };

        validFrom?: string;

        validTo?: string;

        serial?: string;

        fingerprint?: string;

        altNames?: string;
    };
}

export interface FtpInspection {

    currentDirectory?: string;

    files?: unknown[];

    features?: Record<string, unknown>;

    anonymousAccess: boolean;
}

export interface SshInspection {

    banner?: string;
}

export interface RedisInspection {

    info?: string;
}

export interface SmtpInspection {

    banner?: string;
}

export interface PortInspections {

    http?: HttpInspection;

    redirects?: RedirectInspection;

    tls?: TlsInspection;

    favicon?: FaviconInspection;

    robots?: RobotsInspection;

    ftp?: FtpInspection;

    ssh?: SshInspection;

    redis?: RedisInspection;

    smtp?: SmtpInspection;
}