import React, { useState, useEffect, useCallback } from "react";
import { Container, Grid, Typography, TextField, CircularProgress, Switch, FormControlLabel, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import RecipeCard from "../components/RecipeCard";
import { getRandomRecipes, searchRecipes } from "../services/api.js";
import { debounce } from "lodash";
import InfiniteScroll from "react-infinite-scroll-component";

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [darkMode, setDarkMode] = useState(false);
    const [cuisine, setCuisine] = useState("");
    const [diet, setDiet] = useState("");

    useEffect(() => {
        fetchRandomRecipes();
    }, []);

    const fetchRandomRecipes = async () => {
        try {
            setLoading(true);
            const data = await getRandomRecipes(12);
            setRecipes(data.recipes);
        } catch (error) {
            console.error("Error fetching random recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = useCallback(
        debounce(async (searchTerm) => {
            try {
                setLoading(true);
                const data = await searchRecipes(searchTerm, 12, 0, cuisine, diet);
                setRecipes(data.results);
                setPage(1);
            } catch (error) {
                console.error("Error searching recipes:", error);
            } finally {
                setLoading(false);
            }
        }, 300),
        [cuisine, diet]
    );

    useEffect(() => {
        if (search) {
            handleSearch(search);
        }
    }, [search, handleSearch]);

    const loadMore = async () => {
        try {
            setLoading(true);
            const data = await searchRecipes(search, 12, page * 12, cuisine, diet);
            setRecipes([...recipes, ...data.results]);
            setPage(page + 1);
        } catch (error) {
            console.error("Error loading more recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.body.style.backgroundColor = darkMode ? "#ffffff" : "#303030";
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" component="h1" gutterBottom>
                Discover Delicious Recipes
            </Typography>
            <FormControlLabel
                control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
                label="Dark Mode"
            />
            <Grid container spacing={2} alignItems="center" marginBottom={4}>
                <Grid item xs={12} sm={6} md={4}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search recipes..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={3} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Cuisine</InputLabel>
                        <Select
                            value={cuisine}
                            label="Cuisine"
                            onChange={(e) => setCuisine(e.target.value)}
                        >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="italian">Italian</MenuItem>
                            <MenuItem value="mexican">Mexican</MenuItem>
                            <MenuItem value="chinese">Chinese</MenuItem>
                            <MenuItem value="indian">Indian</MenuItem>
                            <MenuItem value="japanese">Japanese</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={3} md={2}>
                    <FormControl fullWidth>
                        <InputLabel>Diet</InputLabel>
                        <Select
                            value={diet}
                            label="Diet"
                            onChange={(e) => setDiet(e.target.value)}
                        >
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="vegetarian">Vegetarian</MenuItem>
                            <MenuItem value="vegan">Vegan</MenuItem>
                            <MenuItem value="gluten-free">Gluten-free</MenuItem>
                            <MenuItem value="ketogenic">Ketogenic</MenuItem>
                            <MenuItem value="paleo">Paleo</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            {loading && <CircularProgress />}
            <InfiniteScroll
                dataLength={recipes?.length}
                next={loadMore}
                hasMore={true}
                loader={<CircularProgress />}
            >
                <Grid container spacing={3}>
                    {recipes?.map((recipe) => (
                        <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                            <RecipeCard recipe={recipe} />
                        </Grid>
                    ))}
                </Grid>
            </InfiniteScroll>
        </Container>
    );
};

export default Home;