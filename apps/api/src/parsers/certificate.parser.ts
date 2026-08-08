import type { PeerCertificate } from "node:tls";
import tls from "node:tls";

export class CertificateParser {

    parse(cert: tls.PeerCertificate) {

        return {

            subject: {

                commonName:
                    cert.subject?.CN,

                organization:
                    cert.subject?.O

            },

            issuer: {

                commonName:
                    cert.issuer?.CN,

                organization:
                    cert.issuer?.O

            },

            validFrom:
                cert.valid_from,

            validTo:
                cert.valid_to,

            serial:
                cert.serialNumber,

            fingerprint:
                cert.fingerprint256,

            altNames:
                cert.subjectaltname

        };

    }

}