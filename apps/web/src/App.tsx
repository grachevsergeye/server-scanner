import {
    Route,
    Routes,
} from "react-router-dom";

import ScannerLayout from "./layouts/ScannerLayout";
import Scanner from "./routes/Scanner";
import Scans from "./routes/Scans";
import Findings from "./routes/Findings";
import ScanDetails from "./routes/ScanDetails";
import FindingDetails from "./components/findings/FindingDetails";
import ScanFindings from "./routes/ScanFindings";

function NotFound() {
    return (
        <div className="p-10">
            Page not found.
        </div>
    );
}

export default function App() {
    return (
        <Routes>
            <Route element={<ScannerLayout />}>
                <Route
                    path="/"
                    element={<Scanner />}
                />

                <Route
                    path="/scans"
                    element={<Scans />}
                />
                <Route
                    path="/scans/:id"
                    element={<ScanDetails />}
                />

                <Route
                    path="/findings"
                    element={<Findings />}
                />

                <Route
                    path="/findings/:scanId"
                    element={<ScanFindings />}
                />

                <Route
                    path="/findings/:scanId/:targetId/:findingId"
                    element={<FindingDetails />}
                />

                <Route
                    path="*"
                    element={<NotFound />}
                />
            </Route>
        </Routes>
    );
}