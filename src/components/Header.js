import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    InputBase,
    Switch,
    FormControlLabel,
    Menu,
    MenuItem,
    Autocomplete,
    Tooltip,
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MicIcon from "@mui/icons-material/Mic";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ShareIcon from "@mui/icons-material/Share";

const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto",
    },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch",
        },
    },
}));

const Header = ({ darkMode, setDarkMode, onSearch, suggestions }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 300);

        return () => {
            clearTimeout(timerId);
        };
    }, [searchTerm]);

    useEffect(() => {
        if (debouncedSearchTerm) {
            onSearch(debouncedSearchTerm);
        }
    }, [debouncedSearchTerm, onSearch]);

    const handleSearchChange = (event, value) => {
        setSearchTerm(value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleVoiceSearch = () => {
        setIsListening(true);
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearchTerm(transcript);
            setIsListening(false);
            onSearch(transcript);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: "Recipes App",
                text: "Check out this awesome recipes app!",
                url: window.location.href,
            });
        } catch (error) {
            console.error("Error sharing:", error);
        }
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="open drawer"
                    sx={{ mr: 2 }}
                    onClick={handleMenuOpen}
                >
                    <MenuIcon />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    <MenuItem component={Link} to="/" onClick={handleMenuClose}>
                        Home
                    </MenuItem>
                    <MenuItem component={Link} to="/favorites" onClick={handleMenuClose}>
                        Favorites
                    </MenuItem>
                    <MenuItem component={Link} to="/meal-planner" onClick={handleMenuClose}>
                        Meal Planner
                    </MenuItem>
                </Menu>
                <Typography
                    variant="h6"
                    noWrap
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        color: "inherit",
                        display: { xs: "none", sm: "block" },
                    }}
                >
                    Recipes App
                </Typography>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <form onSubmit={handleSearchSubmit}>
                        <Autocomplete
                            freeSolo
                            options={suggestions}
                            renderInput={(params) => (
                                <StyledInputBase
                                    {...params}
                                    placeholder="Search recipes..."
                                    inputProps={{ ...params.inputProps, "aria-label": "search" }}
                                />
                            )}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </form>
                </Search>
                <Tooltip title="Voice search">
                    <IconButton color="inherit" onClick={handleVoiceSearch} disabled={isListening}>
                        <MicIcon />
                    </IconButton>
                </Tooltip>
                <div style={{ flexGrow: 1 }} />
                <Tooltip title="Favorites">
                    <IconButton color="inherit" component={Link} to="/favorites">
                        <FavoriteIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Meal Planner">
                    <IconButton color="inherit" component={Link} to="/meal-planner">
                        <CalendarTodayIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Share">
                    <IconButton color="inherit" onClick={handleShare}>
                        <ShareIcon />
                    </IconButton>
                </Tooltip>
                <FormControlLabel
                    control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} color="default" />}
                    label={darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                />
            </Toolbar>
        </AppBar>
    );
};

export default Header;
