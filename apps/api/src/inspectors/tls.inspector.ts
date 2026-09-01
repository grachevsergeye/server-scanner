import tls from "node:tls";

import type { ScanPort } from "../types/scan.types.js";

import type { 
    Inspector
} from "./inspector.interface.js";

import type {
    InspectionResult
} from "./inspector-result.types.js"

import { CertificateParser } from "../parsers/certificate.parser.js";
import { scannerTimeouts } from "../config/scanner.config.js";

export class TlsInspector implements Inspector {

    supports(port: ScanPort): boolean {
        return (
            port.service === "https" ||
            port.tunnel === "ssl"
        );
    }

    private parser = new CertificateParser();

    async inspect(
        host: string,
        port: ScanPort,
    ): Promise<InspectionResult> {

        return new Promise((resolve, reject) => {

            const options: tls.ConnectionOptions = {
                host,
                port: port.port,
                rejectUnauthorized: false,
                timeout: scannerTimeouts.tls,
            };

            // Only set SNI when host is actually a DNS hostname.
            if (!this.isIpAddress(host)) {
                options.servername = host;
            }

            const socket = tls.connect(options);

            let finished = false;

            const cleanup = () => {
                socket.removeAllListeners();
                socket.destroy();
            };

            socket.once("secureConnect", () => {

                if (finished) {
                    return;
                }

                finished = true;

                try {

                    const protocol =
                        socket.getProtocol() ?? "unknown";

                    const certificate =
                        this.parser.parse(
                            socket.getPeerCertificate()
                        );

                    const cipher =
                        socket.getCipher();

                    resolve({
                        port: port.port,
                        service: port.service,
                        type: "tls",
                        title: "TLS",
                        data: {
                            protocol,
                            cipher: {
                                name: cipher.name,

                                ...(cipher.standardName
                                    ? {
                                        standardName:
                                            cipher.standardName,
                                    }
                                    : {}),

                                ...(cipher.version
                                    ? {
                                        version:
                                            cipher.version,
                                    }
                                    : {}),
                            },
                            certificate,
                        },
                    });

                } catch (error) {
                    reject(error);
                } finally {
                    cleanup();
                }
            });

            socket.once("timeout", () => {

                if (finished) {
                    return;
                }

                finished = true;

                const error =
                    Object.assign(
                        new Error("TLS connection timed out"),
                        { code: "ETIMEDOUT" },
                    );

                cleanup();
                reject(error);
            });

            socket.once("error", error => {

                if (finished) {
                    return;
                }

                finished = true;

                cleanup();
                reject(error);
            });
        });
    }

    private isIpAddress(host: string): boolean {
        return (
            /^[0-9.]+$/.test(host) ||
            host.includes(":")
        );
    }
}