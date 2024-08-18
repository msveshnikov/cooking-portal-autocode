import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const RecipeCard = ({ recipe, onFavoriteToggle, isFavorite }) => {
  return (
    <Card sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="140"
        image={recipe.image}
        alt={recipe.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h5" component="div">
          {recipe.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Ready in {recipe.readyInMinutes} minutes
        </Typography>
        {recipe.diets && recipe.diets.length > 0 && (
          <Typography variant="body2" color="text.secondary">
            Diets: {recipe.diets.join(', ')}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/recipe/${recipe.id}`}>
          View Recipe
        </Button>
        <IconButton 
          aria-label="add to favorites" 
          onClick={() => onFavoriteToggle(recipe.id)}
        >
          {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;