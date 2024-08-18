import React, { useState, useEffect } from "react";
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Rating,
    TextField,
    Button,
    CircularProgress,
} from "@mui/material";
import { styled } from "@mui/system";

const StyledCard = styled(Card)(({ theme }) => ({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
        transform: "scale(1.05)",
    },
}));

const UserReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
        name: "",
        rating: 0,
        comment: "",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            // Simulating API call
            const response = await new Promise((resolve) =>
                setTimeout(
                    () =>
                        resolve([
                            { id: 1, name: "John Doe", rating: 4, comment: "Great recipes!" },
                            {
                                id: 2,
                                name: "Jane Smith",
                                rating: 5,
                                comment: "Love the meal planning feature!",
                            },
                            {
                                id: 3,
                                name: "Bob Johnson",
                                rating: 3,
                                comment: "Good variety, but could use more vegetarian options.",
                            },
                        ]),
                    1000
                )
            );
            setReviews(response);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            setLoading(false);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewReview((prev) => ({ ...prev, [name]: value }));
    };

    const handleRatingChange = (event, newValue) => {
        setNewReview((prev) => ({ ...prev, rating: newValue }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            // Simulating API call
            const response = await new Promise((resolve) =>
                setTimeout(
                    () =>
                        resolve({
                            id: reviews.length + 1,
                            ...newReview,
                        }),
                    1000
                )
            );
            setReviews((prev) => [...prev, response]);
            setNewReview({ name: "", rating: 0, comment: "" });
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                User Reviews
            </Typography>
            <Grid container spacing={3}>
                {reviews.map((review) => (
                    <Grid item xs={12} sm={6} md={4} key={review.id}>
                        <StyledCard>
                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                    <Avatar sx={{ mr: 2 }}>{review.name[0]}</Avatar>
                                    <Typography variant="h6">{review.name}</Typography>
                                </Box>
                                <Rating value={review.rating} readOnly />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    {review.comment}
                                </Typography>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Add a Review
                </Typography>
                <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={newReview.name}
                    onChange={handleInputChange}
                    margin="normal"
                    required
                />
                <Box sx={{ my: 2 }}>
                    <Typography component="legend">Rating</Typography>
                    <Rating name="rating" value={newReview.rating} onChange={handleRatingChange} />
                </Box>
                <TextField
                    fullWidth
                    label="Comment"
                    name="comment"
                    value={newReview.comment}
                    onChange={handleInputChange}
                    margin="normal"
                    multiline
                    rows={4}
                    required
                />
                <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                    Submit Review
                </Button>
            </Box>
        </Box>
    );
};

export default UserReviews;
