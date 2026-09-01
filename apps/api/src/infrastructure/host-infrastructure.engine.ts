import type { PortAnalysis } from "../analysis/types.js";

import type {
    HostInfrastructureAnalysis
} from "./host-infrastructure.types.js";

export class HostInfrastructureEngine {

    analyze(
        ports: PortAnalysis[]
    ): HostInfrastructureAnalysis {

        const detected =
            ports.filter(
                port =>
                    port.infrastructure.confidence > 0
            );

        if (detected.length === 0) {

            return {

                type: "direct",

                originVisibility: "unknown",

                technologies: [],

                confidence: 0,

                evidence: [],

                ports: []

            };
        }

        const vendorGroups =
            new Map<
                string,
                PortAnalysis[]
            >();

        for (const port of detected) {

            const vendor =
                port.infrastructure.vendor ??
                "Unknown";

            const existing =
                vendorGroups.get(vendor);

            if (existing) {

                existing.push(port);

            } else {

                vendorGroups.set(
                    vendor,
                    [port]
                );
            }
        }


        const primary =
            [...vendorGroups.entries()]
                .sort(
                    (a, b) =>
                        b[1].length -
                        a[1].length
                )[0];

        if (!primary) {

            return {

                type: "direct",

                originVisibility: "unknown",

                technologies: [],

                confidence: 0,

                evidence: [],

                ports: []

            };
        }

        const [
            vendor,
            vendorPorts
        ] = primary;

        const evidence =
            [
                ...new Set(
                    vendorPorts.flatMap(
                        port =>
                            port.infrastructure.evidence
                    )
                )
            ];

        const technologies =
            [
                ...new Set(
                    vendorPorts.flatMap(
                        port =>
                            port.infrastructure.technologies
                    )
                )
            ];

        const confidence =
            Math.max(
                ...vendorPorts.map(
                    port =>
                        port.infrastructure.confidence
                )
            );

        const type =
            vendorPorts
                .find(
                    port =>
                        port.infrastructure.type !==
                        "direct"
                )
                ?.infrastructure.type ??
            "direct";


        const originVisibility =
            vendorPorts.some(
                port =>
                    port.infrastructure.originVisibility ===
                    "hidden"
            )
                ? "hidden"
                : vendorPorts.some(
                    port =>
                        port.infrastructure.originVisibility ===
                        "visible"
                )
                    ? "visible"
                    : "unknown";

        const observedPorts =
            vendorPorts.map(
                port =>
                    port.port.port
            );

        return {

            type,

            originVisibility,

            vendor,

            technologies,

            confidence,

            evidence,

            ports:
                observedPorts

        };
    }
}