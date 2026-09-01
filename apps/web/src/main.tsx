import React from "react";
import ReactDOM from "react-dom/client";

import { ScanSessionProvider } from "./context/ScanSessionContext.js";

import {
    BrowserRouter,
} from "react-router-dom";

import App from "./App";

import "./i18n.js";

import ScrollToTop from "./components/ScrollToTop.js";

import LanguageTransitionProvider from "./components/langcomponent/LanguageTransitionContext";

import { ThemeProvider } from "./context/ThemeContext";

import "./index.css";

ReactDOM.createRoot(
    document.getElementById("root")!
).render(
  <ThemeProvider>
      <BrowserRouter>
          <LanguageTransitionProvider>
              <ScanSessionProvider>
                  <ScrollToTop />
                  <App />
              </ScanSessionProvider>
          </LanguageTransitionProvider>
      </BrowserRouter>
  </ThemeProvider>
);