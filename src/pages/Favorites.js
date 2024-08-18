import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import InfiniteScroll from "react-infinite-scroll-component";

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [displayedFavorites, setDisplayedFavorites] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
                setFavorites(storedFavorites);
                setDisplayedFavorites(storedFavorites.slice(0, 9));
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching favorites:", error);
                setIsLoading(false);
            }
        };
        fetchFavorites();
    }, []);

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
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" component={Link} to={`/recipe/${recipe.id}`}>
                                            View Recipe
                                        </Button>
                                        <Box sx={{ flexGrow: 1 }} />
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
        </Container>
    );
};

export default Favorites;
