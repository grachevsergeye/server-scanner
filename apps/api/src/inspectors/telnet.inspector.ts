import net from "node:net";

import type { ScanPort } from "../types/scan.types.js";

import type {
    Inspector
} from "./inspector.interface.js";

import type {
    InspectionResult
} from "./inspector-result.types.js"

import { scannerTimeouts } from "../config/scanner.config.js";

export class TelnetInspector implements Inspector {

    supports(port: ScanPort): boolean {
        return port.service === "telnet";
    }

    async inspect(
        host: string,
        port: ScanPort,
    ): Promise<InspectionResult> {

        return new Promise((resolve, reject) => {

            const socket = new net.Socket();

            let finished = false;

            let banner = "";

            const cleanup = () => {
                socket.removeAllListeners();
                socket.destroy();
            };

            const finish = (
                result: InspectionResult
            ) => {

                if (finished) {
                    return;
                }

                finished = true;

                cleanup();

                resolve(result);
            };

            socket.setTimeout(
                scannerTimeouts.telnet
            );

            socket.connect(
                port.port,
                host,
                () => {
                }
            );

            socket.on(
                "data",
                (data: Buffer) => {

                    if (finished) {
                        return;
                    }

                    banner += data.toString(
                        "utf8"
                    );

                    if (banner.length >= 4096) {

                        finish({
                            port: port.port,

                            service: port.service,

                            type: "telnet",

                            title: "Telnet",

                            data: {
                                banner: banner.slice(
                                    0,
                                    4096
                                ),
                                protocol: "telnet",
                                authentication: "unknown",
                            },
                        });
                    }
                }
            );

            socket.on(
                "timeout",
                () => {

                    if (finished) {
                        return;
                    }

                    finished = true;

                    cleanup();

                    const error = Object.assign(
                        new Error(
                            "Telnet connection timed out"
                        ),
                        {
                            code: "ETIMEDOUT",
                        }
                    );

                    reject(error);
                }
            );

            socket.on(
                "error",
                (error) => {

                    if (finished) {
                        return;
                    }

                    finished = true;

                    cleanup();

                    reject(error);
                }
            );

            socket.on(
                "close",
                () => {

                    if (finished) {
                        return;
                    }

                    finish({
                        port: port.port,

                        service: port.service,

                        type: "telnet",

                        title: "Telnet",

                        data: {
                            ...(banner
                                ? { banner }
                                : {}),

                            protocol: "telnet",

                            authentication: "unknown",
                        },
                    });
                }
            );
        });
    }
}