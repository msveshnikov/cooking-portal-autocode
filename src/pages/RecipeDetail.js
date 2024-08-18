import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Typography,
    Grid,
    Paper,
    Chip,
    Box,
    Button,
    useTheme,
    Snackbar,
    Alert,
    CircularProgress,
    IconButton,
} from "@mui/material";
import { styled } from "@mui/system";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

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
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const theme = useTheme();
    const navigate = useNavigate();

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
            setSnackbarMessage("Recipe removed from favorites");
        } else {
            favorites.push(recipe.id);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            setSnackbarMessage("Recipe added to favorites");
        }
        setIsFavorite(!isFavorite);
        setSnackbarOpen(true);
    };

    const handleShare = () => {
        navigator
            .share({
                title: recipe.title,
                text: `Check out this recipe: ${recipe.title}`,
                url: window.location.href,
            })
            .then(() => {
                setSnackbarMessage("Recipe shared successfully");
                setSnackbarOpen(true);
            })
            .catch((error) => {
                console.error("Error sharing recipe:", error);
            });
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setSnackbarOpen(false);
    };

    if (loading) {
        return (
            <Container maxWidth="lg">
                <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                    <CircularProgress />
                </Box>
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
            <Box mb={2}>
                <IconButton onClick={() => navigate(-1)}>
                    <ArrowBackIcon />
                </IconButton>
            </Box>
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
                                marginRight: 1,
                            }}
                        >
                            {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                        </Button>
                        <IconButton onClick={handleShare} color="primary">
                            <ShareIcon />
                        </IconButton>
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

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: "100%" }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default RecipeDetail;
