import net from "node:net";

import type {
    Inspector,
    InspectionResult
} from "./inspector.interface.js";

import type { ScanPort } from "../types/scan.types.js";

export class SmtpInspector implements Inspector {

    supports(port: ScanPort) {

        return port.service === "smtp";

    }

    inspect(host: string, port: ScanPort): Promise<InspectionResult> {

        return new Promise((resolve, reject) => {

            const socket = net.createConnection({

                host,

                port: port.port

            });

            socket.setTimeout(5000);

            socket.once("data", data => {

                resolve({

                    port: port.port,

                    service: port.service,

                    title: "SMTP",

                    data: {

                        banner: data.toString()

                    }

                });

                socket.end();

            });

            socket.on("timeout", () => {

                socket.destroy();

                reject(new Error("SMTP timeout"));

            });

            socket.on("error", reject);

        });

    }

}