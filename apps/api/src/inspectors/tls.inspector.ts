import tls from "node:tls";
import type { ScanPort } from "../types/scan.types.js";
import type { InspectionResult } from "./inspector.interface.js";
import { CertificateParser } from "../parsers/certificate.parser.js";

export class TlsInspector {

    supports(port: ScanPort) {

        return port.service === "https"
            || port.tunnel === "ssl";

    }

    private parser = new CertificateParser();

    async inspect(host: string, port: ScanPort): Promise<InspectionResult> {

        return new Promise((resolve, reject) => {

            const socket = tls.connect({

                host,

                port: port.port,

                servername: host,
                rejectUnauthorized: false

            });

            socket.once("secureConnect", () => {

                const certificate = this.parser.parse(
                    socket.getPeerCertificate()
                );

                resolve({

                    port: port.port,

                    service: port.service,

                    title: "TLS",

                    data: {

                        protocol: socket.getProtocol(),

                        cipher: socket.getCipher(),

                        certificate

                    }

                });

                socket.end();

            });
            
            socket.once("error", reject);
            
        });

    }
}