import React, { useState, useEffect, useCallback } from "react";
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
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { format, addDays } from "date-fns";
import axios from "axios";
import { API_KEY } from "../services/api";

const MealPlanner = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [mealPlan, setMealPlan] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedMeal, setSelectedMeal] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const generateMealPlan = useCallback(async () => {
        try {
            const response = await axios.get(`https://api.spoonacular.com/mealplanner/generate`, {
                params: {
                    apiKey: API_KEY,
                    timeFrame: "week",
                    startDate: format(startDate, "yyyy-MM-dd"),
                },
            });
            setMealPlan(response.data.week);
        } catch (error) {
            console.error("Error fetching meal plan:", error);
        }
    }, [startDate]);

    useEffect(() => {
        generateMealPlan();
    }, [generateMealPlan]);

    const handleAddMeal = (date, meal) => {
        setSelectedDate(date);
        setSelectedMeal(meal);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSearchQuery("");
        setSearchResults([]);
    };

    const handleSearchRecipes = async () => {
        try {
            const response = await axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
                params: {
                    apiKey: API_KEY,
                    query: searchQuery,
                    number: 5,
                },
            });
            setSearchResults(response.data.results);
        } catch (error) {
            console.error("Error searching recipes:", error);
        }
    };

    const handleSelectRecipe = (recipe) => {
        const updatedMealPlan = { ...mealPlan };
        const dayKey = format(selectedDate, "yyyy-MM-dd");
        if (!updatedMealPlan[dayKey]) {
            updatedMealPlan[dayKey] = { meals: [] };
        }
        updatedMealPlan[dayKey].meals.push({
            id: recipe.id,
            title: recipe.title,
            imageType: recipe.imageType,
            slot: selectedMeal,
        });
        setMealPlan(updatedMealPlan);
        handleCloseDialog();
    };

    const handleRemoveMeal = (date, mealIndex) => {
        const updatedMealPlan = { ...mealPlan };
        const dayKey = format(date, "yyyy-MM-dd");
        updatedMealPlan[dayKey].meals.splice(mealIndex, 1);
        setMealPlan(updatedMealPlan);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
                Meal Planner
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <Grid container spacing={3} style={{ marginTop: "20px" }}>
                {[...Array(7)].map((_, index) => {
                    const currentDate = addDays(startDate, index);
                    const dayKey = format(currentDate, "yyyy-MM-dd");
                    const dayMeals = mealPlan[dayKey]?.meals || [];

                    return (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Paper elevation={3} style={{ padding: "15px" }}>
                                <Typography variant="h6">{format(currentDate, "EEEE, MMM d")}</Typography>
                                {["breakfast", "lunch", "dinner"].map((meal) => (
                                    <div key={meal}>
                                        <Typography variant="subtitle1" style={{ marginTop: "10px" }}>
                                            {meal.charAt(0).toUpperCase() + meal.slice(1)}
                                        </Typography>
                                        {dayMeals
                                            .filter((m) => m.slot === meal)
                                            .map((mealItem, mealIndex) => (
                                                <div
                                                    key={mealIndex}
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        marginBottom: "5px",
                                                    }}
                                                >
                                                    <Typography variant="body2">{mealItem.title}</Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleRemoveMeal(currentDate, mealIndex)}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </div>
                                            ))}
                                        <Button
                                            startIcon={<AddIcon />}
                                            onClick={() => handleAddMeal(currentDate, meal)}
                                            size="small"
                                        >
                                            Add {meal}
                                        </Button>
                                    </div>
                                ))}
                            </Paper>
                        </Grid>
                    );
                })}
            </Grid>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
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
                    <Button onClick={handleSearchRecipes} variant="contained" style={{ marginTop: "10px" }}>
                        Search
                    </Button>
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
