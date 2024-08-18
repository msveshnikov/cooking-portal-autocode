import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Container,
    Typography,
    Grid,
    Paper,
    Chip,
    Box,
    Button,
    useTheme,
    Skeleton,
} from "@mui/material";
import { styled } from "@mui/system";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

const API_KEY = "8be8f9112d4f49e8bc35100bb649ce2b";

const StyledPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
}));

const StyledImage = styled("img")({
    width: "100%",
    height: "auto",
    borderRadius: "8px",
});

const RecipeDetail = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${API_KEY}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch recipe");
                }
                const data = await response.json();
                setRecipe(data);
                const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
                setIsFavorite(favorites.includes(data.id));
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecipe();
    }, [id]);

    const toggleFavorite = () => {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        if (isFavorite) {
            const updatedFavorites = favorites.filter((favId) => favId !== recipe.id);
            localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        } else {
            favorites.push(recipe.id);
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }
        setIsFavorite(!isFavorite);
    };

    if (loading) {
        return (
            <Container maxWidth="lg">
                <StyledPaper elevation={3}>
                    <Skeleton variant="rectangular" width="100%" height={300} />
                    <Box mt={2}>
                        <Skeleton variant="text" width="60%" height={40} />
                        <Skeleton variant="text" width="40%" height={30} />
                        <Skeleton variant="text" width="80%" height={100} />
                    </Box>
                </StyledPaper>
                <StyledPaper elevation={3}>
                    <Skeleton variant="text" width="40%" height={30} />
                    <Grid container spacing={2}>
                        {[...Array(6)].map((_, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Skeleton variant="text" width="80%" height={24} />
                            </Grid>
                        ))}
                    </Grid>
                </StyledPaper>
            </Container>
        );
    }

    if (error) {
        return (
            <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
                <ErrorOutlineIcon color="error" style={{ fontSize: 60 }} />
                <Typography variant="h6" color="error" mt={2}>
                    {error}
                </Typography>
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <StyledPaper elevation={3}>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                        <Typography variant="h4" gutterBottom>
                            {recipe.title}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Button
                            variant="outlined"
                            startIcon={isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                            onClick={toggleFavorite}
                            sx={{
                                color:
                                    theme.palette.mode === "dark"
                                        ? theme.palette.primary.light
                                        : theme.palette.primary.main,
                            }}
                        >
                            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        </Button>
                    </Grid>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <StyledImage src={recipe.image} alt={recipe.title} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>
                            Ready in {recipe.readyInMinutes} minutes
                        </Typography>
                        <Typography variant="body1" paragraph>
                            {recipe.summary.replace(/<[^>]*>/g, "")}
                        </Typography>
                        <Typography variant="h6" gutterBottom>
                            Diets:
                        </Typography>
                        <Box mb={2}>
                            {recipe.diets.map((diet) => (
                                <Chip key={diet} label={diet} variant="outlined" style={{ margin: "0 4px 4px 0" }} />
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </StyledPaper>

            <StyledPaper elevation={3}>
                <Typography variant="h5" gutterBottom>
                    Ingredients
                </Typography>
                <Grid container spacing={2}>
                    {recipe.extendedIngredients.map((ingredient) => (
                        <Grid item xs={12} sm={6} md={4} key={ingredient.id}>
                            <Typography variant="body1">
                                {ingredient.amount} {ingredient.unit} {ingredient.name}
                            </Typography>
                        </Grid>
                    ))}
                </Grid>
            </StyledPaper>

            <StyledPaper elevation={3}>
                <Typography variant="h5" gutterBottom>
                    Instructions
                </Typography>
                <ol>
                    {recipe.analyzedInstructions[0]?.steps.map((step) => (
                        <li key={step.number}>
                            <Typography variant="body1" paragraph>
                                {step.step}
                            </Typography>
                        </li>
                    ))}
                </ol>
            </StyledPaper>
        </Container>
    );
};

export default RecipeDetail;
