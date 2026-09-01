import axios from "axios";
import * as cheerio from "cheerio";

import type {
    Inspector
} from "./inspector.interface.js";

import type {
    InspectionResult
} from "./inspector-result.types.js"

import type { ScanPort } from "../types/scan.types.js";

import { TechnologyDetector } 
    from "./technology.detector.js";

import { scannerTimeouts } 
    from "../config/scanner.config.js";


export class HttpInspector implements Inspector {

    private detector =
        new TechnologyDetector();


    supports(port: ScanPort): boolean {

        return (
            port.service === "http" ||
            port.service === "https"
        );

    }


    private normalizeHeaders(
        headers: Record<string, unknown>
    ): Record<string, string> {

        const result: Record<string, string> = {};

        for (const [key, value] of Object.entries(headers)) {

            if (value === undefined || value === null) {
                continue;
            }

            result[key.toLowerCase()] =
                Array.isArray(value)
                    ? value.join(", ")
                    : String(value);
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

                    validateStatus:
                        () => true,

                    maxRedirects: 0,

                    responseType: "text",
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


        const description =
            $('meta[name="description"]')
                .attr("content")
                ?.trim();


        const language =
            $("html")
                .attr("lang")
                ?.trim();


        const headers =
            this.normalizeHeaders(
                Object.fromEntries(
                    Object.entries(
                        response.headers
                    )
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


        const contentType =
            headers["content-type"];


        const contentLengthHeader =
            headers["content-length"];


        const contentLength =
            contentLengthHeader
                ? Number(contentLengthHeader)
                : undefined;


        const securityHeaders = {

            hsts:
                headers[
                    "strict-transport-security"
                ] !== undefined,

            csp:
                headers[
                    "content-security-policy"
                ] !== undefined,

            xFrameOptions:
                headers[
                    "x-frame-options"
                ] !== undefined,

            xContentTypeOptions:
                headers[
                    "x-content-type-options"
                ] !== undefined,

            referrerPolicy:
                headers[
                    "referrer-policy"
                ] !== undefined,

            permissionsPolicy:
                headers[
                    "permissions-policy"
                ] !== undefined,

        };


        const page = {

            forms:
                $("form").length,

            links:
                $("a").length,

            scripts:
                $("script").length,

            images:
                $("img").length,

        };


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

                ...(description
                    ? { description }
                    : {}),

                ...(language
                    ? { language }
                    : {}),

                ...(server
                    ? { server }
                    : {}),

                ...(poweredBy
                    ? { poweredBy }
                    : {}),

                ...(contentType
                    ? { contentType }
                    : {}),

                ...(contentLength !== undefined &&
                    !Number.isNaN(contentLength)
                    ? { contentLength }
                    : {}),

                headers,

                technologies,

                securityHeaders,

                page,

                body:
                    html.slice(
                        0,
                        5000
                    ),

            },

        };

    }

}