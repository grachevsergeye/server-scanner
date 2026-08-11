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
    protocol?: string;

    version?: string;

    authentication?: {
        required?: boolean;
        mechanism?: string;
    };

    tls?: {
        supported?: boolean;
    };

    info?: string;
}

export interface MysqlInspection
    extends DatabaseInspectionData {

    authenticationPlugin?: string;

    errorCode?: number;
}

export interface PostgreSqlInspection
    extends DatabaseInspectionData {

    protocolVersion?: string;
}

export interface MongoDbInspection
    extends DatabaseInspectionData {

    wireProtocol?: string;
}

export interface MemcachedInspection
    extends DatabaseInspectionData {

    protocolType?: "text" | "binary";
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
    smtp?: SmtpInspection;

    redis?: RedisInspection;

    mysql?: MysqlInspection;
    postgresql?: PostgreSqlInspection;
    mongodb?: MongoDbInspection;
    memcached?: MemcachedInspection;
}

export interface DatabaseInspectionData {
    protocol?: string;

    product?: string;

    version?: string;

    banner?: string;

    authentication?: {
        required?: boolean;
        mechanism?: string;
    };

    tls?: {
        supported?: boolean;
    };
}