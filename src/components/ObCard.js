import React from "react";
import Button from "@mui/material/Button";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import "../styles/obcard.css";

function ObCard({ name, designation, photo,instagram,linkedin }) {
  return (
    <div className="Container">
      <img src={photo} />
      <div className="Title text-center font-['Title'] ">
        <h2 style={{ fontSize: '22px' }} className="mb-2">{name}</h2>
        <h3 className="text-1xl text-gray-400">{designation}</h3>
        <div>
        <Button href={instagram}>
          <InstagramIcon
            className="button"
            sx={{
              color: "black",
            }}
            fontSize="large"
          />
        </Button>
        <Button href={linkedin}>
          <LinkedInIcon
            className="button"
            sx={{
              color: "black",
            }}
            fontSize="large"
          />
        </Button>
        </div>
      </div>
    </div>
  );
}

export default ObCard;
