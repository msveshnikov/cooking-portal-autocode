import React, { useState, useEffect, useCallback } from "react";
import {
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    Button,
    Box,
    Skeleton,
    useTheme,
    useMediaQuery,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import FilterListIcon from "@mui/icons-material/FilterList";
import InfiniteScroll from "react-infinite-scroll-component";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [displayedFavorites, setDisplayedFavorites] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [shareDialogOpen, setShareDialogOpen] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [dietFilter, setDietFilter] = useState("");
    const [cuisineFilter, setCuisineFilter] = useState("");

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const fetchFavorites = useCallback(async () => {
        try {
            const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
            setFavorites(storedFavorites);
            setDisplayedFavorites(storedFavorites.slice(0, 9));
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching favorites:", error);
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFavorites();
    }, [fetchFavorites]);

    const removeFromFavorites = (id) => {
        const updatedFavorites = favorites.filter((recipe) => recipe.id !== id);
        setFavorites(updatedFavorites);
        setDisplayedFavorites(updatedFavorites.slice(0, displayedFavorites.length));
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    };

    const fetchMoreData = () => {
        if (displayedFavorites.length >= favorites.length) {
            setHasMore(false);
            return;
        }
        setTimeout(() => {
            const newDisplayed = favorites.slice(0, displayedFavorites.length + 9);
            setDisplayedFavorites(newDisplayed);
        }, 500);
    };

    const handleShareClick = (recipe) => {
        setSelectedRecipe(recipe);
        setShareDialogOpen(true);
    };

    const handleShareClose = () => {
        setShareDialogOpen(false);
    };

    const handleShare = (platform) => {
        if (selectedRecipe) {
            let shareUrl = "";
            switch (platform) {
                case "facebook":
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                        window.location.origin + "/recipe/" + selectedRecipe.id
                    )}`;
                    break;
                case "twitter":
                    shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                        `Check out this recipe: ${selectedRecipe.title}`
                    )}&url=${encodeURIComponent(window.location.origin + "/recipe/" + selectedRecipe.id)}`;
                    break;
                case "pinterest":
                    shareUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
                        window.location.origin + "/recipe/" + selectedRecipe.id
                    )}&media=${encodeURIComponent(selectedRecipe.image)}&description=${encodeURIComponent(
                        selectedRecipe.title
                    )}`;
                    break;
                default:
                    break;
            }
            if (shareUrl) {
                window.open(shareUrl, "_blank");
            }
        }
        handleShareClose();
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleFilterClick = () => {
        setFilterDialogOpen(true);
    };

    const handleFilterClose = () => {
        setFilterDialogOpen(false);
    };

    const handleDietFilterChange = (event) => {
        setDietFilter(event.target.value);
    };

    const handleCuisineFilterChange = (event) => {
        setCuisineFilter(event.target.value);
    };

    const applyFilters = () => {
        const filteredFavorites = favorites.filter((recipe) => {
            const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesDiet = dietFilter ? recipe.diets && recipe.diets.includes(dietFilter) : true;
            const matchesCuisine = cuisineFilter ? recipe.cuisines && recipe.cuisines.includes(cuisineFilter) : true;
            return matchesSearch && matchesDiet && matchesCuisine;
        });
        setDisplayedFavorites(filteredFavorites.slice(0, 9));
        setHasMore(filteredFavorites.length > 9);
        handleFilterClose();
    };

    if (isLoading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    My Favorite Recipes
                </Typography>
                <Grid container spacing={4}>
                    {[...Array(6)].map((_, index) => (
                        <Grid item key={index} xs={12} sm={6} md={4}>
                            <Skeleton variant="rectangular" height={140} />
                            <Skeleton variant="text" />
                            <Skeleton variant="text" width="60%" />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                My Favorite Recipes
            </Typography>
            <Box sx={{ display: "flex", mb: 2 }}>
                <TextField
                    label="Search recipes"
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ flexGrow: 1, mr: 2 }}
                />
                <Button variant="outlined" startIcon={<FilterListIcon />} onClick={handleFilterClick}>
                    Filter
                </Button>
            </Box>
            {favorites.length === 0 ? (
                <Typography variant="body1">You haven't added any favorites yet.</Typography>
            ) : (
                <InfiniteScroll
                    dataLength={displayedFavorites.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                >
                    <Grid container spacing={4}>
                        {displayedFavorites.map((recipe) => (
                            <Grid item key={recipe.id} xs={12} sm={6} md={4}>
                                <Card>
                                    <CardMedia component="img" height="140" image={recipe.image} alt={recipe.title} />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {recipe.title}
                                        </Typography>
                                        {recipe.diets && (
                                            <Box sx={{ mt: 1 }}>
                                                {recipe.diets.slice(0, 3).map((diet, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={diet}
                                                        size="small"
                                                        sx={{ mr: 0.5, mb: 0.5 }}
                                                    />
                                                ))}
                                            </Box>
                                        )}
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" component={Link} to={`/recipe/${recipe.id}`}>
                                            View Recipe
                                        </Button>
                                        <Box sx={{ flexGrow: 1 }} />
                                        <Button
                                            size="small"
                                            onClick={() => handleShareClick(recipe)}
                                            startIcon={<ShareIcon />}
                                        >
                                            {isMobile ? "" : "Share"}
                                        </Button>
                                        <Button
                                            size="small"
                                            onClick={() => removeFromFavorites(recipe.id)}
                                            startIcon={<FavoriteIcon color="error" />}
                                        >
                                            {isMobile ? "" : "Remove"}
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </InfiniteScroll>
            )}
            <Dialog open={shareDialogOpen} onClose={handleShareClose}>
                <DialogTitle>Share Recipe</DialogTitle>
                <DialogContent>
                    <Typography variant="body1" gutterBottom>
                        Share this recipe on:
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-around", mt: 2 }}>
                        <Button onClick={() => handleShare("facebook")}>Facebook</Button>
                        <Button onClick={() => handleShare("twitter")}>Twitter</Button>
                        <Button onClick={() => handleShare("pinterest")}>Pinterest</Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleShareClose}>Close</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={filterDialogOpen} onClose={handleFilterClose}>
                <DialogTitle>Filter Recipes</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Diet</InputLabel>
                        <Select value={dietFilter} onChange={handleDietFilterChange}>
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="vegetarian">Vegetarian</MenuItem>
                            <MenuItem value="vegan">Vegan</MenuItem>
                            <MenuItem value="gluten free">Gluten Free</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel>Cuisine</InputLabel>
                        <Select value={cuisineFilter} onChange={handleCuisineFilterChange}>
                            <MenuItem value="">Any</MenuItem>
                            <MenuItem value="italian">Italian</MenuItem>
                            <MenuItem value="mexican">Mexican</MenuItem>
                            <MenuItem value="asian">Asian</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleFilterClose}>Cancel</Button>
                    <Button onClick={applyFilters}>Apply</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Favorites;
