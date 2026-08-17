import { env } from "./env.js";

export const scannerTimeouts = {

    nmap:
        env.SCANNER_NMAP_TIMEOUT_MS,

    inspector:
        env.SCANNER_INSPECTOR_TIMEOUT_MS,

    target:
        env.SCANNER_TARGET_TIMEOUT_MS,

    http:
        env.SCANNER_HTTP_TIMEOUT_MS,

    tls:
        env.SCANNER_TLS_TIMEOUT_MS,

    ssh:
        env.SCANNER_SSH_TIMEOUT_MS,
} as const;