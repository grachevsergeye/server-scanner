import tls from "node:tls";

import type { ScanPort } from "../types/scan.types.js";
import type { InspectionResult } from "./inspector.interface.js";

import { CertificateParser } from "../parsers/certificate.parser.js";

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

                rejectUnauthorized: false

            });

            socket.once("secureConnect", () => {

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

                socket.end();

            });

            socket.once(
                "error",
                reject
            );

        });

    }
}