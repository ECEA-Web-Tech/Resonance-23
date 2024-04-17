import React from "react";
import { Grid } from "@mui/material";
import SponsorCard from "./SponsorCard";

function SponsorPage({ props }) {
  return (
    <div>
      <div className="min-w-full h-fit">
        <Grid
          container
          columnSpacing={10}
          rowSpacing={2}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {props.map((detail) => {
            return (
              <>
                <Grid width={350} height={350} item>
                  <SponsorCard
                    eventname={detail.name}
                    image={detail.image}
                    link={detail.link}
                  />
                </Grid>
              </>
            );
          })}
        </Grid>
      </div>
    </div>
  );
}

export default SponsorPage;
