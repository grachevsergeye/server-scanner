import type { ScanPort } from "../types/scan.types.js";
import type { InspectionResult } from "../inspectors/inspector.interface.js";
import type { FingerprintEvidence } from "./evidence.types.js";

export class EvidenceBuilder {

    build(
        port: ScanPort,
        inspections: InspectionResult[]
    ): FingerprintEvidence {

        const evidence: FingerprintEvidence = {
            service: port.service
        };

        /*
         * Nmap
         */

        if (port.product) {
            evidence.product = port.product;
        }

        if (port.version) {
            evidence.version = port.version;
        }

        /*
         * Inspection results
         */

        for (const inspection of inspections) {

            if (inspection.port !== port.port) {
                continue;
            }

            switch (inspection.type) {

                /*
                 * HTTP
                 */

                case "http": {

                    const data = inspection.data;

                    evidence.url = data.url;
                    evidence.status = data.status;

                    if (data.headers) {

                        evidence.headers =
                            Object.fromEntries(
                                Object.entries(data.headers).map(
                                    ([key, value]) => [
                                        key.toLowerCase(),
                                        value
                                    ]
                                )
                            );

                    }

                    const server =
                        data.server ??
                        evidence.headers?.["server"];

                    if (server) {
                        evidence.server = server;
                    }

                    /*
                    * Other HTTP evidence
                    */

                    if (data.poweredBy) {
                        evidence.poweredBy =
                            data.poweredBy;
                    }

                    if (data.title) {
                        evidence.title =
                            data.title;
                    }

                    if (data.technologies) {
                        evidence.technologies =
                            data.technologies;
                    }

                    break;
                }

                /*
                 * TLS
                 */

                case "tls": {

                    const data = inspection.data;

                    evidence.tlsProtocol =
                        data.protocol;

                    if (data.certificate) {

                        evidence.certificate = data.certificate;
                    }

                    if (data.cipher?.name) {

                        evidence.tlsCipher =
                            data.cipher.name;
                    }

                    break;
                }

                /*
                 * Redirects
                 */

                case "redirects": {

                    const data = inspection.data;

                    evidence.redirects =
                        data.redirects;

                    evidence.finalUrl =
                        data.finalUrl;

                    break;
                }

                /*
                 * Favicon
                 */

                case "favicon": {

                    const data = inspection.data;

                    evidence.favicon = {
                        exists: data.exists,
                        status: data.status
                    };

                    if (data.md5) {
                        evidence.favicon.md5 =
                            data.md5;
                    }

                    if (data.sha256) {
                        evidence.favicon.sha256 =
                            data.sha256;
                    }

                    break;
                }

                /*
                 * Robots
                 */

                case "robots": {

                    const data = inspection.data;

                    evidence.robots = {
                        exists: data.exists,
                        status: data.status
                    };

                    break;
                }

                /*
                 * SSH, Redis, SMTP, FTP
                 */

                case "ssh": {

                    const data = inspection.data;

                    if (data.banner) {
                        evidence.banner =
                            data.banner;
                    }

                    break;
                }

                case "redis": {

                    const data = inspection.data;

                    if (data.info) {
                        evidence.banner =
                            data.info;
                    }

                    break;
                }

                case "smtp": {

                    const data = inspection.data;

                    if (data.banner) {
                        evidence.banner =
                            data.banner;
                    }

                    break;
                }

                case "ftp": {

                    const data = inspection.data;

                    if (data.currentDirectory) {
                        evidence.welcome =
                            data.currentDirectory;
                    }

                    break;
                }
            }
        }

        return evidence;
    }
}