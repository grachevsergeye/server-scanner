import { spawn } from "node:child_process";
import { env } from "../config/env.js";

export class ScanWorker {

    async run(ip: string): Promise<string> {

        return new Promise((resolve, reject) => {

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
                        ip
                    ]
                );

            let output = "";
            let error = "";

            child.stdout.on(
                "data",
                data => {
                    output += data.toString();
                }
            );

            child.stderr.on(
                "data",
                data => {
                    error += data.toString();
                }
            );

            child.on(
                "error",
                err => {
                    reject(err);
                }
            );

            child.on(
                "close",
                code => {

                    if (code !== 0) {
                        reject(
                            new Error(
                                error ||
                                `Nmap exited with code ${code}`
                            )
                        );

                        return;
                    }

                    resolve(output);
                }
            );

        });

    }

}