import type { PortAnalysis } from "../analysis/types.js";
import type { HostRiskResult, RiskLevel } from "./types.js";

export class HostRiskEngine {

    analyze(
        ports: PortAnalysis[]
    ): HostRiskResult {

        let critical = 0;
        let high = 0;
        let medium = 0;
        let low = 0;
        let info = 0;

        for (const port of ports) {

            switch (port.risk.level) {

                case "Critical":
                    critical++;
                    break;

                case "High":
                    high++;
                    break;

                case "Medium":
                    medium++;
                    break;

                case "Low":
                    low++;
                    break;

                case "Info":
                    info++;
                    break;
            }
        }

        const score =
            this.calculateScore({
                critical,
                high,
                medium,
                low,
                info
            });

        const level =
            this.levelFromScore(score);

        return {
            level,
            score,
            totalPorts: ports.length,
            critical,
            high,
            medium,
            low,
            info
        };
    }

    private calculateScore({
        critical,
        high,
        medium,
        low
    }: {
        critical: number;
        high: number;
        medium: number;
        low: number;
        info: number;
    }): number {

        const score =
            critical * 40 +
            high * 25 +
            medium * 10 +
            low * 3;

        return Math.min(
            score,
            100
        );
    }

    private levelFromScore(
        score: number
    ): RiskLevel {

        if (score >= 75) {
            return "Critical";
        }

        if (score >= 50) {
            return "High";
        }

        if (score >= 25) {
            return "Medium";
        }

        if (score > 0) {
            return "Low";
        }

        return "Info";
    }
}