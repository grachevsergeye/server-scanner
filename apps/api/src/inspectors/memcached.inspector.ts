import net from "node:net";

import type {
    Inspector,
    InspectionResult
} from "./inspector.interface.js";

import type {
    ScanPort
} from "../types/scan.types.js";

import type {
    MemcachedInspection
} from "../inspection/types.js";

export class MemcachedInspector
    implements Inspector {

    supports(
        port: ScanPort
    ): boolean {

        return (
            port.service === "memcached" &&
            port.state === "open"
        );
    }

    inspect(
        host: string,
        port: ScanPort
    ): Promise<InspectionResult> {

        return new Promise(
            (resolve, reject) => {

                const socket =
                    net.createConnection({
                        host,
                        port: port.port
                    });

                let finished = false;

                const finish = (
                    result: InspectionResult
                ) => {

                    if (finished) {
                        return;
                    }

                    finished = true;

                    socket.destroy();

                    resolve(result);
                };

                socket.setTimeout(5000);

                socket.on(
                    "connect",
                    () => {

                        socket.write(
                            "version\r\n"
                        );
                    }
                );

                let data =
                    Buffer.alloc(0);

                socket.on(
                    "data",
                    chunk => {

                        data =
                            Buffer.concat([
                                data,
                                Buffer.isBuffer(chunk)
                                    ? chunk
                                    : Buffer.from(chunk)
                            ]);

                        const text =
                            data.toString("utf8");

                        if (
                            text.startsWith(
                                "VERSION "
                            )
                        ) {

                            const inspection =
                                this.parseResponse(
                                    text
                                );

                            finish({
                                port: port.port,
                                service: "memcached",
                                type: "memcached",
                                title: "Memcached",
                                data: inspection
                            });
                        }

                        if (
                            text.includes(
                                "ERROR"
                            ) ||
                            text.includes(
                                "CLIENT_ERROR"
                            )
                        ) {

                            finish({
                                port: port.port,
                                service: "memcached",
                                type: "memcached",
                                title: "Memcached",
                                data: {
                                    protocolType:
                                        "text"
                                }
                            });
                        }
                    }
                );

                socket.on(
                    "timeout",
                    () => {

                        socket.destroy();

                        if (!finished) {
                            reject(
                                new Error(
                                    "Memcached inspection timeout"
                                )
                            );
                        }
                    }
                );

                socket.on(
                    "error",
                    error => {

                        if (!finished) {
                            reject(error);
                        }
                    }
                );
            }
        );
    }

    private parseResponse(
        text: string
    ): MemcachedInspection {

        const match =
            text.match(
                /^VERSION\s+([^\r\n]+)/i
            );

        return {

            protocolType:
                "text",

            ...(match
                ? {
                    version:
                        match[1]
                }
                : {})
        };
    }
}