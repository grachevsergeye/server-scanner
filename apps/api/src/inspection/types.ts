export interface HttpInspection { 
 
    url: string; 
 
    status: number; 
 
    title: string; 
 
    headers: Record<string, string>; 
 
    technologies: string[]; 
 
    body?: string; 
 
    contentType?: string; 
 
    contentLength?: number; 
 
    server?: string; 
 
    poweredBy?: string; 
 
    description?: string; 
 
    language?: string; 
 
    securityHeaders: { 
 
        hsts: boolean; 
 
        csp: boolean; 
 
        xFrameOptions: boolean; 
 
        xContentTypeOptions: boolean; 
 
        referrerPolicy: boolean; 
 
        permissionsPolicy: boolean; 
 
    }; 
 
    page: { 
 
        forms: number; 
 
        links: number; 
 
        scripts: number; 
 
        images: number; 
 
    }; 
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
 
    protocol?: string; 
 
    software?: string; 
 
    authentication?:  
        "required" | 
        "not_required" | 
        "unknown"; 
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

export interface TelnetInspection {
    banner?: string;

    protocol?: string;

    authentication?: 
        | "required"
        | "not_required"
        | "unknown";
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