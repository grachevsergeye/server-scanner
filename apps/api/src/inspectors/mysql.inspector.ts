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
    MysqlInspection
} from "../inspection/types.js";

export class MysqlInspector
    implements Inspector {

    supports(
        port: ScanPort
    ): boolean {

        return (
            port.service === "mysql" &&
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
                            service: "mysql",
                            type: "mysql",
                            title: "MySQL",
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
                                    "MySQL inspection timeout"
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
    ): MysqlInspection {

        if (buffer.length < 5) {
            return {};
        }

        const payloadLength =
            buffer.readUIntLE(0, 3);

        const sequenceId =
            buffer[3];

        const payloadStart = 4;

        const payloadEnd =
            Math.min(
                payloadStart + payloadLength,
                buffer.length
            );

        const payload =
            buffer.subarray(
                payloadStart,
                payloadEnd
            );

        if (payload.length === 0) {
            return {};
        }

        const packetType =
            payload[0];

        if (packetType === 0xff) {

            const result: MysqlInspection = {
                protocol: "mysql-error"
            };

            if (payload.length >= 3) {
                result.errorCode =
                    payload.readUInt16LE(1);
            }

            return result;
        }

        if (packetType === 0x0a) {

            const versionEnd =
                payload.indexOf(0, 1);

            if (versionEnd === -1) {

                return {
                    protocol: "mysql-10"
                };

            }

            const version =
                payload
                    .subarray(1, versionEnd)
                    .toString("utf8");

            return {
                protocol: "mysql-10",
                version
            };
        }

        return {
            protocol: `mysql-${packetType}`
        };
    }
}