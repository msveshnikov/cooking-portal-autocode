# RecipeList Component Documentation

## Overview

The RecipeList component is a React functional component that displays a list of recipes with infinite scrolling, search functionality, and a dark mode toggle. It utilizes Material-UI components for styling and layout.

## Dependencies

-   React
-   Material-UI (@mui/material)
-   react-infinite-scroll-component
-   Custom components: RecipeCard
-   Custom services: api (fetchRecipes, searchRecipes)
-   Custom hooks: useDebounce

## State Variables

-   `recipes`: Array of recipe objects
-   `loading`: Boolean indicating if recipes are being loaded
-   `error`: String containing error message, if any
-   `searchTerm`: String containing the current search term
-   `page`: Number indicating the current page of recipes
-   `darkMode`: Boolean indicating if dark mode is active
-   `debouncedSearchTerm`: Debounced version of the search term

## Effects

### Initial Load Effect

```javascript
useEffect(() => {
    loadRecipes();
}, []);
```

Loads initial recipes when the component mounts.

### Search Effect

```javascript
useEffect(() => {
    if (debouncedSearchTerm) {
        searchRecipes(debouncedSearchTerm)
            .then((data) => {
                setRecipes(data.results);
                setPage(1);
            })
            .catch((err) => setError(err.message));
    } else {
        loadRecipes();
    }
}, [debouncedSearchTerm]);
```

Performs a search when the debounced search term changes. If the search term is empty, it loads recipes normally.

## Functions

### loadRecipes

```javascript
const loadRecipes = async () => {
    setLoading(true);
    try {
        const newRecipes = await fetchRecipes(page);
        setRecipes((prevRecipes) => [...prevRecipes, ...newRecipes]);
        setPage((prevPage) => prevPage + 1);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
```

Asynchronously fetches recipes for the current page, appends them to the existing recipes, and increments the page number.

### handleSearchChange

```javascript
const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
};
```

Updates the search term state when the search input changes.

### toggleDarkMode

```javascript
const toggleDarkMode = () => {
    setDarkMode(!darkMode);
};
```

Toggles the dark mode state.

## Render Logic

The component renders:

1. A dark mode toggle switch
2. A search input field
3. An infinite scroll container with:
    - A grid of RecipeCard components
    - A loading indicator for more recipes
4. A loading indicator for the initial load or search

If there's an error, it renders an error message instead.

## Props

This component doesn't accept any props.

## Usage Example

```jsx
import React from "react";
import RecipeList from "./path/to/RecipeList";

function App() {
    return (
        <div>
            <h1>My Recipe App</h1>
            <RecipeList />
        </div>
    );
}

export default App;
```

This will render the RecipeList component with all its functionality, including the search bar, dark mode toggle, and infinite scrolling recipe list.

## Notes

-   The component uses the custom `useDebounce` hook to prevent excessive API calls while typing in the search field.
-   The `InfiniteScroll` component is used to implement infinite scrolling, loading more recipes as the user scrolls down.
-   The component is responsive, adjusting the grid layout for different screen sizes.
-   Dark mode affects the background and text color of the component.
