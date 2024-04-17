import React from "react";
import "../styles/obcard.css";
import { Button } from "@mui/material";

function SponsorCard({ eventname, image, link }) {
  return (
    <div className="my-5">
      <div className="SponsorContainer">
        <img
          src={image}
          onClick={() => {
            window.location = link;
          }}
        />
      </div>
      <div className="SponsorTitle">
        <p className="text-1xl md:text-3xl lg:text-4xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
          {eventname}
        </p>
      </div>
    </div>
  );
}

export default SponsorCard;
