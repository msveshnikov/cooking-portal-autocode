import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Container } from "@mui/material";
import Header from "./components/Header";
import Home from "./pages/Home";
import RecipeList from "./pages/RecipeList";
import RecipeDetail from "./pages/RecipeDetail";
import Favorites from "./pages/Favorites";
import Search from "./components/Search";
import ErrorBoundary from "./components/ErrorBoundary";

const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#ff4400",
        },
        secondary: {
            main: "#0044ff",
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#ff6633",
        },
        secondary: {
            main: "#3366ff",
        },
    },
});

const apiKey = "8be8f9112d4f49e8bc35100bb649ce2b";

function App() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        const storedFavorites = localStorage.getItem("favorites");
        if (storedFavorites) {
            setFavorites(JSON.parse(storedFavorites));
        }
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    const addToFavorites = (recipe) => {
        const updatedFavorites = [...favorites, recipe];
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    const removeFromFavorites = (recipeId) => {
        const updatedFavorites = favorites.filter((recipe) => recipe.id !== recipeId);
        setFavorites(updatedFavorites);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    return (
        <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <ErrorBoundary>
                <Router>
                    <Header toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                    <Container>
                        <Search apiKey={apiKey} />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/recipes"
                                element={
                                    <RecipeList
                                        apiKey={apiKey}
                                        addToFavorites={addToFavorites}
                                        removeFromFavorites={removeFromFavorites}
                                        favorites={favorites}
                                    />
                                }
                            />
                            <Route
                                path="/recipe/:id"
                                element={
                                    <RecipeDetail
                                        apiKey={apiKey}
                                        addToFavorites={addToFavorites}
                                        removeFromFavorites={removeFromFavorites}
                                        favorites={favorites}
                                    />
                                }
                            />
                            <Route
                                path="/favorites"
                                element={<Favorites favorites={favorites} removeFromFavorites={removeFromFavorites} />}
                            />
                        </Routes>
                    </Container>
                </Router>
            </ErrorBoundary>
        </ThemeProvider>
    );
}

export default App;
