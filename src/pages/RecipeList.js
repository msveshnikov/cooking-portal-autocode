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
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Paper,
} from "@mui/material";
import InfiniteScroll from "react-infinite-scroll-component";
import RecipeCard from "../components/RecipeCard";
import { searchRecipes, autocompleteRecipeSearch, getRecipeRecommendations } from "../services/api";
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
    const [recommendedRecipes, setRecommendedRecipes] = useState([]);
    const [recommendationDialogOpen, setRecommendationDialogOpen] = useState(false);
    const [cuisineType, setCuisineType] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const loadRecipes = useCallback(async () => {
        setLoading(true);
        try {
            const newRecipes = await searchRecipes(debouncedSearchTerm, filters, cuisineType, page);
            setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);
            setPage((prevPage) => prevPage + 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [debouncedSearchTerm, filters, cuisineType, page]);

    useEffect(() => {
        loadRecipes();
    }, [loadRecipes]);

    useEffect(() => {
        const fetchAutocompleteSuggestions = async () => {
            if (searchTerm) {
                try {
                    const suggestions = await autocompleteRecipeSearch(searchTerm);
                    setAutocompleteSuggestions(suggestions);
                } catch (err) {
                    console.error("Autocomplete error:", err);
                }
            }
        };
        fetchAutocompleteSuggestions();
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

    const handleCuisineTypeChange = (event, newCuisineType) => {
        setCuisineType(newCuisineType);
        setRecipes([]);
        setPage(1);
    };

    const handleGetRecommendations = async () => {
        try {
            const recommendations = await getRecipeRecommendations(favorites);
            setRecommendedRecipes(recommendations);
            setRecommendationDialogOpen(true);
        } catch (err) {
            setError("Failed to get recommendations. Please try again.");
        }
    };

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box
            sx={{
                backgroundColor: darkMode ? "#333" : "#fff",
                color: darkMode ? "#fff" : "#000",
                minHeight: "100vh",
                padding: "20px",
            }}
        >
            <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
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
                            sx={{ marginBottom: "20px" }}
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
                        value.map((option, index) => (
                            <Chip variant="outlined" label={option} {...getTagProps({ index })} />
                        ))
                    }
                    sx={{ marginBottom: "20px" }}
                />
                <Autocomplete
                    options={["Italian", "Mexican", "Chinese", "Indian", "Japanese", "French"]}
                    renderInput={(params) => <TextField {...params} variant="outlined" label="Cuisine Type" />}
                    onChange={handleCuisineTypeChange}
                    sx={{ marginBottom: "20px" }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleGetRecommendations}
                    sx={{ marginBottom: "20px" }}
                >
                    Get Recommendations
                </Button>
            </Paper>
            <InfiniteScroll dataLength={recipes.length} next={loadRecipes} hasMore={true} loader={<CircularProgress />}>
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
            {loading && <CircularProgress sx={{ display: "block", margin: "20px auto" }} />}
            <Dialog open={recommendationDialogOpen} onClose={() => setRecommendationDialogOpen(false)}>
                <DialogTitle>Recommended Recipes</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2}>
                        {recommendedRecipes.map((recipe) => (
                            <Grid item xs={12} sm={6} key={recipe.id}>
                                <RecipeCard
                                    recipe={recipe}
                                    darkMode={darkMode}
                                    isFavorite={favorites.includes(recipe.id)}
                                    onFavoriteToggle={() => toggleFavorite(recipe.id)}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRecommendationDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RecipeList;
