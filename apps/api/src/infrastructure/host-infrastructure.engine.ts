import type { PortAnalysis } from "../analysis/types.js";

import type {
    HostInfrastructureAnalysis
} from "./host-infrastructure.types.js";

export class HostInfrastructureEngine {

    analyze(
        ports: PortAnalysis[]
    ): HostInfrastructureAnalysis {

        /*
         * Only consider ports where
         * infrastructure was actually detected.
         */

        const detected =
            ports.filter(
                port =>
                    port.infrastructure.confidence > 0
            );

        /*
         * Nothing detected.
         */

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

        /*
         * Group observations by vendor.
         */

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

        /*
         * Select the vendor observed
         * on the most ports.
         */

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

        /*
         * Combine evidence.
         */

        const evidence =
            [
                ...new Set(
                    vendorPorts.flatMap(
                        port =>
                            port.infrastructure.evidence
                    )
                )
            ];

        /*
         * Combine technologies.
         */

        const technologies =
            [
                ...new Set(
                    vendorPorts.flatMap(
                        port =>
                            port.infrastructure.technologies
                    )
                )
            ];

        /*
         * Highest confidence observed
         * for this vendor.
         */

        const confidence =
            Math.max(
                ...vendorPorts.map(
                    port =>
                        port.infrastructure.confidence
                )
            );

        /*
         * Infrastructure type.
         */

        const type =
            vendorPorts
                .find(
                    port =>
                        port.infrastructure.type !==
                        "direct"
                )
                ?.infrastructure.type ??
            "direct";

        /*
         * Origin visibility.
         */

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

        /*
         * Ports where this infrastructure
         * was observed.
         */

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