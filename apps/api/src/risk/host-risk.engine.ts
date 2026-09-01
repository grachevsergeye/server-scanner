import type { PortAnalysis } from "../analysis/types.js";
import type {
    HostRiskResult,
    RiskFinding,
    RiskLevel
} from "./types.js";

import {
    RISK_DEFINITIONS,
    type RiskCode
} from "./definitions.js";


export class HostRiskEngine {

    analyze(
        ports: PortAnalysis[]
    ): HostRiskResult {

        const findings =
            this.buildFindings(ports);

        const severity =
            this.countSeverities(findings);

        const score =
            this.calculateScore(findings);

        const level =
            this.levelFromScore(score);

        return {

            level,

            score,

            findings,

            totalPorts:
                ports.length,

            critical:
                severity.critical,

            high:
                severity.high,

            medium:
                severity.medium,

            low:
                severity.low,

            info:
                severity.info
        };
    }

    private countSeverities(
        findings: RiskFinding[]
    ): {
        critical: number;
        high: number;
        medium: number;
        low: number;
        info: number;
    } {

        let critical = 0;
        let high = 0;
        let medium = 0;
        let low = 0;
        let info = 0;

        for (const finding of findings) {

            switch (finding.level) {

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

        return {
            critical,
            high,
            medium,
            low,
            info
        };
    }

    private buildFindings(
        ports: PortAnalysis[]
    ): RiskFinding[] {

        const groups =
            new Map<RiskCode, PortAnalysis[]>();

        for (const analysis of ports) {

            const code =
                analysis.risk.code;

            const group =
                groups.get(code);

            if (group) {

                group.push(analysis);

            } else {

                groups.set(
                    code,
                    [analysis]
                );
            }
        }

        return Array.from(
            groups.entries()
        ).map(
            ([code, groupedPorts]) => {

                const definition =
                    RISK_DEFINITIONS[code];

                const confidence =
                    Math.round(
                        groupedPorts.reduce(
                            (sum, analysis) =>
                                sum +
                                analysis.risk.confidence,
                            0
                        ) /
                        groupedPorts.length
                    );

                return {

                    level:
                        definition.level,

                    code,

                    title:
                        definition.title,

                    reason:
                        definition.reason,

                    confidence,

                    ports:
                        groupedPorts.map(
                            analysis =>
                                analysis.port.port
                        ),

                    count:
                        groupedPorts.length
                };
            }
        );
    }

    private calculateScore(
        findings: RiskFinding[]
    ): number {

        const score =
            findings.reduce(
                (total, finding) =>
                    total +
                    RISK_DEFINITIONS[finding.code].score,
                0
            );

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