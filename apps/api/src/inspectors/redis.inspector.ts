import net from "node:net";

import type {
    Inspector
} from "./inspector.interface.js";

import type {
    InspectionResult
} from "./inspector-result.types.js"

import type {
    ScanPort
} from "../types/scan.types.js";

import type {
    RedisInspection
} from "../inspection/types.js";

export class RedisInspector
    implements Inspector {

    supports(
        port: ScanPort
    ): boolean {

        return (
            port.service === "redis" &&
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
                        port: port.port,
                        timeout: 5000
                    });

                let finished = false;

                let data =
                    Buffer.alloc(0);

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

                socket.on(
                    "connect",
                    () => {

                        socket.write(
                            "INFO\r\n"
                        );
                    }
                );

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

                        finish({
                            port: port.port,
                            service: "redis",
                            type: "redis",
                            title: "Redis",
                            data: this.parseResponse(data)
                        });
                    }
                );

                socket.on(
                    "timeout",
                    () => {

                        if (finished) {
                            return;
                        }

                        socket.destroy();

                        reject(
                            new Error(
                                "Redis inspection timeout"
                            )
                        );
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
        buffer: Buffer
    ): RedisInspection {

        const response =
            buffer.toString("utf8");

        const versionMatch =
            response.match(
                /redis_version:([^\r\n]+)/i
            );

        return {
            info:
                response,

            ...(versionMatch
                ? {
                    version:
                        versionMatch[1]
                }
                : {})
        };
    }
}