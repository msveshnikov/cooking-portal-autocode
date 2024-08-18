import axios from "axios";

const API_KEY = "8be8f9112d4f49e8bc35100bb649ce2b";
const BASE_URL = "https://api.spoonacular.com";

const api = axios.create({
    baseURL: BASE_URL,
    params: {
        apiKey: API_KEY,
    },
});

export const getRandomRecipes = async (number = 10) => {
    try {
        const response = await api.get("/recipes/random", {
            params: { number },
        });
        return response.data.recipes;
    } catch (error) {
        throw error;
    }
};

export const searchRecipes = async (query, offset = 0, number = 10) => {
    try {
        const response = await api.get("/recipes/complexSearch", {
            params: { query, offset, number },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRecipeDetails = async (id) => {
    try {
        const response = await api.get(`/recipes/${id}/information`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRecipesByDiet = async (diet, offset = 0, number = 10) => {
    try {
        const response = await api.get("/recipes/complexSearch", {
            params: { diet, offset, number },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRecipesByCuisine = async (cuisine, offset = 0, number = 10) => {
    try {
        const response = await api.get("/recipes/complexSearch", {
            params: { cuisine, offset, number },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const autocompleteRecipeSearch = async (query, number = 5) => {
    try {
        const response = await api.get("/recipes/autocomplete", {
            params: { query, number },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRecipesByNutrients = async (nutrients, offset = 0, number = 10) => {
    try {
        const response = await api.get("/recipes/findByNutrients", {
            params: { ...nutrients, offset, number },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRecipeEquipment = async (id) => {
    try {
        const response = await api.get(`/recipes/${id}/equipmentWidget.json`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRecipeNutrition = async (id) => {
    try {
        const response = await api.get(`/recipes/${id}/nutritionWidget.json`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRecipeInstructions = async (id) => {
    try {
        const response = await api.get(`/recipes/${id}/analyzedInstructions`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSimilarRecipes = async (id, number = 5) => {
    try {
        const response = await api.get(`/recipes/${id}/similar`, {
            params: { number },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getRecipesByIngredients = async (ingredients, number = 10) => {
    try {
        const response = await api.get("/recipes/findByIngredients", {
            params: { ingredients: ingredients.join(","), number },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};