import React, { useState } from "react";
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
} from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

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

const Header = ({ darkMode, setDarkMode, onSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [anchorEl, setAnchorEl] = useState(null);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
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
                </Menu>
                <Typography
                    variant="h6"
                    noWrap
                    component={Link}
                    to="/"
                    sx={{ textDecoration: "none", color: "inherit", display: { xs: "none", sm: "block" } }}
                >
                    Recipes App
                </Typography>
                <Search>
                    <SearchIconWrapper>
                        <SearchIcon />
                    </SearchIconWrapper>
                    <form onSubmit={handleSearchSubmit}>
                        <StyledInputBase
                            placeholder="Search recipes..."
                            inputProps={{ "aria-label": "search" }}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </form>
                </Search>
                <div style={{ flexGrow: 1 }} />
                <FormControlLabel
                    control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} color="default" />}
                    label={darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                />
            </Toolbar>
        </AppBar>
    );
};

export default Header;
