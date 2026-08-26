import { useState } from "react";

import "./App.css";

type ScanStatus =
    | "idle"
    | "queued"
    | "scanning"
    | "completed"
    | "failed";

function App() {
    const [target, setTarget] = useState("");
    const [status, setStatus] = useState<ScanStatus>("idle");

    const handleScan = async () => {
        if (!target.trim()) {
            return;
        }

        setStatus("queued");

        // API connection will be added next.
        console.log("Starting scan:", target);
    };

    return (
        <div className="app">
            <header className="navbar">
                <div className="navbar-inner">
                    <div className="brand">
                        <div className="brand-mark">
                            S
                        </div>

                        <span>
                            Server Scanner
                        </span>
                    </div>

                    <div className="navbar-status">
                        API
                        <span className="status-dot" />
                        Online
                    </div>
                </div>
            </header>

            <main className="main">
                <section className="hero">
                    <div className="hero-badge">
                        Infrastructure Security Scanner
                    </div>

                    <h1>
                        Scan any server.
                        <br />
                        <span>Understand what is exposed.</span>
                    </h1>

                    <p className="hero-description">
                        Discover exposed services, identify infrastructure,
                        fingerprint technologies, and detect security risks.
                    </p>

                    <div className="scan-box">
                        <div className="scan-input-wrapper">
                            <input
                                type="text"
                                value={target}
                                onChange={(event) =>
                                    setTarget(event.target.value)
                                }
                                onKeyDown={(event) => {
                                    if (event.key === "Enter") {
                                        handleScan();
                                    }
                                }}
                                placeholder="Enter an IP address or hostname"
                                className="scan-input"
                            />

                            <button
                                className="scan-button"
                                onClick={handleScan}
                            >
                                Scan
                            </button>
                        </div>

                        {status !== "idle" && (
                            <div className="scan-status">
                                Status: <strong>{status}</strong>
                            </div>
                        )}
                    </div>
                </section>

                <section className="features">
                    <Feature
                        title="Port Discovery"
                        description="Identify publicly reachable network services."
                    />

                    <Feature
                        title="Service Detection"
                        description="Determine what software is running behind exposed ports."
                    />

                    <Feature
                        title="Security Analysis"
                        description="Detect potentially dangerous public services and configurations."
                    />
                </section>
            </main>
        </div>
    );
}

interface FeatureProps {
    title: string;
    description: string;
}

function Feature({
    title,
    description,
}: FeatureProps) {
    return (
        <div className="feature-card">
            <div className="feature-icon">
                +
            </div>

            <h3>
                {title}
            </h3>

            <p>
                {description}
            </p>
        </div>
    );
}

export default App;