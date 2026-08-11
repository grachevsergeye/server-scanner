import type { ScanPort } from "../types/scan.types.js";

import type {
    HttpInspection,
    RedirectInspection,
    TlsInspection,
    FtpInspection,
    SshInspection,
    RedisInspection,
    SmtpInspection,
    MysqlInspection,
    PostgreSqlInspection,
    MemcachedInspection,
    MongoDbInspection
} from "../inspection/types.js";

export type InspectionType =
    | "http"
    | "redirects"
    | "tls"
    | "favicon"
    | "robots"
    | "ssh"
    | "ftp"
    | "smtp"
    | "redis"
    | "mysql"
    | "postgresql"
    | "mongodb"
    | "memcached";

export interface FaviconInspection {

    url: string;

    status: number;

    exists: boolean;

    size?: number;

    md5?: string;

    sha256?: string;

    hash?: string;
}

export interface RobotsInspection {

    url: string;

    status: number;

    exists: boolean;

    disallow: string[];

    allow: string[];

    sitemaps: string[];

    body?: string;
}

interface BaseInspectionResult {

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

export type MongodbInspectionResult =
    BaseInspectionResult & {
    
        type: "mongodb";
    
        data: MongoDbInspection;
    };

export type MemcachedInspectionResult =
    BaseInspectionResult & {
    
        type: "memcached";
    
        data: MemcachedInspection;
    };

export type PostgreSQLInspectionResult =
    BaseInspectionResult & {
    
        type: "postgresql";
    
        data: PostgreSqlInspection;
    };

export type MySQLInspectionResult =
    BaseInspectionResult & {
    
        type: "mysql";
    
        data: MysqlInspection;
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
    | MongodbInspectionResult
    | MemcachedInspectionResult
    | PostgreSQLInspectionResult
    | MySQLInspectionResult;

export interface Inspector {

    supports(
        port: ScanPort
    ): boolean;

    inspect(
        host: string,
        port: ScanPort
    ): Promise<InspectionResult>;
}