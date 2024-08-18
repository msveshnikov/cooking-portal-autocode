# MealPlanner Component Documentation

## Overview

The `MealPlanner` component is a React-based meal planning interface. It allows users to view, add, and remove meals for a week-long period. The component integrates with an API to fetch meal plans and search for recipes, and it uses local storage to persist user data.

## File Location

`src/pages/MealPlanner.js`

## Dependencies

- React and various hooks (useState, useEffect, useCallback, useMemo)
- Material-UI components and icons
- Custom hooks: useDebounce, useLocalStorage
- API services: getMealPlan, searchRecipes

## Component Structure

The `MealPlanner` component is a functional component that renders a weekly meal plan grid, along with a dialog for adding new meals.

## State Management

- `startDate`: The starting date for the meal plan (stored in local storage)
- `mealPlan`: The current meal plan data (stored in local storage)
- `dialogState`: Controls the state of the "Add Meal" dialog
- `searchQuery`: Stores the current recipe search query
- `searchResults`: Stores the results of the recipe search

## Main Functions

### generateMealPlan

```javascript
const generateMealPlan = useCallback(async () => {
  // ... implementation
}, [startDate, setMealPlan]);
```

Fetches the meal plan data from the API based on the `startDate`.

### handleAddMeal

```javascript
const handleAddMeal = useCallback((date, meal) => {
  // ... implementation
}, []);
```

Opens the "Add Meal" dialog for a specific date and meal.

### handleSelectRecipe

```javascript
const handleSelectRecipe = useCallback((recipe) => {
  // ... implementation
}, [dialogState, setMealPlan, handleCloseDialog]);
```

Adds a selected recipe to the meal plan for the specified date and meal.

### handleRemoveMeal

```javascript
const handleRemoveMeal = useCallback((date, mealIndex) => {
  // ... implementation
}, [setMealPlan]);
```

Removes a meal from the meal plan for the specified date and index.

### renderMealSection

```javascript
const renderMealSection = useCallback((currentDate, meal) => {
  // ... implementation
}, [mealPlan, handleAddMeal, handleRemoveMeal]);
```

Renders the meals for a specific date and meal type, including options to add or remove meals.

## useEffect Hooks

1. Generates the initial meal plan on component mount.
2. Performs recipe searches when the debounced search query changes.

## Rendered Output

The component renders:
1. A title "Meal Planner"
2. A grid of daily meal plans for a week
3. A dialog for adding new meals, including a search functionality

## Usage

This component is likely used as a page in the application, accessible via routing. It provides a full interface for users to manage their weekly meal plans.

## Integration with Project

- Uses custom hooks from the `hooks` directory for debounced input and local storage management.
- Integrates with the API service from `services/api.js` for fetching meal plans and searching recipes.
- Likely accessed through the main application routing defined in `App.js`.

## Potential Improvements

1. Add error handling and user feedback for API errors.
2. Implement pagination for search results.
3. Add options for customizing the date range of the meal plan.
4. Implement drag-and-drop functionality for rearranging meals.

This component forms a core part of the meal planning functionality in the application, providing a user-friendly interface for managing weekly meals.