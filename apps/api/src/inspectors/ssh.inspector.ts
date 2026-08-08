import { Client } from "ssh2";

import type {
    Inspector,
    InspectionResult
} from "./inspector.interface.js";

import type { ScanPort } from "../types/scan.types.js";

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

            client.on("banner", banner => {

                resolve({

                    port: port.port,

                    service: port.service,

                    title: "SSH",

                    data: {

                        banner

                    }

                });

                client.end();

            });

            client.on("error", reject);

            client.connect({

                host,

                port: port.port,

                username: "anonymous"

            });

        });

    }

}