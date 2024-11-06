import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import Logo from "../../src/assets/images/logo.png";
import MenuIcon from "@mui/icons-material/Menu";

function NavBar() {
  // State for scroll position and visibility
  const [lastScrollY, setLastScrollY] = useState(0);
  const [visible, setVisible] = useState(true);

  // Handle scroll events
  const handleScroll = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY === 0) {
        setVisible(true);
      } else {
        setVisible(false);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // Pages and Links
  const pages = [
    "Home",
    "Tech Events",
    "Non Tech Events",
    "Workshop",
    "Sponsors",
    "Accomodation",
    "Other college registration",
  ];
  const links = {
    Home: "/",
    "Tech Events": "/techevents",
    "Non Tech Events": "/nontechevents",
    Workshop: "/workshop",
    Sponsors: "/sponsors",
    Accomodation: "https://forms.gle/oNXT9cocY6ecz5468",
    "Other college registration": "https://forms.gle/ehnxgegheq59398g8",
  };

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" color="transparent" sx={{ display: visible ? "block" : "none" }}>
        <Toolbar>
          <Avatar
            alt="ECEA"
            src={Logo}
            sx={{ display: { xs: "none", md: "block" }, marginRight: "10px" }}
          />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "Navbar",
              fontWeight: 900,
              letterSpacing: ".3rem",
<<<<<<< Updated upstream
              color: "#fff",
=======
              color: "#ffb700",
>>>>>>> Stashed changes
              fontSize: "30px",
              textDecoration: "none",
            }}
          >
            ECEA
          </Typography>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "flex", md: "none" },
            }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "#fff" }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                mt: "1px",
                "& .MuiMenu-paper": { backgroundColor: "#14213D" },
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <Link to={links[page]} key={page}>
                  <MenuItem
                    sx={{
                      backgroundColor: "#14213D",
                      fontFamily: "Navbar",
                      "&:hover": { backgroundColor: "#ffb700" }, // Change background color on hover
                    }}
                    onClick={handleCloseNavMenu}
                  >
                    <Typography
                      sx={{ color: "#fff", fontFamily: "Title" }}
                      textAlign="center"
                    >
                      {page}
                    </Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Avatar
            alt="ECEA"
            src={Logo}
            sx={{ display: { xs: "block", md: "none" }, marginRight: "10px" }}
          />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "Navbar",
              fontWeight: 700,
              fontSize: "30px",
              letterSpacing: ".1rem",
              color: "#fff",
              textDecoration: "none",
            }}
          >
            ECEA'24
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link to={links[page]} key={page}>
                <Button
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "#fff",
                    display: "block",
                    fontSize: "15px",
                    fontFamily: "Navbar",
                    "&:hover": { color: "#ffb700" }, // Change text color on hover
                  }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default NavBar;
