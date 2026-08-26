import { XMLParser } from "fast-xml-parser";

import type {
    ScanPort,
    ScanResult,
    DiscoveredHost,
    ScanCompletionStatus
} from "../types/scan.types.js";

export class NmapParser {

    private readonly parser =
        new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
        });

    private asArray<T>(
        value: T | T[] | undefined
    ): T[] {

        if (value === undefined) {
            return [];
        }

        return Array.isArray(value)
            ? value
            : [value];
    }

    parseDiscoveredHosts(
        xml: string,
    ): DiscoveredHost[] {

        const data =
            this.parser.parse(xml);

        const hosts =
            this.asArray(
                data.nmaprun?.host
            );

        return hosts
            .filter(
                (host: any) =>
                    host.status?.state === "up"
            )
            .map(
                (host: any): DiscoveredHost | null => {

                    const addresses =
                        this.asArray(
                            host.address
                        );

                    const ipv4 =
                        addresses.find(
                            (address: any) =>
                                address.addrtype === "ipv4"
                        );

                    if (
                        typeof ipv4?.addr !==
                        "string"
                    ) {
                        return null;
                    }

                    const hostnames =
                        this.asArray(
                            host.hostnames?.hostname
                        )
                        .map(
                            (hostname: any) =>
                                hostname.name
                        )
                        .filter(
                            (
                                name: unknown
                            ): name is string =>
                                typeof name === "string"
                        );

                    return {
                        ip: ipv4.addr,
                        hostnames,
                    };
                }
            )
            .filter(
                (
                    host
                ): host is DiscoveredHost =>
                    host !== null
            );
    }

    parse(
        xml: string
    ): ScanResult {

        console.log("[NmapParser] XML length:", xml.length);

        console.log(
            "[NmapParser] XML preview:",
            xml.slice(0, 2000)
        );

        const data =
            this.parser.parse(xml);

        const nmaprun =
            data.nmaprun;

        const host =
            data.nmaprun?.host;

        console.log(
            "[NmapParser] host exists:",
            !!host
        );

        console.log(
            "[NmapParser] host:",
            JSON.stringify(host, null, 2)
        );

        const addresses =
            this.asArray(host.address);

        const portsNode =
            host.ports;

        console.log(
            "[NmapParser] ports node:",
            JSON.stringify(
                portsNode,
                null,
                2
            )
        );

        const rawPorts =
            portsNode?.port;

        const ports =
            this.asArray(rawPorts);

        console.log(
            "[NmapParser] parsed raw ports:",
            ports.length
        );

        console.log(
            "[NmapParser] raw ports:",
            JSON.stringify(rawPorts, null, 2)
        );

        console.log(
            "[NmapParser] raw port count:",
            Array.isArray(rawPorts)
                ? rawPorts.length
                : 1
        );

        const ipv4 =
            addresses.find(
                (address: any) =>
                    address.addrtype === "ipv4"
            );

        const ipv6 =
            addresses.find(
                (address: any) =>
                    address.addrtype === "ipv6"
            );

        const mac =
            addresses.find(
                (address: any) =>
                    address.addrtype === "mac"
            );

        if (!host) {
            throw new Error(
                "Nmap returned no host information"
            );
        }

        const parsedPorts: ScanPort[] =
            ports.map(
                (port: any) => ({

                    scan: {
                        startedAt:
                            nmaprun.startstr,

                        nmapVersion:
                            nmaprun.version,

                        arguments:
                            nmaprun.args?.replace(/&#45;/g, "-"),
                    },

                    port:
                        Number(
                            port.portid
                        ),

                    protocol:
                        port.protocol ?? "tcp",

                    state:
                        port.state?.state ??
                        "unknown",

                    service:
                        port.service?.name ??
                        "",

                    product:
                        port.service?.product ??
                        "",

                    version:
                        port.service?.version ??
                        "",

                    extraInfo:
                        port.service?.extrainfo ??
                        "",

                    tunnel:
                        port.service?.tunnel ??
                        "",

                    nmapConfidence:
                        Number(
                            port.service?.conf ??
                            0
                        ),
                })
            );

        const rawHostname =
            host.hostnames?.hostname;

        const hostname =
            Array.isArray(rawHostname)
                ? rawHostname[0]?.name
                : rawHostname?.name;

        const extraports =
            portsNode?.extraports;

        const filteredPorts =
            extraports?.state === "filtered"
                ? {
                    count: Number(extraports.count ?? 0),
                    ports:
                        extraports.extrareasons?.ports ?? "",
                }
                : undefined;

        const hostTimedOut =
            host.timedout === "true";

        let scanStatus: ScanCompletionStatus;

        if (hostTimedOut) {

            scanStatus = "timeout";

        } else if (
            ports.length > 0
        ) {

            scanStatus = "completed";

        } else {

            scanStatus = "completed";

        }

        return {
            state:
                host.status?.state ?? "unknown",

            scanStatus,

            host:
                ipv4?.addr ??
                ipv6?.addr ??
                "",

            ...(hostname
                ? { hostname }
                : {}),

            addresses: {
                ...(ipv4?.addr
                    ? { ipv4: ipv4.addr }
                    : {}),

                ...(ipv6?.addr
                    ? { ipv6: ipv6.addr }
                    : {}),

                ...(mac?.addr
                    ? { mac: mac.addr }
                    : {}),
            },

            ports: parsedPorts,

            ...(filteredPorts
                ? { filteredPorts }
                : {}),

            scan: {
                startedAt: nmaprun.startstr,
                nmapVersion: nmaprun.version,
                arguments: nmaprun.args,
            },
        };
    }
}