import React from "react";
import ObCard from "./ObCard";
import { Grid } from "@mui/material";

function OfficeBearers({ ObDetails, title }) {
  return (
    <div className="">
      <h1 className="text-6xl mt-5 mb-10 text-white text-center drop-shadow-[0_5px_5px_rgba(240,240,240,0.5)] font-['Title'] font-bold">
        {title}
      </h1>
      <div className="min-w-full p-4">
        <Grid
          container
          columnSpacing={10}
          rowSpacing={2}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {ObDetails.map((detail) => {
            return (
              <>
                <Grid width={350} item>
                  <ObCard
                    name={detail.name}
                    designation={detail.designation}
                    photo={detail.photo}
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

export default OfficeBearers;
