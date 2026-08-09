import tls from "node:tls";

import type { TlsInspection } from "../inspection/types.js";

export class CertificateParser {

    parse(
        cert: tls.PeerCertificate
    ): NonNullable<TlsInspection["certificate"]> {

        return {

            subject: {
                ...(cert.subject?.CN
                    ? {
                        commonName:
                            Array.isArray(cert.subject.CN)
                                ? cert.subject.CN[0]
                                : cert.subject.CN
                    }
                    : {}),

                ...(cert.subject?.O
                    ? {
                        organization:
                            Array.isArray(cert.subject.O)
                                ? cert.subject.O[0]
                                : cert.subject.O
                    }
                    : {})
            },

            issuer: {
                ...(cert.issuer?.CN
                    ? {
                        commonName:
                            Array.isArray(cert.issuer.CN)
                                ? cert.issuer.CN[0]
                                : cert.issuer.CN
                    }
                    : {}),

                ...(cert.issuer?.O
                    ? {
                        organization:
                            Array.isArray(cert.issuer.O)
                                ? cert.issuer.O[0]
                                : cert.issuer.O
                    }
                    : {})
            },

            ...(cert.valid_from
                ? { validFrom: cert.valid_from }
                : {}),

            ...(cert.valid_to
                ? { validTo: cert.valid_to }
                : {}),

            ...(cert.serialNumber
                ? { serial: cert.serialNumber }
                : {}),

            ...(cert.fingerprint256
                ? { fingerprint: cert.fingerprint256 }
                : {}),

            ...(cert.subjectaltname
                ? { altNames: cert.subjectaltname }
                : {})
        };
    }
}