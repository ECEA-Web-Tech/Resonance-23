import React from "react";
import "../styles/foot.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import  YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";

function Footer() {
  return (
    <div  id="footer">
      <h1>ECEA</h1>
      <Stack
        direction={"row"}
        alignItems={"centre"}
        spacing={1}
        className="buttons"
      >
        <Button href="https://youtube.com/@ecea_ceg?si=Uw8SKyjaOQNtK-jz">
          <YouTubeIcon
            className="button"
            sx={{
              color: "white",
            }}
          />
        </Button>
        <Button href="https://www.linkedin.com/in/ecea-ceg?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">
          <LinkedInIcon
            className="button"
            sx={{
              color: "white",
            }}
          />
        </Button>
        <Button href="https://instagram.com/ecea_ceg?igshid=OGQ5ZDc2ODk2ZA==">
          <InstagramIcon
            className="button"
            sx={{
              color: "white",
            }}
          />
        </Button>
        <Button href="mailto:ecea2023.24@gmail.com.com">
          <EmailIcon
            className="button"
            sx={{
              color: "white",
            }}
          />
        </Button>
      </Stack>
      <p>© Copyright ECEA</p>
    </div>
  );
}

export default Footer;
