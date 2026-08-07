import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "@/auth/AuthContext";
import LocaleProvider from "@/i18n/LocaleProvider";
import { ThemeProvider } from "@/theme/ThemeContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LocaleProvider>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </LocaleProvider>
  </React.StrictMode>,
);
