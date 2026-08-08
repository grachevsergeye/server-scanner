import { spawn } from "node:child_process";
import { env } from "../config/env.js";

export class ScanWorker {
    async run(ip: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const process = spawn(
                env.NMAP_PATH,
                [
                    "-Pn",
                    "-sV",
                    "-oX",
                    "-",
                    ip,
                ]
            );

            const child = spawn(env.NMAP_PATH, [
                "-Pn",
                "-sV",
                "-oX",
                "-",
                ip,
            ]);

            child.on("error", (err) => {
                reject(err);
            });

            let output = "";
            let error = "";

            process.stdout.on("data", (data) => {
                output += data.toString();
            });

            process.stderr.on("data", (data) => {
                error += data.toString();
            });

            process.on("close", (code) => {
                if (code !== 0) {
                    reject(new Error(error));
                    return;
                }

                resolve(output);
            });
        });
    }
}