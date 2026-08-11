import net from "node:net";

import type {
    Inspector,
    InspectionResult
} from "./inspector.interface.js";

import type {
    ScanPort
} from "../types/scan.types.js";

import type { MongoDbInspection } from "../inspection/types.js";

export class MongoDbInspector
    implements Inspector {

    supports(port: ScanPort): boolean {

        return (
            port.service === "mongodb" &&
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
                    "data",
                    buffer => {

                    const data =
                        this.parseHandshake(
                            Buffer.isBuffer(buffer)
                                ? buffer
                                : Buffer.from(buffer)
                        );

                        finish({
                            port: port.port,
                            service: "mongodb",
                            type: "mongodb",
                            title: "MongoDb",
                            data
                        });
                    }
                );

                socket.on(
                    "timeout",
                    () => {

                        socket.destroy();

                        if (!finished) {
                            reject(
                                new Error(
                                    "MongoDb inspection timeout"
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

    private parseHandshake(
        buffer: Buffer
    ): MongoDbInspection {

        if (buffer.length < 5) {
            return {};
        }

        const payloadLength =
            buffer.readUIntLE(
                0,
                3
            );

        const payloadStart = 4;

        const payloadEnd =
            Math.min(
                payloadStart +
                    payloadLength,
                buffer.length
            );

        const payload =
            buffer.subarray(
                payloadStart,
                payloadEnd
            );

        if (payload.length < 2) {
            return {};
        }

        const protocolByte = payload[0];

        const protocol =
            protocolByte === 0x80
                ? "binary"
                : protocolByte === 0x00
                    ? "text"
                    : "unknown";

        const versionEnd =
            payload.indexOf(
                0,
                1
            );

        if (versionEnd === -1) {
            return {
                protocol
            };
        }

        const version =
            payload
                .subarray(
                    1,
                    versionEnd
                )
                .toString("utf8");

        return {
            protocol,
            version
        };
    }
}