export interface HttpInspection {
    url: string;
    status: number;

    title?: string;
    server?: string;

    poweredBy?: string;

    headers?: Record<string, string>;

    technologies?: string[];

    body?: string;
}

export interface RedirectInspection {
    finalUrl: string;

    redirects: Array<{
        url: string;
        status: number;
        location: string;
    }>;

    maxRedirectsReached?: boolean;
}

export interface TlsInspection {
    protocol: string;

    cipher?: {
        name: string;
        standardName?: string;
        version?: string;
    };

    certificate?: {
        subject?: {
            commonName?: string;
            organization?: string;
        };

        issuer?: {
            commonName?: string;
            organization?: string;
        };

        validFrom?: string;
        validTo?: string;
        serial?: string;
        fingerprint?: string;
        altNames?: string;
    };
}

export interface PortInspections {
    http?: HttpInspection;
    redirects?: RedirectInspection;
    tls?: TlsInspection;
}