import { Client } from "ssh2";

import type {
    Inspector,
    InspectionResult
} from "./inspector.interface.js";

import type {
    ScanPort
} from "../types/scan.types.js";

export class SshInspector implements Inspector {

    supports(port: ScanPort): boolean {

        return port.service === "ssh";

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

                finish({
                    port: port.port,

                    service: port.service,

                    type: "ssh",

                    title: "SSH",

                    data: {
                        banner: banner.toString()
                    }
                });

            });

            client.on("ready", () => {

                client.end();

            });

            client.on("error", error => {

                if (
                    resolved
                ) {
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

                    client.end();

                    resolve({
                        port: port.port,

                        service: port.service,

                        type: "ssh",

                        title: "SSH",

                        data: {}
                    });

                    return;
                }

                reject(error);

            });

            client.connect({

                host,

                port: port.port,

                username: "anonymous",

                readyTimeout: 5000

            });

        });

    }
}