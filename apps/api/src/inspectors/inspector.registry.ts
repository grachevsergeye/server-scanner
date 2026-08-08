import { HttpInspector } from "./http.inspector.js";
import { TlsInspector } from "./tls.inspector.js";
import { SshInspector } from "./ssh.inspector.js";
import { RedisInspector } from "./redis.inspector.js";
import { FtpInspector } from "./ftp.inspector.js";
import { SmtpInspector } from "./smtp.inspector.js";
import { FaviconInspector } from "./favicon.inspector.js";
import { RobotsInspector } from "./robots.inspector.js";
import { RedirectInspector } from "./redirect.inspector.js";

export class InspectorRegistry {

    all = [

        new HttpInspector(),

        new TlsInspector(),

        new FaviconInspector(),

        new RobotsInspector(),

        new RedirectInspector(),

        new SshInspector(),

        new RedisInspector(),

        new FtpInspector(),

        new SmtpInspector()

    ];

}