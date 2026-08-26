import { Client } from "ssh2";

import type {
    Inspector
} from "./inspector.interface.js";

import type {
    InspectionResult
} from "./inspector-result.types.js"

import type {
    ScanPort
} from "../types/scan.types.js";

import { scannerTimeouts } from "../config/scanner.config.js";

export class SshInspector implements Inspector {

    supports(port: ScanPort): boolean {

        return port.service === "ssh";

    }

    private parseBanner(
        banner: string
    ) {
        const match =
            banner.match(
                /^SSH-(\d+\.\d+)-(.+)$/
            );

        if (!match) {
            return {
                raw: banner,
            };
        }

        return {
            protocol: match[1],
            software: match[2],
            raw: banner,
        };
    }

    inspect(
        host: string,
        port: ScanPort
    ): Promise<InspectionResult> {

        return new Promise((resolve, reject) => {

            const client = new Client();

            let resolved = false;

            const finish = (
                result: InspectionResult
            ) => {

                if (resolved) {
                    return;
                }

                resolved = true;

                client.end();

                resolve(result);
            };

            client.on("banner", banner => {

                const raw =
                    banner.toString().trim();

                const parsed =
                    this.parseBanner(raw);

                finish({
                    port: port.port,
                    service: port.service,
                    type: "ssh",
                    title: "SSH",
                    data: {
                        banner: raw,
                        ...parsed,
                    },
                });

            });

            client.on("ready", () => {

                client.end();

            });

            client.on("error", error => {

                if (resolved) {
                    return;
                }

                const message =
                    error instanceof Error
                        ? error.message
                        : String(error);

                if (
                    message
                        .toLowerCase()
                        .includes(
                            "authentication methods failed"
                        )
                ) {

                    resolved = true;

                    client.end();

                    resolve({
                        port: port.port,
                        service: port.service,
                        type: "ssh",
                        title: "SSH",
                        data: {
                            authentication: "required",
                        },
                    });

                    return;
                }

                reject(error);
            });

            const timer = setTimeout(() => {

                if (resolved) {
                    return;
                }

                resolved = true;

                client.end();

                const error =
                    Object.assign(
                        new Error(
                            `SSH inspection timed out after ${scannerTimeouts.ssh}ms`
                        ),
                        {
                            code: "ETIMEDOUT",
                        }
                    );

                reject(error);

            }, scannerTimeouts.ssh);

            client.connect({

                host,

                port: port.port,

                username: "scanner",

                readyTimeout:
                    scannerTimeouts.ssh,

            });

        });

    }
}