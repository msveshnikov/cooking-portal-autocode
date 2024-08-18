import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { styled } from "@mui/system";

const ErrorContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: theme.spacing(3),
    backgroundColor: theme.palette.background.default,
}));

const ErrorMessage = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    color: theme.palette.error.main,
}));

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    handleReload = () => {
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <ErrorContainer>
                    <ErrorMessage variant="h4" component="h1">
                        Oops! Something went wrong.
                    </ErrorMessage>
                    <Typography variant="body1" gutterBottom>
                        We're sorry for the inconvenience. Please try refreshing the page or contact support if the
                        problem persists.
                    </Typography>
                    <Button variant="contained" color="primary" onClick={this.handleReload} sx={{ mt: 2 }}>
                        Refresh Page
                    </Button>
                    {process.env.NODE_ENV === "development" && this.state.error && (
                        <Box sx={{ mt: 4, maxWidth: "100%", overflow: "auto" }}>
                            <Typography variant="h6" gutterBottom>
                                Error Details:
                            </Typography>
                            <pre>{this.state.error.toString()}</pre>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Component Stack:
                            </Typography>
                            <pre>{this.state.errorInfo.componentStack}</pre>
                        </Box>
                    )}
                </ErrorContainer>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
