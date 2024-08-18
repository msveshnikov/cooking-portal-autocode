import React from "react";
import { Card, CardContent, CardMedia, Typography, CardActions, Button, IconButton, Chip, Box } from "@mui/material";
import { Link } from "react-router-dom";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RestaurantIcon from "@mui/icons-material/Restaurant";

const RecipeCard = ({ recipe, onFavoriteToggle, isFavorite, onShare }) => {
    return (
        <Card sx={{ maxWidth: 345, height: "100%", display: "flex", flexDirection: "column" }}>
            <CardMedia component="img" height="140" image={recipe.image} alt={recipe.title} />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="div">
                    {recipe.title}
                </Typography>
                <Box display="flex" alignItems="center" mb={1}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        {recipe.readyInMinutes} mins
                    </Typography>
                </Box>
                <Box display="flex" alignItems="center" mb={1}>
                    <RestaurantIcon fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                        {recipe.servings} servings
                    </Typography>
                </Box>
                {recipe.diets && recipe.diets.length > 0 && (
                    <Box display="flex" flexWrap="wrap" gap={0.5} mt={1}>
                        {recipe.diets.map((diet, index) => (
                            <Chip key={index} label={diet} size="small" variant="outlined" />
                        ))}
                    </Box>
                )}
            </CardContent>
            <CardActions>
                <Button size="small" component={Link} to={`/recipe/${recipe.id}`}>
                    View Recipe
                </Button>
                <IconButton aria-label="add to favorites" onClick={() => onFavoriteToggle(recipe.id)}>
                    {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton aria-label="share" onClick={() => onShare(recipe)}>
                    <ShareIcon />
                </IconButton>
            </CardActions>
        </Card>
    );
};

export default RecipeCard;
