import { spawn } from "node:child_process";
import { XMLParser } from "fast-xml-parser";

import { env } from "../config/env.js";

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
    hosts: string[];
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
        new XMLParser({
            ignoreAttributes: false,
            attributeNamePrefix: "",
        });

    private asArray<T>(
        value: T | T[] | undefined
    ): T[] {

        if (value === undefined) {
            return [];
        }

        return Array.isArray(value)
            ? value
            : [value];
    }

    private runNmap(
        args: string[],
        timeoutMs: number,
    ): Promise<NmapCommandResult> {

        return new Promise((resolve, reject) => {

            const start = performance.now();

            let stdout = "";
            let stderr = "";

            let settled = false;
            let timedOut = false;

            const child = spawn(
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

                const durationMs = Math.round(
                    performance.now() - start
                );

                resolve({
                    stdout,
                    stderr,
                    exitCode,
                    durationMs,
                    timedOut,
                });
            };

            const timer = setTimeout(() => {

                if (settled) {
                    return;
                }

                timedOut = true;

                stderr +=
                    `Nmap hard timeout after ${timeoutMs}ms`;

                child.kill();

            }, timeoutMs);

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

    private parseDiscoveredHosts(
        xml: string,
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
                (
                    host: unknown
                ): host is string =>
                    typeof host === "string"
            );
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
                    ? this.parseDiscoveredHosts(
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
    ): Promise<NmapScanResult> {

        const result =
            await this.runNmap(
                [
                    "-Pn",

                    "-sV",

                    "--version-intensity",
                    "5",

                    "--host-timeout",
                    "15s",

                    "--max-retries",
                    "3",

                    "-p",
                    "22,23,80,443,135,139,445,3306,5432,6379,11211",

                    "-oX",
                    "-",

                    host,
                ],
                scannerTimeouts.nmap,
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