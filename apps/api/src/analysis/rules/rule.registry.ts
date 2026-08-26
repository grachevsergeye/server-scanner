import type {
    SecurityRule
} from './security-rule.interface.js'

import { ExposedTelnetRule } from "./exposed-telnet.rule.js";
import { ExposedRedisRule } from "./exposed-redis.rule.js";
import { ExposedMemcachedRule } from "./exposed-memcached.rule.js";
import { ExposedMysqlRule } from "./exposed-mysql.rule.js";
import { ExposedPostgresqlRule } from "./exposed-postgresql.rule.js";
import { WeakTlsRule } from "./weak-tls.rule.js";
import { MissingSecurityHeadersRule } from "./missing-security-headers.rule.js";
import { OutdatedSoftwareRule } from "./outdated-software.rule.js";

export const securityRules: SecurityRule[] = [
    new ExposedTelnetRule(),

    new ExposedRedisRule(),

    new ExposedMemcachedRule(),

    new ExposedMysqlRule(),

    new ExposedPostgresqlRule(),

    new WeakTlsRule(),

    new MissingSecurityHeadersRule(),

    new OutdatedSoftwareRule(),
];