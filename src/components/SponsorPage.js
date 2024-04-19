import React from "react";
import { Grid } from "@mui/material";
import SponsorCard from "./SponsorCard";
import "../styles/obcard.css"

function SponsorPage({ props }) {
  return (
    <div className="SponsorGridContainer">
      {
        props.map((sponsor) => {
          return <SponsorCard eventname={sponsor.name} image={sponsor.image} link={sponsor.link} />
        })
      }
    </div>
  );
}

export default SponsorPage;
