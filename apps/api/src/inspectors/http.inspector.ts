import axios from "axios";
import * as cheerio from "cheerio";

import type {
    Inspector,
    InspectionResult
} from "./inspector.interface.js";

import type { ScanPort } from "../types/scan.types.js";
import { TechnologyDetector } from "./technology.detector.js";

import { scannerTimeouts } from "../config/scanner.config.js";

export class HttpInspector implements Inspector {

    supports(port: ScanPort): boolean {

        return (
            port.service === "http" ||
            port.service === "https"
        );

    }

    private detector =
        new TechnologyDetector();

    private normalizeHeaders(
        headers: Record<string, unknown>
    ): Record<string, string> {
        const result: Record<string, string> = {};

        for (const [key, value] of Object.entries(headers)) {

            if (
                value === undefined ||
                value === null
            ) {
                continue;
            }

            if (Array.isArray(value)) {
                result[key] = value.join(", ");
            } else {
                result[key] = String(value);
            }
        }

        return result;
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
        `${protocol}://${host}:${port.port}`;

        const response =
            await axios.get(
                url,
                {
                    timeout:
                        scannerTimeouts.http,
                    validateStatus: () => true
                }
            );

        const html =
            typeof response.data === "string"
                ? response.data
                : "";

        const $ =
            cheerio.load(html);

        const title =
            $("title")
                .text()
                .trim();

        const headers =
            this.normalizeHeaders(
                Object.fromEntries(
                    Object.entries(response.headers)
                )
            );

        const technologies =
            this.detector.detect(
                response.headers
            );

        const server =
            headers["server"];

        const poweredBy =
            headers["x-powered-by"];

        return {

            port: port.port,

            service: port.service,

            type: "http",

            title:
                protocol.toUpperCase(),

            data: {

                url,

                status:
                    response.status,

                title,

                ...(server
                    ? { server }
                    : {}),

                ...(poweredBy
                    ? { poweredBy }
                    : {}),

                headers,

                technologies,

                body:
                    html.slice(
                        0,
                        5000
                    )

            }

        };
    }
}