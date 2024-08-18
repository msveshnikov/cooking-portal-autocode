import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActions, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const RecipeCard = ({ recipe }) => {
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
      </CardContent>
      <CardActions>
        <Button size="small" component={Link} to={`/recipe/${recipe.id}`}>
          View Recipe
        </Button>
      </CardActions>
    </Card>
  );
};

export default RecipeCard;