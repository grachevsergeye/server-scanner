import axios from "axios";

import type {
    Inspector,
    InspectionResult
} from "./inspector.interface.js";

import type { ScanPort } from "../types/scan.types.js";

export class RobotsInspector implements Inspector {

    supports(port: ScanPort): boolean {

        return port.service === "http"
            || port.service === "https";

    }

    async inspect(
        host: string,
        port: ScanPort
    ): Promise<InspectionResult> {

    const protocol =
        port.service === "https" ||
        port.tunnel === "ssl"
            ? "https"
            : "http";

        const url =
            `${protocol}://${host}:${port.port}/robots.txt`;

        const response = await axios.get(
            url,
            {
                timeout: 5000,
                validateStatus: () => true
            }
        );

        const body =
            typeof response.data === "string"
                ? response.data
                : "";

        const lines =
            body
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(Boolean);

        const disallow: string[] = [];
        const allow: string[] = [];
        const sitemaps: string[] = [];

        for (const line of lines) {

            const [key, ...valueParts] =
                line.split(":");

            if (!key)
                continue;

            const value =
                valueParts
                    .join(":")
                    .trim();

            switch (key.toLowerCase()) {

                case "disallow":

                    if (value)
                        disallow.push(value);

                    break;

                case "allow":

                    if (value)
                        allow.push(value);

                    break;

                case "sitemap":

                    if (value)
                        sitemaps.push(value);

                    break;

            }

        }

        return {

            port: port.port,

            service: port.service,

            type: "robots",

            title: "Robots.txt",

            data: {

                url,

                status: response.status,

                exists: response.status === 200,

                disallow,

                allow,

                sitemaps,

                body

            }

        };

    }

}