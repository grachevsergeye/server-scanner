import { HttpInspector } from "./http.inspector.js";
import { TlsInspector } from "./tls.inspector.js";
import { SshInspector } from "./ssh.inspector.js";
import { FtpInspector } from "./ftp.inspector.js";
import { SmtpInspector } from "./smtp.inspector.js";
import { FaviconInspector } from "./favicon.inspector.js";
import { RobotsInspector } from "./robots.inspector.js";
import { RedirectInspector } from "./redirect.inspector.js";

import {
    MysqlInspector
} from "./mysql.inspector.js";

import {
    PostgreSqlInspector
} from "./postgresql.inspector.js";

import {
    MongoDbInspector
} from "./mongodb.inspector.js";

import {
    RedisInspector
} from "./redis.inspector.js";

import {
    MemcachedInspector
} from "./memcached.inspector.js";

import {
    TelnetInspector
} from "./telnet.inspector.js"

export class InspectorRegistry {

    all = [

        new HttpInspector(),

        new TlsInspector(),

        new FaviconInspector(),

        new RobotsInspector(),

        new RedirectInspector(),

        new SshInspector(),

        new FtpInspector(),

        new SmtpInspector(),

        new RedisInspector(),

        new MysqlInspector(),

        new PostgreSqlInspector(),

        new MongoDbInspector(),

        new MemcachedInspector(),

        new TelnetInspector(),

    ];

}