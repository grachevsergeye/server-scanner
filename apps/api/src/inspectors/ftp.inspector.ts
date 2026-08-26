import { Client } from "basic-ftp";

import type {
    Inspector
} from "./inspector.interface.js";

import type {
    InspectionResult
} from "./inspector-result.types.js"

import type { ScanPort } from "../types/scan.types.js";

export class FtpInspector implements Inspector {

    supports(port: ScanPort): boolean {

        return port.service === "ftp";

    }

    async inspect(
        host: string,
        port: ScanPort
    ): Promise<InspectionResult> {

        const client = new Client();

        try {

            await client.access({

                host,

                port: port.port,

                user: "anonymous",

                password: "anonymous"
            });

            const currentDirectory =
                await client.pwd();

            const list =
                await client.list();

            const features =
                await client.features();

            return {

                port: port.port,

                service: port.service,

                title: "FTP",

                type: "ftp",

                data: {

                    currentDirectory,

                    files:
                        list.slice(0, 10),

                    features:
                        Object.fromEntries(features),

                    anonymousAccess: true
                }

            };

        } catch (error) {

            return {

                port: port.port,

                service: port.service,

                title: "FTP",

                type: "ftp",

                data: {

                    anonymousAccess: false
                }

            };

        } finally {

            client.close();

        }

    }
}