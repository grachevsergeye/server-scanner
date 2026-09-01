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
    PostgreSqlInspection
} from "../inspection/types.js";

export class PostgreSqlInspector
    implements Inspector {

    supports(
        port: ScanPort
    ): boolean {

        return (
            port.service === "postgresql" &&
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

                        const startup =
                            this.createStartupMessage();

                        socket.write(
                            startup
                        );
                    }
                );

                socket.on(
                    "data",
                    buffer => {

                        const data =
                            this.parseResponse(
                                Buffer.isBuffer(buffer)
                                    ? buffer
                                    : Buffer.from(buffer)
                            );

                        finish({
                            port: port.port,
                            service: "postgresql",
                            type: "postgresql",
                            title: "PostgreSQL",
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
                                    "PostgreSQL inspection timeout"
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

    private createStartupMessage(): Buffer {

        const body =
            Buffer.from(
                "user\0scanner\0database\0postgres\0\0",
                "utf8"
            );

        const length =
            4 +
            body.length;

        const packet =
            Buffer.alloc(
                4 + length
            );

        packet.writeUInt32BE(
            length,
            0
        );

        packet.writeUInt32BE(
            196608,
            4
        );

        body.copy(
            packet,
            8
        );

        return packet;
    }

    private parseResponse(
        buffer: Buffer
    ): PostgreSqlInspection {

        if (buffer.length < 5) {
            return {
                protocolVersion: "3.0"
            };
        }

        const messageType =
            String.fromCharCode(
                buffer[0]
            );

        const messageLength =
            buffer.readUInt32BE(
                1
            );

        if (
            messageType === "R" &&
            buffer.length >= 9
        ) {

            const authType =
                buffer.readUInt32BE(
                    5
                );

            return {

                protocolVersion: "3.0",

                authentication: {
                    required: true,
                    mechanism:
                        this.authenticationMechanism(
                            authType
                        )
                }
            };
        }

        if (
            messageType === "E"
        ) {

            return {

                protocolVersion: "3.0",

                authentication: {
                    required: true
                },

                banner:
                    "PostgreSQL ErrorResponse"
            };
        }

        /*
         * ParameterStatus
         */
        if (
            messageType === "S"
        ) {

            return {
                protocolVersion: "3.0"
            };
        }

        return {
            protocolVersion: "3.0"
        };
    }

    private authenticationMechanism(
        type: number
    ): string {

        switch (type) {

            case 0:
                return "ok";

            case 2:
                return "cleartext";

            case 3:
                return "md5";

            case 5:
                return "gss";

            case 6:
                return "sspi";

            case 7:
                return "sasl";

            default:
                return `unknown-${type}`;
        }
    }
}