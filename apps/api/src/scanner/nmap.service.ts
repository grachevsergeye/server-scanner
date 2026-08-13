import { spawn } from "node:child_process";

import { env }
    from "../config/env.js";

export interface NmapScanResult {
    host: string;

    stdout: string;

    stderr: string;

    exitCode: number;
}

export class NmapService {

    async scan(
        host: string
    ): Promise<NmapScanResult> {

        return new Promise(
            (resolve, reject) => {

                const child =
                    spawn(
                        env.NMAP_PATH,
                        [
                            "-Pn",

                            "-sV",

                            "-p",
                            "22,23,80,443,135,139,445,3306,5432,6379,11211",

                            "-oX",
                            "-",

                            host,
                        ],
                        {
                            windowsHide: true,
                        }
                    );

                let stdout = "";
                let stderr = "";

                child.stdout.on(
                    "data",
                    data => {
                        stdout +=
                            data.toString();
                    }
                );

                child.stderr.on(
                    "data",
                    data => {
                        stderr +=
                            data.toString();
                    }
                );

                child.on(
                    "error",
                    error => {
                        reject(error);
                    }
                );

                child.on(
                    "close",
                    exitCode => {

                        resolve({
                            host,

                            stdout,

                            stderr,

                            exitCode:
                                exitCode ?? -1,
                        });
                    }
                );
            }
        );
    }
}