import React from "react";
import "../styles/foot.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";


function Footer() {
  const handleclick = () => {
    window.open(
      "https://mail.google.com/mail/?view=cm&fs=1&to=ecea24.25@gmail.com",
      "_blank"
    );
  };

  return (
    <div
      style={{ position: "relative", zIndex: 10, backgroundColor: "#474e52" }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: -1,
        }}
      />
      <div
        id="footer"
        style={{
          padding: "20px",
          boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Stack
          direction={"row"}
          alignItems={"center"}
          spacing={1}
          className="buttons"
        >
          <Button href="https://maps.app.goo.gl/4NTQQrSeXyeDsVaj9" target="_blank"
            rel="noopener noreferrer">
            <LocationOnIcon
              className="button"
              sx={{ color: "cyan" }}
              fontSize="large"
            />
          </Button>
          <Button href="https://youtube.com/@ecea_ceg?si=Uw8SKyjaOQNtK-jz" target="_blank"
            rel="noopener noreferrer">
            <YouTubeIcon
              className="button"
              sx={{ color: "cyan" }}
              fontSize="large"
            />
          </Button>
          <Button href="https://www.linkedin.com/in/ecea-ceg?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank"
            rel="noopener noreferrer">
            <LinkedInIcon
              className="button"
              sx={{ color: "cyan" }}
              fontSize="large"
            />
          </Button>
          <Button href="https://instagram.com/ecea_ceg?igshid=OGQ5ZDc2ODk2ZA==" target="_blank"
            rel="noopener noreferrer">
            <InstagramIcon
              className="button"
              sx={{ color: "cyan" }}
              fontSize="large"
            />
          </Button>
          <Button onClick={handleclick}>
            <EmailIcon
              className="button"
              sx={{ color: "cyan" }}
              fontSize="large"
            />
          </Button>
        </Stack>
        <p className="font-['Title'] mb-2">Developed by:</p>
        <div id="Credits">
          <a
            href="https://www.linkedin.com/in/abinaya-boopathy-958183280/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="mr-1">| Abinaya B </p>
          </a>
          <a
            href="https://www.linkedin.com/in/john-felix-14001a244/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="mr-1">| John Felix A </p>
          </a>
          <a
            href="https://www.linkedin.com/in/saravanan-d-07586422a/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="mr-1">| Saravanan D </p>
          </a>
          <a href="https://www.linkedin.com/in/siva-rv-ece/" 
          target="_blank"
          rel="noopener noreferrer"
          >
            <p className="mr-1">| Siva Kumar RV |</p>
          </a>
        </div>
        <p id="copy" className="font-['Title']">
          Copyright © ECEA
        </p>
      </div>
    </div>
  );
}

export default Footer;