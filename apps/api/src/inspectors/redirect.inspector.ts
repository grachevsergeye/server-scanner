import axios from "axios";

import type {
    Inspector,
    InspectionResult
} from "./inspector.interface.js";

import type { ScanPort } from "../types/scan.types.js";


interface RedirectHop {
    url: string;
    status: number;
    location: string;
}

export class RedirectInspector implements Inspector {

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

        let currentUrl =
            `${protocol}://${host}:${port.port}`;

        const redirects: RedirectHop[] = [];

        const maxRedirects = 10;

        for (let i = 0; i < maxRedirects; i++) {

            const response = await axios.get(
                currentUrl,
                {
                    timeout: 5000,

                    maxRedirects: 0,

                    validateStatus: () => true
                }
            );

            const location =
                response.headers.location;

            if (
                response.status < 300 ||
                response.status >= 400 ||
                !location
            ) {
                return {

                    port: port.port,

                    service: port.service,

                    type: "redirects",

                    title: "Redirects",

                    data: {

                        finalUrl: currentUrl,

                        redirects

                    }

                };
            }

            redirects.push({

                url: currentUrl,

                status: response.status,

                location

            });

            currentUrl =
                new URL(
                    location,
                    currentUrl
                ).toString();

        }

        return {

            port: port.port,

            service: port.service,

            type: "redirects",

            title: "Redirects",

            data: {

                finalUrl: currentUrl,

                redirects,

                maxRedirectsReached: true

            }

        };

    }

}