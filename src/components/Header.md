# Header Component Documentation

## Overview

The `Header` component is a React-based navigation bar for a recipe application. It utilizes Material-UI (MUI) components and styling to create a responsive and feature-rich header. The component includes a menu icon, application title, search functionality, and a dark mode toggle.

## Dependencies

-   React
-   @mui/material
-   @mui/icons-material
-   @mui/material/styles

## Styled Components

### Search

A styled `div` component that creates a search input container with responsive styling.

### SearchIconWrapper

A styled `div` component that wraps the search icon, positioning it absolutely within the search input.

### StyledInputBase

A styled version of MUI's `InputBase` component, customized for the search input field.

## Main Component: Header

### Props

-   `darkMode` (boolean): Indicates whether dark mode is active.
-   `setDarkMode` (function): Setter function to toggle dark mode.
-   `onSearch` (function): Callback function to handle search submissions.

### State

-   `searchTerm` (string): Stores the current value of the search input.

### Methods

#### handleSearchChange

Handles changes to the search input field.

-   Parameters:
    -   `event` (Object): The input change event.

#### handleSearchSubmit

Handles the submission of the search form.

-   Parameters:
    -   `event` (Object): The form submission event.
-   Behavior: Prevents default form submission and calls the `onSearch` prop with the current `searchTerm`.

### Rendered Elements

1. AppBar with Toolbar
2. Menu IconButton
3. Typography component for app title
4. Search component with input field
5. Dark mode toggle switch

## Usage Example

```jsx
import React, { useState } from "react";
import Header from "./Header";

function App() {
    const [darkMode, setDarkMode] = useState(false);

    const handleSearch = (searchTerm) => {
        console.log("Searching for:", searchTerm);
        // Implement search logic here
    };

    return (
        <div>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} onSearch={handleSearch} />
            {/* Rest of your application */}
        </div>
    );
}

export default App;
```

## Notes

-   The component is responsive, adjusting its layout for different screen sizes.
-   The search functionality is set up to be controlled by the parent component through the `onSearch` prop.
-   Dark mode toggle is implemented using a switch, which updates the `darkMode` state in the parent component.
-   The menu icon (MenuIcon) is included but doesn't have functionality in this component. It's meant to be extended in the parent application if needed.

This Header component provides a solid foundation for navigation and search in a recipe application, with the added feature of dark mode toggling for user preference.
