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

        score: () => 60,

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

        score: () => 35,

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

        score: () => 20,

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

        score: () => 35,

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

        score: () => 70,

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

        score: () => 70,

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

        score: () => 70,

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
            return (
                evidence.server
                    ?.toLowerCase()
                    .includes("cloudflare") === true
            );
        },

        score: evidence => {

            let score = 0;

            if (
                evidence.server
                    ?.toLowerCase()
                    .includes("cloudflare")
            ) {
                score += 40;
            }

            if (
                evidence.headers?.["cf-ray"]
            ) {
                score += 25;
            }

            if (
                evidence.technologies?.includes("Cloudflare")
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

        score: () => 50,

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

        score: () => 70,

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

        score: () => 70,

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
        id: "openssh-banner",

        services: [
            "http",
            "https"
        ],

        score: () => 80,

        match(evidence: FingerprintEvidence) {

            const banner =
                evidence.banner
                    ?.toLowerCase() ?? "";

            return banner.includes("openssh");

        },

        result: {
            vendor: "OpenSSH",
            category: "SSH Server",
            product: "OpenSSH"
        }
    },

    /*
     * DROPBEAR
     */

    {
        id: "dropbear-banner",

        services: [
            "http",
            "https"
        ],

        score: () => 80,

        match(evidence: FingerprintEvidence) {

            const banner =
                evidence.banner
                    ?.toLowerCase() ?? "";

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

        services: [
            "http",
            "https"
        ],

        score: () => 85,

        match(evidence: FingerprintEvidence) {

            const banner =
                evidence.banner
                    ?.toLowerCase() ?? "";

            const welcome =
                evidence.welcome
                    ?.toLowerCase() ?? "";

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

        services: [
            "http",
            "https"
        ],

        score: () => 85,

        match(evidence: FingerprintEvidence) {

            const banner =
                evidence.banner
                    ?.toLowerCase() ?? "";

            const welcome =
                evidence.welcome
                    ?.toLowerCase() ?? "";

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

        services: [
            "http",
            "https"
        ],

        score: () => 85,

        match(evidence: FingerprintEvidence) {

            const banner =
                evidence.banner
                    ?.toLowerCase() ?? "";

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

        services: [
            "http",
            "https"
        ],

        score: () => 85,

        match(evidence: FingerprintEvidence) {

            const banner =
                evidence.banner
                    ?.toLowerCase() ?? "";

            return banner.includes("exim");

        },

        result: {
            vendor: "Exim",
            category: "Mail Server",
            product: "Exim"
        }
    },

    /*
     * REDIS
     */

    {
        id: "redis",

        services: [
            "http",
            "https"
        ],

        score: () => 90,

        match(evidence: FingerprintEvidence) {

            const banner =
                evidence.banner
                    ?.toLowerCase() ?? "";

            return (
                evidence.service === "redis" ||
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

        score() {
            return 90;
        },

        result: {
            vendor: "NLnet Labs",
            category: "DNS Server",
            product: "Unbound"
        }
    },

];