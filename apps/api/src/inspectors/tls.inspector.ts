import tls from "node:tls";

import type { ScanPort } from "../types/scan.types.js";
import type { InspectionResult } from "./inspector.interface.js";

import { CertificateParser } from "../parsers/certificate.parser.js";

import { scannerTimeouts } from "../config/scanner.config.js";

export class TlsInspector {

    supports(port: ScanPort): boolean {

        return (
            port.service === "https" ||
            port.tunnel === "ssl"
        );

    }

    private parser =
        new CertificateParser();

    async inspect(
        host: string,
        port: ScanPort
    ): Promise<InspectionResult> {

        return new Promise((resolve, reject) => {

            const socket = tls.connect({
                host,
                port: port.port,
                servername: host,
                rejectUnauthorized: false,
                timeout:
                    scannerTimeouts.tls,
            });

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
                        socket.getProtocol() ??
                        "unknown";

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
                                            cipher.standardName
                                    }
                                    : {}),

                                ...(cipher.version
                                    ? {
                                        version:
                                            cipher.version
                                    }
                                    : {})
                            },
                            certificate
                        }
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
                        new Error(
                            "TLS connection timed out"
                        ),
                        {
                            code: "ETIMEDOUT"
                        }
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
}