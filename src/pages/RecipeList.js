import React, { useState, useEffect, useCallback } from "react";
import {
    Grid,
    TextField,
    CircularProgress,
    Typography,
    Switch,
    FormControlLabel,
    Autocomplete,
    Chip,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import RecipeCard from "../components/RecipeCard";
import { searchRecipes, autocompleteRecipeSearch } from "../services/api";
import useDebounce from "../hooks/useDebounce";
import useLocalStorage from "../hooks/useLocalStorage";

const RecipeList = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [darkMode, setDarkMode] = useLocalStorage("darkMode", false);
    const [favorites, setFavorites] = useLocalStorage("favorites", []);
    const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
    const [filters, setFilters] = useState([]);
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const loadRecipes = useCallback(async () => {
        setLoading(true);
        try {
            const newRecipes = await searchRecipes(debouncedSearchTerm, filters, page);
            setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);
            setPage((prevPage) => prevPage + 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, filters, page]);

    useEffect(() => {
        loadRecipes();
    }, [loadRecipes]);

    useEffect(() => {
        if (searchTerm) {
            autocompleteRecipeSearch(searchTerm)
                .then(setAutocompleteSuggestions)
                .catch((err) => console.error("Autocomplete error:", err));
        }
    }, [searchTerm]);

    const handleSearchChange = (event, value) => {
        setSearchTerm(value);
        setRecipes([]);
        setPage(1);
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleFavorite = (recipeId) => {
        setFavorites((prevFavorites) =>
            prevFavorites.includes(recipeId)
                ? prevFavorites.filter((id) => id !== recipeId)
                : [...prevFavorites, recipeId]
        );
    };

    const handleFilterChange = (event, newFilters) => {
        setFilters(newFilters);
        setRecipes([]);
        setPage(1);
    };

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <div
            style={{
                backgroundColor: darkMode ? "#333" : "#fff",
                color: darkMode ? "#fff" : "#000",
                minHeight: "100vh",
                padding: "20px",
            }}
        >
            <FormControlLabel control={<Switch checked={darkMode} onChange={toggleDarkMode} />} label="Dark Mode" />
            <Autocomplete
                freeSolo
                options={autocompleteSuggestions}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        variant="outlined"
                        placeholder="Search recipes..."
                        style={{ marginBottom: "20px" }}
                    />
                )}
                onInputChange={handleSearchChange}
            />
            <Autocomplete
                multiple
                options={["vegetarian", "vegan", "gluten-free", "dairy-free"]}
                renderInput={(params) => <TextField {...params} variant="outlined" label="Dietary Restrictions" />}
                onChange={handleFilterChange}
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)
                }
                style={{ marginBottom: "20px" }}
            />
            <InfiniteScroll
                dataLength={recipes.length}
                next={loadRecipes}
                hasMore={true}
                loader={<CircularProgress />}
            >
                <Grid container spacing={3}>
                    {recipes.map((recipe) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={recipe.id}>
                            <RecipeCard
                                recipe={recipe}
                                darkMode={darkMode}
                                isFavorite={favorites.includes(recipe.id)}
                                onFavoriteToggle={() => toggleFavorite(recipe.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
            </InfiniteScroll>
            {loading && <CircularProgress style={{ display: "block", margin: "20px auto" }} />}
        </div>
    );
};

export default RecipeList;