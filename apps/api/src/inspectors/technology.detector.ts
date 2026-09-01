import type { AxiosResponseHeaders } from "axios";

export class TechnologyDetector {

    detect(
        headers: AxiosResponseHeaders | Record<string, unknown>
    ): string[] {

        const technologies = new Set<string>();

        const getHeader = (name: string): string => {

            const value =
                headers[name] ??
                headers[name.toLowerCase()] ??
                headers[name.toUpperCase()];

            return String(value ?? "");

        };

        const server =
            getHeader("server").toLowerCase();

        const poweredBy =
            getHeader("x-powered-by").toLowerCase();

        /*
         * Web servers
         */

        if (server.includes("nginx"))
            technologies.add("NGINX");

        if (server.includes("apache"))
            technologies.add("Apache");

        if (
            server.includes("iis") ||
            server.includes("microsoft")
        )
            technologies.add("Microsoft IIS");

        if (server.includes("cloudflare"))
            technologies.add("Cloudflare");

        if (server.includes("litespeed"))
            technologies.add("LiteSpeed");

        if (server.includes("openresty"))
            technologies.add("OpenResty");

        if (server.includes("caddy"))
            technologies.add("Caddy");

        /*
         * Google
         */

        if (
            server.includes("google") ||
            server.includes("gws") ||
            server.includes("httpserver2")
        )
            technologies.add("Google");

        /*
         * Application frameworks
         */

        if (poweredBy.includes("express"))
            technologies.add("Express");

        if (poweredBy.includes("php"))
            technologies.add("PHP");

        if (
            poweredBy.includes("asp.net") ||
            poweredBy.includes("aspnet")
        )
            technologies.add("ASP.NET");

        /*
         * Security / proxy infrastructure
         */

        if (
            getHeader("cf-ray") ||
            getHeader("cf-cache-status")
        )
            technologies.add("Cloudflare");

        return [...technologies];

    }

}