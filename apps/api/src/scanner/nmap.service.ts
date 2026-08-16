import { spawn } from "node:child_process";
import { XMLParser } from "fast-xml-parser";

import { env }
    from "../config/env.js";

export interface NmapScanResult {
    host: string;

    stdout: string;

    stderr: string;

    exitCode: number;
}

export interface NmapHostDiscoveryResult {

    hosts: string[];

    stdout: string;

    stderr: string;

    exitCode: number;
}

export class NmapService {

    private parser =
        new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
        });

    private parseDiscoveredHosts(
        xml: string
    ): string[] {

        const data =
            this.parser.parse(xml);

        const rawHosts =
            data.nmaprun?.host ?? [];

        const hosts =
            Array.isArray(rawHosts)
                ? rawHosts
                : [rawHosts];

        return hosts
            .filter(
                (host: any) =>
                    host.status?.state === "up"
            )
            .map(
                (host: any) =>
                    host.address?.addr
            )
            .filter(
                (host: unknown): host is string =>
                    typeof host === "string"
            );
    }

    async discoverHosts(
        target: string
    ): Promise<NmapHostDiscoveryResult> {

        return new Promise(
            (resolve, reject) => {

                const child =
                    spawn(
                        env.NMAP_PATH,
                        [
                            "-sn",
                            "-oX",
                            "-",
                            target,
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
                        stdout += data.toString();
                    }
                );

                child.stderr.on(
                    "data",
                    data => {
                        stderr += data.toString();
                    }
                );

                child.on(
                    "error",
                    reject
                );

                child.on(
                    "close",
                    exitCode => {

                        if (exitCode !== 0) {
                            resolve({
                                hosts: [],
                                stdout,
                                stderr,
                                exitCode:
                                    exitCode ?? -1,
                            });

                            return;
                        }

                        resolve({
                            hosts:
                                this.parseDiscoveredHosts(
                                    stdout
                                ),

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