import axios from "axios";

export const API_KEY = "8be8f9112d4f49e8bc35100bb649ce2b";
const BASE_URL = "https://api.spoonacular.com";

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        apiKey: API_KEY,
    },
});

export const getRandomRecipes = async (number = 10) => {
    const response = await api.get("/recipes/random", { params: { number } });
    return response.data.recipes;
};

export const searchRecipes = async (query, offset = 0, number = 10) => {
    const response = await api.get("/recipes/complexSearch", {
        params: { query, offset, number },
    });
    return response.data;
};

export const getRecipeDetails = async (id) => {
    const response = await api.get(`/recipes/${id}/information`);
    return response.data;
};

export const getRecipesByDiet = async (diet, offset = 0, number = 10) => {
    const response = await api.get("/recipes/complexSearch", {
        params: { diet, offset, number },
    });
    return response.data;
};

export const getRecipesByCuisine = async (cuisine, offset = 0, number = 10) => {
    const response = await api.get("/recipes/complexSearch", {
        params: { cuisine, offset, number },
    });
    return response.data;
};

export const autocompleteRecipeSearch = async (query, number = 5) => {
    const response = await api.get("/recipes/autocomplete", {
        params: { query, number },
    });
    return response.data;
};

export const getRecipesByNutrients = async (nutrients, offset = 0, number = 10) => {
    const response = await api.get("/recipes/findByNutrients", {
        params: { ...nutrients, offset, number },
    });
    return response.data;
};

export const getRecipeEquipment = async (id) => {
    const response = await api.get(`/recipes/${id}/equipmentWidget.json`);
    return response.data;
};

export const getRecipeNutrition = async (id) => {
    const response = await api.get(`/recipes/${id}/nutritionWidget.json`);
    return response.data;
};

export const getRecipeInstructions = async (id) => {
    const response = await api.get(`/recipes/${id}/analyzedInstructions`);
    return response.data;
};

export const getSimilarRecipes = async (id, number = 5) => {
    const response = await api.get(`/recipes/${id}/similar`, {
        params: { number },
    });
    return response.data;
};

export const getRecipesByIngredients = async (ingredients, number = 10) => {
    const response = await api.get("/recipes/findByIngredients", {
        params: { ingredients: ingredients.join(","), number },
    });
    return response.data;
};

export const getMealPlan = async (timeFrame, targetCalories, diet, exclude) => {
    const response = await api.get("/mealplanner/generate", {
        params: { timeFrame, targetCalories, diet, exclude },
    });
    return response.data;
};

export const getRecipeRecommendations = async (number = 10) => {
    const response = await api.get("/recipes/random", { params: { number } });
    return response.data.recipes;
};

export const convertUnits = async (ingredientName, sourceAmount, sourceUnit, targetUnit) => {
    const response = await api.get("/recipes/convert", {
        params: { ingredientName, sourceAmount, sourceUnit, targetUnit },
    });
    return response.data;
};

export const getIngredientSubstitutes = async (ingredientName) => {
    const response = await api.get("/food/ingredients/substitutes", {
        params: { ingredientName },
    });
    return response.data;
};

export const getFavoriteRecipes = async (ids) => {
    const response = await api.get("/recipes/informationBulk", {
        params: { ids: ids.join(",") },
    });
    return response.data;
};

export const getRecipesByFilters = async (filters, offset = 0, number = 10) => {
    const response = await api.get("/recipes/complexSearch", {
        params: { ...filters, offset, number },
    });
    return response.data;
};

export const getNutritionalInformationBreakdown = async (id) => {
    const response = await api.get(`/recipes/${id}/nutritionWidget.json`);
    return response.data;
};

export const getRecipeReviews = async (id) => {
    const response = await api.get(`/recipes/${id}/reviews`);
    return response.data;
};

export const submitRecipeReview = async (id, review) => {
    const response = await api.post(`/recipes/${id}/reviews`, review);
    return response.data;
};
