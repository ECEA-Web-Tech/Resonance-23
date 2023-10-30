import React from "react";
import "../styles/foot.css";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import EmailIcon from "@mui/icons-material/Email";

function Footer() {
  return (
    <div id="footer">
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
              color: "black",
            }}
            fontSize="large"
          />
        </Button>
        <Button href="https://www.linkedin.com/in/ecea-ceg?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app">
          <LinkedInIcon
            className="button"
            sx={{
              color: "black",
            }}
            fontSize="large"
          />
        </Button>
        <Button href="https://instagram.com/ecea_ceg?igshid=OGQ5ZDc2ODk2ZA==">
          <InstagramIcon
            className="button"
            sx={{
              color: "black",
            }}
            fontSize="large"
          />
        </Button>
        <Button href="mailto: ecea2023.24@gmail.com">
          <EmailIcon
            className="button"
            sx={{
              color: "black",
            }}
            fontSize="large"
          />
        </Button>
      </Stack>
      <p className="font-['Title'] mb-2">Developed by:</p>
      <div id="Credits">
        <a
          href="https://www.linkedin.com/in/nirmal-kishore-5a6575202/"
          target="_blank"
        >
          <p className="mr-1">| Nirmal Kishore A |</p>
        </a>
        <a
          href="https://www.linkedin.com/in/dhanush-s-aab849206/"
          target="_blank"
        >
          <p className="mr-1">| Dhanush S |</p>
        </a>
        <a
          href="https://www.linkedin.com/in/harshanand-s-v-2809921bb/"
          target="_blank"
        >
          <p className="mr-1">| Harshanand S V |</p>
        </a>
        <a
          href="https://www.linkedin.com/in/deepak-vasan-ab2ab9203/"
          target="_blank"
        >
          <p className="mr-1">| Deepak Vasan R |</p>
        </a>
      </div>
      <p id="copy" className="font-['Title']">
        Copyright © ECEA
      </p>
    </div>
  );
}

export default Footer;
