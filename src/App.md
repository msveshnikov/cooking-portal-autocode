# Recipe App Documentation

## Overview

This React application is a recipe management system that allows users to search for recipes, view recipe details, and manage their favorite recipes. It features a responsive design with light and dark modes, utilizing Material-UI components and React Router for navigation.

## Key Components

### App

The main component that sets up the application structure, routing, and state management.

#### State

-   `isDarkMode`: Boolean to toggle between light and dark themes
-   `favorites`: Array of favorite recipes

#### Methods

##### `toggleDarkMode()`

Toggles the application theme between light and dark modes.

##### `addToFavorites(recipe)`

Adds a recipe to the favorites list and updates local storage.

Parameters:

-   `recipe`: Object containing recipe details

##### `removeFromFavorites(recipeId)`

Removes a recipe from the favorites list and updates local storage.

Parameters:

-   `recipeId`: Unique identifier of the recipe to be removed

### Routing

The application uses React Router for navigation with the following routes:

-   `/`: Home page
-   `/recipes`: List of recipes
-   `/recipe/:id`: Detailed view of a specific recipe
-   `/favorites`: List of favorite recipes

### Theme

Two themes are defined using Material-UI's `createTheme`:

-   `lightTheme`: For light mode
-   `darkTheme`: For dark mode

### API Integration

The application uses an external recipe API with the key stored in the `apiKey` constant.

## Components

### Header

Renders the application header with dark mode toggle.

### Search

Provides recipe search functionality.

### RecipeList

Displays a list of recipes with options to add/remove from favorites.

### RecipeDetail

Shows detailed information about a specific recipe.

### Favorites

Displays the user's favorite recipes.

### ErrorBoundary

Catches and displays errors that occur within its child components.

## Usage

### Initialization

```javascript
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById("root")
);
```

### State Management

The application uses React's `useState` and `useEffect` hooks for state management. Favorites are persisted in local storage.

### Theme Switching

The theme is controlled by the `isDarkMode` state and toggled using the `toggleDarkMode` function.

### Favorite Recipe Management

Favorites are managed using `addToFavorites` and `removeFromFavorites` functions, which update both the state and local storage.

## Error Handling

The application is wrapped in an `ErrorBoundary` component to catch and display any errors that occur during rendering.

## Customization

To customize the API key or themes, modify the `apiKey`, `lightTheme`, and `darkTheme` constants at the top of the file.

---

This documentation provides an overview of the main components and functionality of the Recipe App. For more detailed information on specific components or functions, refer to the inline comments in the code or consult the documentation of the libraries used (React, Material-UI, React Router).
