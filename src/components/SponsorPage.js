import React from "react";
import { Grid } from "@mui/material";
import SponsorCard from "./SponsorCard";
import "../styles/obcard.css";

function SponsorPage({ props }) {
  return (
    <div className="bg-[#2a3033] py-20">
      <h1 className="text-1xl md:text-3xl lg:text-4xl font-['Title'] mb-10 text-white text-center font-bold">
        SPONSORS
      </h1>
      <div className="SponsorGridContainer">
        {props.map((sponsor) => {
          return (
            <SponsorCard
              eventname={sponsor.name}
              image={sponsor.image}
              link={sponsor.link}
            />
          );
        })}
      </div>
    </div>
  );
}

export default SponsorPage;
