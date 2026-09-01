import ipaddr from "ipaddr.js";

export function expandTarget(target: string): string[] {
    target = target.trim();

    if (!target.includes("/")) {
        validateIp(target);
        return [target];
    }

    return expandCidr(target);
}

export function expandTargets(targets: string[]): string[] {
    const result: string[] = [];

    for (const target of targets) {
        result.push(...expandTarget(target));
    }

    return [...new Set(result)];
}

function validateIp(ip: string) {
    try {
        ipaddr.parse(ip);
    } catch {
        throw new Error(`Invalid IP address: ${ip}`);
    }
}

function expandCidr(cidr: string): string[] {
    const [address, prefixString] = cidr.split("/");

    if (!address || !prefixString) {
        throw new Error(`Invalid CIDR: ${cidr}`);
    }

    const prefix = Number(prefixString);

    const parsed = ipaddr.parse(address);

    if (parsed.kind() !== "ipv4") {
        throw new Error("Only IPv4 CIDR is currently supported");
    }

    if (!Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
        throw new Error(`Invalid CIDR prefix: ${cidr}`);
    }

    const ip = parsed.toByteArray();

    const hostBits = 32 - prefix;
    const count = 2 ** hostBits;

    const MAX_TARGETS = 4096;

    if (count > MAX_TARGETS) {
        throw new Error(
            `CIDR ${cidr} expands to ${count} targets. Maximum is ${MAX_TARGETS}.`
        );
    }

    const base =
        ((ip[0] << 24) >>> 0) |
        (ip[1] << 16) |
        (ip[2] << 8) |
        ip[3];

    const mask =
        prefix === 0
            ? 0
            : (0xffffffff << hostBits) >>> 0;

    const network = (base & mask) >>> 0;

    const targets: string[] = [];

    for (let i = 0; i < count; i++) {
        const value = (network + i) >>> 0;

        targets.push(
            `${value >>> 24}.${(value >>> 16) & 255}.${(value >>> 8) & 255}.${value & 255}`
        );
    }

    return targets;
}