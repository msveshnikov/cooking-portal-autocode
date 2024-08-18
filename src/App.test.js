import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import axios from "axios";
import { ThemeProvider } from "@mui/material/styles";

jest.mock("axios");

const mockRecipes = [
    { id: 1, title: "Test Recipe 1" },
    { id: 2, title: "Test Recipe 2" },
];

describe("App component", () => {
    beforeEach(() => {
        axios.get.mockResolvedValue({ data: { results: mockRecipes } });
    });

    test("renders app title", async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByText(/Recipes app/i)).toBeInTheDocument();
        });
    });

    test("renders recipe list", async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByText("Test Recipe 1")).toBeInTheDocument();
            expect(screen.getByText("Test Recipe 2")).toBeInTheDocument();
        });
    });

    test("makes API call with correct key", async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("apiKey=8be8f9112d4f49e8bc35100bb649ce2b"));
        });
    });

    test("renders multiple pages", async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
            expect(screen.getByRole("link", { name: /recipes/i })).toBeInTheDocument();
        });
    });

    test("uses MUI components", async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(document.querySelector(".MuiAppBar-root")).toBeInTheDocument();
            expect(document.querySelector(".MuiCard-root")).toBeInTheDocument();
        });
    });

    test("implements dark mode toggle", async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        const darkModeToggle = await screen.findByRole("button", { name: /toggle dark mode/i });
        fireEvent.click(darkModeToggle);
        expect(document.body).toHaveClass("MuiTheme-dark");
    });

    test("implements search bar with autocomplete", async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        const searchInput = await screen.findByRole("combobox");
        expect(searchInput).toBeInTheDocument();
    });

    test("implements infinite scrolling", async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        const recipeList = await screen.findByTestId("recipe-list");
        fireEvent.scroll(recipeList);
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(2);
        });
    });

    test("implements favorites feature", async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        const favoriteButton = await screen.findByRole("button", { name: /add to favorites/i });
        fireEvent.click(favoriteButton);
        expect(screen.getByText(/added to favorites/i)).toBeInTheDocument();
    });

    test("implements recipe filtering", async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        const filterButton = await screen.findByRole("button", { name: /filter/i });
        fireEvent.click(filterButton);
        const vegetarianFilter = screen.getByLabelText(/vegetarian/i);
        fireEvent.click(vegetarianFilter);
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledWith(expect.stringContaining("diet=vegetarian"));
        });
    });

    test("displays loading skeletons", async () => {
        axios.get.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ data: { results: mockRecipes } }), 1000)));
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        expect(screen.getByTestId("loading-skeleton")).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.queryByTestId("loading-skeleton")).not.toBeInTheDocument();
        });
    });

    test("handles errors gracefully", async () => {
        axios.get.mockRejectedValueOnce(new Error("API Error"));
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
        });
    });

    test("implements responsive grid layout", async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(document.querySelector(".MuiGrid-root")).toBeInTheDocument();
        });
    });

    test("caches frequently accessed recipes", async () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
        });
        
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(axios.get).toHaveBeenCalledTimes(1);
        });
    });

    test("ensures cross-browser compatibility", async () => {
        const { container } = render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        await waitFor(() => {
            expect(container.querySelector("[data-testid='cross-browser-compatible']")).toBeInTheDocument();
        });
    });
});