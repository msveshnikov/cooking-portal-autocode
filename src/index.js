import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "react-query";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#1976d2",
        },
        secondary: {
            main: "#dc004e",
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#90caf9",
        },
        secondary: {
            main: "#f48fb1",
        },
    },
});

export const apiKey = "8be8f9112d4f49e8bc35100bb649ce2b";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            staleTime: 5 * 60 * 1000,
            cacheTime: 10 * 60 * 1000,
        },
    },
});

const Root = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedMode = localStorage.getItem("darkMode");
        setIsDarkMode(savedMode === "true");
    }, []);

    const toggleDarkMode = () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        localStorage.setItem("darkMode", newMode.toString());
    };

    return (
        <React.StrictMode>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
                    <CssBaseline />
                    <App isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
                </ThemeProvider>
            </QueryClientProvider>
        </React.StrictMode>
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);

reportWebVitals();
