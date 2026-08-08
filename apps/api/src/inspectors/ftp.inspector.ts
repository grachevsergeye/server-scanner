import { Client } from "basic-ftp";

import type {
    Inspector,
    InspectionResult
} from "./inspector.interface.js";

import type { ScanPort } from "../types/scan.types.js";

export class FtpInspector implements Inspector {

    supports(port: ScanPort) {

        return port.service === "ftp";

    }

    async inspect(host: string, port: ScanPort): Promise<InspectionResult> {

        const client = new Client();

        const pwd = await client.pwd();

        const list = await client.list();

        try {

            await client.access({

                host,

                port: port.port,

                user: "anonymous",

                password: "anonymous"

            });

            const features =
                await client.features();

            return {

                port: port.port,

                service: port.service,

                title: "FTP",

                data: {

                    currentDirectory: pwd,

                    files: list.slice(0, 10),

                    features

                }

            };

        }

        finally {

            client.close();

        }

    }

}