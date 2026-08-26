import net from "node:net";

import type {
    Inspector
} from "./inspector.interface.js";

import type {
    InspectionResult
} from "./inspector-result.types.js"

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
                type: "smtp",
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