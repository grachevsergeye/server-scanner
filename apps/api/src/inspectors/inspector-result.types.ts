import type {
    FaviconInspection,
    HttpInspection,
    RedirectInspection,
    RobotsInspection,
    TlsInspection,
    FtpInspection,
    SshInspection,
    SmtpInspection,
    RedisInspection,
    MysqlInspection,
    PostgreSqlInspection,
    MongoDbInspection,
    MemcachedInspection,
    TelnetInspection
} from "../inspection/types.js";

export interface BaseInspectionResult {
    port: number;
    service: string;
    title: string;
}

export type HttpInspectionResult =
    BaseInspectionResult & {
        type: "http";
        data: HttpInspection;
    };

export type RedirectInspectionResult =
    BaseInspectionResult & {
        type: "redirects";
        data: RedirectInspection;
    };

export type TlsInspectionResult =
    BaseInspectionResult & {
        type: "tls";
        data: TlsInspection;
    };

export type FaviconInspectionResult =
    BaseInspectionResult & {
        type: "favicon";
        data: FaviconInspection;
    };

export type RobotsInspectionResult =
    BaseInspectionResult & {
        type: "robots";
        data: RobotsInspection;
    };

export type SshInspectionResult =
    BaseInspectionResult & {
        type: "ssh";
        data: SshInspection;
    };

export type FtpInspectionResult =
    BaseInspectionResult & {
        type: "ftp";
        data: FtpInspection;
    };

export type SmtpInspectionResult =
    BaseInspectionResult & {
        type: "smtp";
        data: SmtpInspection;
    };

export type RedisInspectionResult =
    BaseInspectionResult & {
        type: "redis";
        data: RedisInspection;
    };

export type MysqlInspectionResult =
    BaseInspectionResult & {
        type: "mysql";
        data: MysqlInspection;
    };

export type PostgreSqlInspectionResult =
    BaseInspectionResult & {
        type: "postgresql";
        data: PostgreSqlInspection;
    };

export type MongoDbInspectionResult =
    BaseInspectionResult & {
        type: "mongodb";
        data: MongoDbInspection;
    };

export type MemcachedInspectionResult =
    BaseInspectionResult & {
        type: "memcached";
        data: MemcachedInspection;
    };

export type TelnetInspectionResult =
    BaseInspectionResult & {
        type: "telnet";
        data: TelnetInspection;
    };

export type InspectionResult =
    | HttpInspectionResult
    | RedirectInspectionResult
    | TlsInspectionResult
    | FaviconInspectionResult
    | RobotsInspectionResult
    | SshInspectionResult
    | FtpInspectionResult
    | SmtpInspectionResult
    | RedisInspectionResult
    | MysqlInspectionResult
    | PostgreSqlInspectionResult
    | MongoDbInspectionResult
    | MemcachedInspectionResult
    | TelnetInspectionResult;