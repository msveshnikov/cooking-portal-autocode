import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
    Container,
    Typography,
    Grid,
    Paper,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { getMealPlan, searchRecipes } from "../services/api";
import useDebounce from "../hooks/useDebounce";
import useLocalStorage from "../hooks/useLocalStorage";

const MEALS = ["breakfast", "lunch", "dinner"];

const MealPlanner = () => {
    const [startDate] = useLocalStorage("mealPlannerStartDate", new Date());
    const [mealPlan, setMealPlan] = useLocalStorage("mealPlan", {});
    const [dialogState, setDialogState] = useState({ open: false, date: null, meal: "" });
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    const generateMealPlan = useCallback(async () => {
        try {
            const data = await getMealPlan(startDate);
            setMealPlan(data.week);
        } catch (error) {
            console.error("Error fetching meal plan:", error);
        }
    }, [startDate, setMealPlan]);

    useEffect(() => {
        generateMealPlan();
    }, [generateMealPlan]);

    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearchQuery) {
                try {
                    const results = await searchRecipes(debouncedSearchQuery);
                    setSearchResults(results);
                } catch (error) {
                    console.error("Error searching recipes:", error);
                }
            }
        };
        performSearch();
    }, [debouncedSearchQuery]);

    const handleAddMeal = useCallback((date, meal) => setDialogState({ open: true, date, meal }), []);

    const handleCloseDialog = useCallback(() => {
        setDialogState({ open: false, date: null, meal: "" });
        setSearchQuery("");
        setSearchResults([]);
    }, []);

    const handleSelectRecipe = useCallback(
        (recipe) => {
            const { date, meal } = dialogState;
            setMealPlan((prevMealPlan) => {
                const updatedMealPlan = { ...prevMealPlan };
                if (!updatedMealPlan[date]) {
                    updatedMealPlan[date] = { meals: [] };
                }
                updatedMealPlan[date].meals.push({
                    id: recipe.id,
                    title: recipe.title,
                    imageType: recipe.imageType,
                    slot: meal,
                });
                return updatedMealPlan;
            });
            handleCloseDialog();
        },
        [dialogState, setMealPlan, handleCloseDialog]
    );

    const handleRemoveMeal = useCallback(
        (date, mealIndex) => {
            setMealPlan((prevMealPlan) => {
                const updatedMealPlan = { ...prevMealPlan };
                updatedMealPlan[date].meals.splice(mealIndex, 1);
                return updatedMealPlan;
            });
        },
        [setMealPlan]
    );

    const renderMealSection = useCallback(
        (currentDate, meal) => {
            const dayMeals = mealPlan?.[currentDate]?.meals || [];
            const mealItems = dayMeals.filter((m) => m.slot === meal);

            return (
                <div key={meal}>
                    <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
                        {meal.charAt(0).toUpperCase() + meal.slice(1)}
                    </Typography>
                    {mealItems.map((mealItem, mealIndex) => (
                        <div key={mealIndex} style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}>
                            <Typography variant="body2">{mealItem.title}</Typography>
                            <IconButton size="small" onClick={() => handleRemoveMeal(currentDate, mealIndex)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </div>
                    ))}
                    <Button startIcon={<AddIcon />} onClick={() => handleAddMeal(currentDate, meal)} size="small">
                        Add {meal}
                    </Button>
                </div>
            );
        },
        [mealPlan, handleAddMeal, handleRemoveMeal]
    );

    const mealPlanGrid = useMemo(
        () => (
            <Grid container spacing={3} style={{ marginTop: "20px" }}>
                {[...Array(7)].map((_, index) => {
                    const currentDate = startDate + index;
                    return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper elevation={3} style={{ padding: "15px" }}>
                                <Typography variant="h6">{currentDate}</Typography>
                                {MEALS.map((meal) => renderMealSection(currentDate, meal))}
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
        ),
        [startDate, renderMealSection]
    );

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Meal Planner
            </Typography>
            {mealPlanGrid}
            <Dialog open={dialogState.open} onClose={handleCloseDialog}>
                <DialogTitle>Add Meal</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Search Recipes"
                        fullWidth
                        variant="outlined"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchResults.map((recipe) => (
                        <Button
                            key={recipe.id}
                            onClick={() => handleSelectRecipe(recipe)}
                            fullWidth
                            style={{ justifyContent: "flex-start", marginTop: "10px" }}
                        >
                            {recipe.title}
                        </Button>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MealPlanner;
