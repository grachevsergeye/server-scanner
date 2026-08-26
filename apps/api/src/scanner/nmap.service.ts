import { spawn } from "node:child_process";

import { scanProfiles } from "../config/scanner.profiles.js";

import { env } from "../config/env.js";
import type { DiscoveredHost } from "../types/scan.types.js";

import { NmapParser } from "../parsers/nmap.parser.js";

import {
    scannerTimeouts,
} from "../config/scanner.config.js";

export interface NmapCommandResult {
    stdout: string;
    stderr: string;
    exitCode: number;
    durationMs: number;
    timedOut: boolean;
}

export interface NmapScanResult {
    host: string;

    stdout: string;
    stderr: string;

    exitCode: number;
    durationMs: number;
    timedOut: boolean;
}

export interface NmapHostDiscoveryResult {

    hosts: DiscoveredHost[];

    stdout: string;
    stderr: string;

    exitCode: number;
    durationMs: number;
    timedOut: boolean;
}

export class NmapTimeoutError extends Error {

    readonly code = "NMAP_TIMEOUT";

    constructor(
        public readonly timeoutMs: number,
    ) {
        super(
            `Nmap scan timed out after ${timeoutMs}ms`
        );

        this.name = "NmapTimeoutError";
    }
}

export class NmapService {

    private readonly parser =
        new NmapParser();

    private runNmap(
        args: string[],
        timeoutMs: number,
    ): Promise<NmapCommandResult> {

        return new Promise((resolve, reject) => {

            const start =
                performance.now();

            let stdout = "";
            let stderr = "";

            let settled = false;
            let timedOut = false;

            const child =
                spawn(
                    env.NMAP_PATH,
                    args,
                    {
                        windowsHide: true,

                        stdio: [
                            "ignore",
                            "pipe",
                            "pipe",
                        ],
                    }
                );

            const finish = (
                exitCode: number
            ) => {

                if (settled) {
                    return;
                }

                settled = true;

                clearTimeout(timer);

                resolve({
                    stdout,
                    stderr,
                    exitCode,
                    durationMs: Math.round(
                        performance.now() -
                        start
                    ),
                    timedOut,
                });
            };

            const timer =
                setTimeout(() => {

                    if (settled) {
                        return;
                    }

                    timedOut = true;

                    stderr +=
                        `Nmap hard timeout after ${timeoutMs}ms\n`;

                    child.kill();

                }, timeoutMs);

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

            child.once(
                "error",
                error => {

                    if (settled) {
                        return;
                    }

                    settled = true;

                    clearTimeout(timer);

                    reject(error);
                }
            );

            child.once(
                "close",
                exitCode => {

                    finish(
                        exitCode ?? -1
                    );
                }
            );
        });
    }

    async discoverHosts(
        target: string,
    ): Promise<NmapHostDiscoveryResult> {

        const result =
            await this.runNmap(
                [
                    "-sn",
                    "-oX",
                    "-",
                    target,
                ],
                scannerTimeouts.nmap,
            );

        if (result.timedOut) {
            throw new NmapTimeoutError(
                scannerTimeouts.nmap
            );
        }

        return {
            hosts:
                result.exitCode === 0
                    ? this.parser.parseDiscoveredHosts(
                        result.stdout
                    )
                    : [],

            stdout:
                result.stdout,

            stderr:
                result.stderr,

            exitCode:
                result.exitCode,

            durationMs:
                result.durationMs,

            timedOut:
                result.timedOut,
        };
    }

    async scan(
        host: string,
        profile: keyof typeof scanProfiles = "standard",
    ): Promise<NmapScanResult> {

        const config = scanProfiles[profile];

        const portList =
            config.ports.join(",");

        const args = [
            "-Pn",

            "-sV",

            "--version-intensity",
            String(config.versionIntensity),

            "--host-timeout",
            "15s",

            "--max-retries",
            "3",

            "-p",
            portList,

            "-oX",
            "-",

            host,
        ];

        console.log(
            "[NmapService] command:",
            env.NMAP_PATH,
            args.join(" ")
        );

        const result =
            await this.runNmap(
                args,
                scannerTimeouts.nmap,
            );

        console.log(
            "[NmapService] result:",
            {
                exitCode: result.exitCode,
                timedOut: result.timedOut,
                durationMs: result.durationMs,
                stdoutLength: result.stdout.length,
                stderr: result.stderr,
            }
        );

        if (result.timedOut) {
            throw new NmapTimeoutError(
                scannerTimeouts.nmap
            );
        }

        return {
            host,

            stdout:
                result.stdout,

            stderr:
                result.stderr,

            exitCode:
                result.exitCode,

            durationMs:
                result.durationMs,

            timedOut:
                result.timedOut,
        };
    }
}