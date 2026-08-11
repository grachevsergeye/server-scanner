import { XMLParser } from "fast-xml-parser";

import type {
    ScanPort,
    ScanResult,
} from "../types/scan.types.js";

export class NmapParser {

    private parser =
        new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
        });

    parse(xml: string): ScanResult {

        const data =
            this.parser.parse(xml);

        const host =
            data.nmaprun.host;

        const rawPorts =
            host.ports?.port ?? [];

        const ports =
            Array.isArray(rawPorts)
                ? rawPorts
                : [rawPorts];

        const parsedPorts: ScanPort[] =
            ports.map(
                (port: any) => ({

                    port:
                        Number(port.portid),

                    protocol:
                        port.protocol,

                    state:
                        port.state?.state ?? "unknown",

                    service:
                        port.service?.name ?? "",

                    product:
                        port.service?.product ?? "",

                    version:
                        port.service?.version ?? "",

                    extraInfo:
                        port.service?.extrainfo ?? "",

                    tunnel:
                        port.service?.tunnel ?? "",

                    confidence:
                        Number(
                            port.service?.conf ?? 0
                        ),

                    nmapConfidence:
                        Number(
                            port.service?.conf ?? 0
                        )

                })
            );

        return {

            host:
                host.address.addr,

            hostname:
                host.hostnames?.hostname?.name ?? "",

            ports:
                parsedPorts

        };

    }

}