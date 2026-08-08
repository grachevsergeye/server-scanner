import net from "node:net";

import type { Inspector, InspectionResult } from "./inspector.interface.js";
import type { ScanPort } from "../types/scan.types.js";

export class RedisInspector implements Inspector {

    supports(port: ScanPort): boolean {

        return port.service === "redis";

    }

    inspect(
        host: string,
        port: ScanPort
    ): Promise<InspectionResult> {

        return new Promise((resolve, reject) => {

            const socket = net.createConnection({

                host,
                port: port.port

            });

            socket.setTimeout(5000);

            socket.write("INFO\r\n");

            let data = "";

            socket.on("data", chunk => {

                data += chunk.toString();

            });

            socket.on("end", () => {

                resolve({

                    port: port.port,

                    service: port.service,

                    title: "Redis",

                    data: {

                        info: data

                    }

                });

            });

            socket.on("timeout", () => {

                socket.destroy();

                reject(new Error("Redis timeout"));

            });

            socket.on("error", reject);

        });

    }

}