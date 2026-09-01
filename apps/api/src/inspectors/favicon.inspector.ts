import axios from "axios";
import crypto from "node:crypto";

import type {
    Inspector
} from "./inspector.interface.js";

import type {
    InspectionResult
} from "./inspector-result.types.js"

import type { ScanPort } from "../types/scan.types.js";

export class FaviconInspector implements Inspector {

    supports(port: ScanPort): boolean {

        return port.service === "http"
            || port.service === "https";

    }

    async inspect(
        host: string,
        port: ScanPort
    ): Promise<InspectionResult> {

    const protocol =
        port.service === "https" ||
        port.tunnel === "ssl"
            ? "https"
            : "http";

        const url =
            `${protocol}://${host}:${port.port}/favicon.ico`;

        const response = await axios.get(
            url,
            {
                timeout: 5000,

                responseType: "arraybuffer",

                validateStatus: () => true
            }
        );

        const exists =
            response.status === 200 &&
            response.data instanceof Buffer;

        if (!exists) {

            return {

                port: port.port,

                service: port.service,

                type: "favicon",

                title: "Favicon",

                data: {

                    url,

                    status: response.status,

                    exists: false

                }

            };

        }

        const buffer =
            Buffer.from(response.data);

        const md5 =
            crypto
                .createHash("md5")
                .update(buffer)
                .digest("hex");

        const sha256 =
            crypto
                .createHash("sha256")
                .update(buffer)
                .digest("hex");

        return {

            port: port.port,

            service: port.service,

            type: "favicon",

            title: "Favicon",

            data: {

                url,

                status: response.status,

                exists: true,

                size: buffer.length,

                md5,

                sha256

            }

        };

    }

}