import {
    Outlet,
    useLocation,
} from "react-router-dom";

import {
    useState,
} from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function ScannerLayout() {
    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const location = useLocation();

    return (
        <div
            className="
                min-h-screen
                bg-[var(--bg-primary)]
                text-[var(--text-primary)]
            "
        >
            <Sidebar
                active={
                    location.pathname.startsWith(
                        "/scans"
                    )
                        ? "scans"
                        : location.pathname.startsWith(
                              "/findings"
                          )
                        ? "findings"
                        : "scanner"
                }
                open={sidebarOpen}
                onClose={() =>
                    setSidebarOpen(false)
                }
            />

            {sidebarOpen && (
                <div
                    className="
                        fixed
                        inset-0
                        z-[150]
                        bg-black/50
                        lg:hidden
                    "
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />
            )}

            <div
                className="
                    min-h-screen
                    lg:pl-[280px]
                "
            >
                <Topbar
                    onMenuClick={() =>
                        setSidebarOpen(true)
                    }
                />

                <Outlet />
            </div>
        </div>
    );
}