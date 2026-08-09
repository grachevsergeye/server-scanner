import type { RiskLevel } from "./types.js";

export interface RiskDefinition {
    title: string;
    reason: string;
    level: RiskLevel;
    score: number;
}

export const RISK_DEFINITIONS = {
    "DNS-EXPOSED": {
        title: "DNS server exposed",
        reason: "A DNS service is publicly accessible.",
        level: "Info",
        score: 0
    },

    "HTTP-CDN-EDGE": {
        title: "HTTP service protected by CDN",
        reason:
            "HTTP services are exposed behind a CDN with hidden origin.",
        level: "Info",
        score: 0
    },

    "HTTP-UNENCRYPTED": {
        title: "Unencrypted HTTP exposed",
        reason:
            "An HTTP service is publicly accessible without encryption.",
        level: "Medium",
        score: 10
    },

    "HTTP-REDIRECTS-HTTPS": {
        title: "HTTP redirects to HTTPS",
        reason:
            "The HTTP service redirects clients to an encrypted HTTPS endpoint.",
        level: "Info",
        score: 0
    },

    "HTTP-ENCRYPTED": {
        title: "Encrypted HTTP service",
        reason:
            "The web service is protected by TLS.",
        level: "Info",
        score: 0
    },

    "HTTPS-ENCRYPTED": {
        title: "Encrypted HTTPS service",
        reason:
            "The HTTPS service is using TLS encryption.",
        level: "Info",
        score: 0
    },

    "HTTPS": {
        title: "HTTPS service detected",
        reason:
            "An HTTPS service is publicly accessible.",
        level: "Info",
        score: 0
    },

    "REDIS-EXPOSED": {
        title: "Redis publicly exposed",
        reason:
            "A Redis database is directly accessible from the Internet.",
        level: "Critical",
        score: 40
    },

    "MONGODB-EXPOSED": {
        title: "MongoDB publicly exposed",
        reason:
            "A MongoDB database is directly accessible from the Internet.",
        level: "Critical",
        score: 40
    },

    "MYSQL-EXPOSED": {
        title: "MySQL publicly exposed",
        reason:
            "A MySQL database is directly accessible from the Internet.",
        level: "High",
        score: 25
    },

    "POSTGRESQL-EXPOSED": {
        title: "PostgreSQL publicly exposed",
        reason:
            "A PostgreSQL database is directly accessible from the Internet.",
        level: "High",
        score: 25
    },

    "FTP-UNENCRYPTED": {
        title: "Unencrypted FTP exposed",
        reason:
            "FTP is exposed and transmits credentials without encryption.",
        level: "High",
        score: 25
    },

    "TELNET-INSECURE": {
        title: "Insecure Telnet service",
        reason:
            "Telnet is an insecure remote administration protocol.",
        level: "Critical",
        score: 40
    },

    "SSH-EXPOSED": {
        title: "SSH exposed",
        reason:
            "An SSH remote administration service is publicly accessible.",
        level: "Low",
        score: 3
    },

    "UNKNOWN-SERVICE": {
        title: "Unknown service exposed",
        reason:
            "An unidentified network service is publicly accessible.",
        level: "Info",
        score: 0
    }
} satisfies Record<string, RiskDefinition>;

export type RiskCode =
    keyof typeof RISK_DEFINITIONS;