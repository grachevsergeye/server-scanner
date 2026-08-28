import type { FingerprintEvidence } from "./evidence.types.js";
import type { FingerprintRule } from "./fingerprint.rules.types.js";

export const FingerprintRules: FingerprintRule[] = [

    /*
     * GOOGLE
     */

    {
        id: "google-httpserver2",

        services: [
            "http",
            "https"
        ],

        confidence: () => 60,

        match(evidence: FingerprintEvidence) {

            const server =
                evidence.headers?.server
                    ?.toString()
                    .toLowerCase() ?? "";

            return server.includes("httpserver2");

        },

        result: {
            vendor: "Google",
            category: "Web Server"
        }
    },

    {
        id: "google-technology",

        services: [
            "http",
            "https"
        ],

        confidence: () => 35,

        match(evidence: FingerprintEvidence) {

            return evidence.technologies
                ?.includes("Google") === true;

        },

        result: {
            vendor: "Google",
            category: "Web Server"
        }
    },

    {
        id: "google-title",

        services: [
            "http",
            "https"
        ],

        confidence: () => 20,

        match(evidence: FingerprintEvidence) {

            const title =
                evidence.title
                    ?.toLowerCase() ?? "";

            return (
                title.includes("google") ||
                title.includes("public dns")
            );

        },

        result: {
            vendor: "Google",
            category: "Web Server"
        }
    },

    {
        id: "google-certificate",

        services: [
            "http",
            "https"
        ],

        confidence: () => 35,

        match(evidence: FingerprintEvidence) {

            const certificate =
                evidence.certificate;

            const subject =
                certificate?.subject;

            const commonName =
                subject &&
                typeof subject === "object"
                    ? (subject as Record<string, unknown>).commonName
                    : undefined;

            return typeof commonName === "string"
                && commonName.toLowerCase().includes("google");

        },

        result: {
            vendor: "Google",
            category: "Web Server"
        }
    },

    /*
     * NGINX
     */

    {
        id: "nginx-server",

        services: [
            "http",
            "https"
        ],

        confidence: () => 70,

        match(evidence: FingerprintEvidence) {

            const server =
                evidence.headers?.server
                    ?.toString()
                    .toLowerCase() ?? "";

            return server.includes("nginx");
        },

        result: {
            vendor: "NGINX",
            category: "Web Server",
            product: "nginx"
        }
    },

    /*
     * APACHE
     */

    {
        id: "apache-server",

        services: [
            "http",
            "https"
        ],

        confidence: () => 70,

        match(evidence: FingerprintEvidence) {

            const server =
                evidence.headers?.server
                    ?.toString()
                    .toLowerCase() ?? "";

            return server.includes("apache");

        },

        result: {
            vendor: "Apache",
            category: "Web Server",
            product: "Apache HTTP Server"
        }
    },

    /*
     * MICROSOFT IIS
     */

    {
        id: "iis-server",

        services: [
            "http",
            "https"
        ],

        confidence: () => 70,

        match(evidence: FingerprintEvidence) {

            const server =
                evidence.headers?.server
                    ?.toString()
                    .toLowerCase() ?? "";

            return server.includes("microsoft-iis");

        },

        result: {
            vendor: "Microsoft",
            category: "Web Server",
            product: "IIS"
        }
    },

    /*
     * CLOUDFLARE
     */

    {
        id: "cloudflare",

        services: [
            "http",
            "https"
        ],

        match: evidence => {

            const server =
                evidence.server
                    ?.toLowerCase() ?? "";

            const hasCfRay =
                Boolean(
                    evidence.headers?.["cf-ray"]
                );

            const hasTechnology =
                evidence.technologies
                    ?.some(
                        tech =>
                            tech.toLowerCase() ===
                            "cloudflare"
                    ) === true;

            return (
                server.includes("cloudflare") ||
                hasCfRay ||
                hasTechnology
            );
        },

        confidence: evidence => {

            let score = 0;

            const server =
                evidence.server
                    ?.toLowerCase() ?? "";

            if (
                server.includes("cloudflare")
            ) {
                score += 40;
            }

            if (
                evidence.headers?.["cf-ray"]
            ) {
                score += 25;
            }

            if (
                evidence.technologies
                    ?.some(
                        tech =>
                            tech.toLowerCase() ===
                            "cloudflare"
                    )
            ) {
                score += 20;
            }

            return score;
        },

        result: {
            vendor: "Cloudflare",
            category: "CDN / Reverse Proxy",
            product: "Cloudflare"
        }
    },

    /*
     * EXPRESS
     */

    {
        id: "express",

        services: [
            "http",
            "https"
        ],

        confidence: () => 50,

        match(evidence: FingerprintEvidence) {

            const server =
                evidence.headers?.server
                    ?.toString()
                    .toLowerCase() ?? "";

            return server.includes("express");

        },

        result: {
            vendor: "OpenJS",
            category: "Application Framework",
            product: "Express"
        }
    },

    /*
     * OPENRESTY
     */

    {
        id: "openresty",

        services: [
            "http",
            "https"
        ],

        confidence: () => 70,

        match(evidence: FingerprintEvidence) {

            const server =
                evidence.headers?.server
                    ?.toString()
                    .toLowerCase() ?? "";

            return server.includes("openresty");

        },

        result: {
            vendor: "OpenResty",
            category: "Web Server",
            product: "OpenResty"
        }
    },

    /*
     * CADDY
     */

    {
        id: "caddy",

        services: [
            "http",
            "https"
        ],

        confidence: () => 70,

        match(evidence: FingerprintEvidence) {

            const server =
                evidence.headers?.server
                    ?.toString()
                    .toLowerCase() ?? "";

            return server.includes("caddy");

        },

        result: {
            vendor: "Caddy",
            category: "Web Server",
            product: "Caddy"
        }
    },

    /*
     * OPENSSH
     */

    {
        id: "openssh",

        services: ["ssh"],

        match: evidence => {
            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            return (
                product.includes("openssh") ||
                banner.includes("openssh")
            );
        },

        confidence: evidence => {
            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            if (
                product.includes("openssh") &&
                banner.includes("openssh")
            ) {
                return 100;
            }

            return 85;
        },

        result: {
            vendor: "OpenSSH",
            category: "Remote Administration",
            product: "OpenSSH"
        }
    },

    {
        id: "ssh-service",

        services: ["ssh"],

        fallback: true,

        match: evidence =>
            evidence.service === "ssh",

        confidence: () => 50,

        result: {
            vendor: "Unknown",
            category: "Remote Administration"
        }
    },

    /*
    * TELLNET
    */

        {
            id: "linux-telnetd",
            services: ["telnet"],

            match: evidence => {

                const product =
                    evidence.product?.toLowerCase() ?? "";

                const banner =
                    evidence.banner?.toLowerCase() ?? "";

                return (
                    product.includes("telnetd") ||
                    banner.includes("telnet")
                );
            },

            confidence: evidence => {

                const product =
                    evidence.product?.toLowerCase() ?? "";

                const banner =
                    evidence.banner?.toLowerCase() ?? "";

                if (
                    product.includes("telnetd") &&
                    banner.includes("telnet")
                ) {
                    return 100;
                }

                if (
                    product.includes("telnetd")
                ) {
                    return 90;
                }

                if (
                    banner.includes("telnet")
                ) {
                    return 70;
                }

                return 0;
            },

            result: {
                vendor: "Linux",
                category: "Remote Administration",
                product: "telnetd"
            }
        },

        {
            id: "telnet-service",

            services: ["telnet"],

            fallback: true,

            match: evidence =>
                evidence.service === "telnet",

            confidence: () => 40,

            result: {
                vendor: "Unknown",
                category: "Remote Administration",
                product: "Telnet"
            }
        },

    /*
    * DROPBEAR
    */

    {
        id: "dropbear-banner",

        services: ["ssh"],

        confidence: () => 80,

        match(evidence) {
            const banner =
                evidence.banner?.toLowerCase() ?? "";

            return banner.includes("dropbear");
        },

        result: {
            vendor: "Dropbear",
            category: "SSH Server",
            product: "Dropbear SSH"
        }
    },

    /*
    * VSFTPD
    */

    {
        id: "vsftpd",

        services: ["ftp"],

        confidence: () => 85,

        match(evidence) {
            const banner =
                evidence.banner?.toLowerCase() ?? "";

            const welcome =
                evidence.welcome?.toLowerCase() ?? "";

            return (
                banner.includes("vsftpd") ||
                welcome.includes("vsftpd")
            );
        },

        result: {
            vendor: "vsftpd",
            category: "FTP Server",
            product: "vsftpd"
        }
    },

    /*
    * PROFTPD
    */

    {
        id: "proftpd",

        services: ["ftp"],

        confidence: () => 85,

        match(evidence) {
            const banner =
                evidence.banner?.toLowerCase() ?? "";

            const welcome =
                evidence.welcome?.toLowerCase() ?? "";

            return (
                banner.includes("proftpd") ||
                welcome.includes("proftpd")
            );
        },

        result: {
            vendor: "ProFTPD",
            category: "FTP Server",
            product: "ProFTPD"
        }
    },

    /*
    * POSTFIX
    */

    {
        id: "postfix",

        services: ["smtp"],

        confidence: () => 85,

        match(evidence) {
            const banner =
                evidence.banner?.toLowerCase() ?? "";

            return banner.includes("postfix");
        },

        result: {
            vendor: "Postfix",
            category: "Mail Server",
            product: "Postfix"
        }
    },

    /*
    * EXIM
    */

    {
        id: "exim",

        services: ["smtp"],

        confidence: () => 85,

        match(evidence) {
            const banner =
                evidence.banner?.toLowerCase() ?? "";

            return banner.includes("exim");
        },

        result: {
            vendor: "Exim",
            category: "Mail Server",
            product: "Exim"
        }
    },

    /*
     * UNBOUND
     */

    {
        id: "unbound",

        services: [
            "domain"
        ],

        match(evidence) {

            const product =
                evidence.product
                    ?.toLowerCase() ?? "";

            return product.includes("unbound");
        },

        confidence() {
            return 90;
        },

        result: {
            vendor: "NLnet Labs",
            category: "DNS Server",
            product: "Unbound"
        }
    },

    /*
    * MYSQL
    */

    {
        id: "mysql",

        services: ["mysql"],

        confidence: (evidence: FingerprintEvidence) => {
            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            if (
                product.includes("mysql") &&
                !product.includes("mariadb")
            ) {
                return 95;
            }

            if (
                banner.includes("mysql") &&
                !banner.includes("mariadb")
            ) {
                return 95;
            }

            return 0;
        },

        match: (evidence: FingerprintEvidence) => {
            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            return (
                (
                    product.includes("mysql") ||
                    banner.includes("mysql")
                ) &&
                !product.includes("mariadb") &&
                !banner.includes("mariadb")
            );
        },

        result: {
            vendor: "Oracle",
            category: "Database",
            product: "MySQL"
        }
    },

    {
        id: "mysql-service",

        services: ["mysql"],

        fallback: true,

        match: (evidence: FingerprintEvidence) =>
            evidence.service === "mysql",

        confidence: () => 65,

        result: {
            vendor: "Unknown",
            category: "Database",
            product: "MySQL-compatible database"
        }
    },

    /*
    * MariaDB
    */

    {
        id: "mariadb",

        services: ["mysql"],

        confidence: (evidence: FingerprintEvidence) => {
            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            if (
                product.includes("mariadb") ||
                banner.includes("mariadb")
            ) {
                return 98;
            }

            return 0;
        },

        match: (evidence: FingerprintEvidence) => {
            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            return (
                product.includes("mariadb") ||
                banner.includes("mariadb")
            );
        },

        result: {
            vendor: "MariaDB Foundation",
            category: "Database",
            product: "MariaDB"
        }
    },

    /*
    * PostgreSQL
    */

    {
        id: "postgresql",

        services: ["postgresql"],

        confidence: evidence => {

            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            if (
                product.includes("postgresql") ||
                product.includes("postgres") ||
                banner.includes("postgresql") ||
                banner.includes("postgres")
            ) {
                return 98;
            }

            return 0;
        },

        match: evidence => {

            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            return (
                product.includes("postgresql") ||
                product.includes("postgres") ||
                banner.includes("postgresql") ||
                banner.includes("postgres")
            );
        },

        result: {
            vendor: "PostgreSQL Global Development Group",
            category: "Database",
            product: "PostgreSQL"
        }
    },

    {
        id: "postgresql-service",

        services: ["postgresql"],

        fallback: true,

        match: evidence =>
            evidence.service === "postgresql",

        confidence: () => 75,

        result: {
            vendor: "PostgreSQL",
            category: "Database",
            product: "PostgreSQL"
        }
    },

    /*
    * MongoDB
    */

    {
        id: "mongodb",

        services: ["mongodb"],

        confidence: evidence => {

            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            if (
                product.includes("mongodb") ||
                product.includes("mongo") ||
                banner.includes("mongodb") ||
                banner.includes("mongo")
            ) {
                return 98;
            }

            return 0;
        },

        match: evidence => {

            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            return (
                product.includes("mongodb") ||
                product.includes("mongo") ||
                banner.includes("mongodb") ||
                banner.includes("mongo")
            );
        },

        result: {
            vendor: "MongoDB",
            category: "Database",
            product: "MongoDB"
        }
    },

    /*
    * REDIS
    */

    {
        id: "redis",

        services: ["redis"],

        confidence: evidence => {

            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            if (
                product.includes("redis") ||
                banner.includes("redis")
            ) {
                return 98;
            }

            return 0;
        },

        match: evidence => {

            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            return (
                product.includes("redis") ||
                banner.includes("redis")
            );
        },

        result: {
            vendor: "Redis",
            category: "Database",
            product: "Redis"
        }
    },

    /*
    MEMCACHED
    */

    {
        id: "memcached",

        services: ["memcached"],

        confidence: evidence => {

            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            if (
                product.includes("memcached") ||
                banner.includes("memcached")
            ) {
                return 98;
            }

            return 0;
        },

        match: evidence => {

            const product =
                evidence.product?.toLowerCase() ?? "";

            const banner =
                evidence.banner?.toLowerCase() ?? "";

            return (
                product.includes("memcached") ||
                banner.includes("memcached")
            );
        },

        result: {
            vendor: "Memcached",
            category: "Database / Cache",
            product: "Memcached"
        }
    },

];