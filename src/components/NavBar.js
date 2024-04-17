import React from "react";
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
  // Pages and Links
  const pages = [
    "Home",
    "Tech Events",
    "Non Tech Events",
    "Workshop",
    "Sponsors",
  ];
  const links = {
    Home: "/",
    "Tech Events": "/techevents",
    "Non Tech Events": "/nontechevents",
    Workshop: "/workshop",
    Sponsors: "/sponsors",
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
      <AppBar position="sticky" color="transparent">
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
              fontFamily: "Title",
              fontWeight: 900,
              letterSpacing: ".3rem",
              color: "#fff",
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
                "& .MuiMenu-paper": { backgroundColor: "#000" },
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <Link to={links[page]}>
                  <MenuItem
                    sx={{ backgroundColor: "#000", fontFamily: "Title" }}
                    key={page}
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
              fontFamily: "Title",
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
              <Link to={links[page]}>
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: "#fff",
                    display: "block",
                    fontSize: "15px",
                    fontFamily: "Title",
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
