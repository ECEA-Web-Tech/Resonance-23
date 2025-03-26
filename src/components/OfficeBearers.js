import React from "react";
import ObCard from "./ObCard";
import { Grid } from "@mui/material";

function OfficeBearers({ ObDetails, title }) {
  return (
    <div className="bg-[#2a3033] pb-32">
      <h1 className="text-5xl mb-20 sm:mb-32 py-8 text-black text-center bg-[#1debf4] font-['Title'] font-bold">
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
                    instagram={detail.instagram}
                    linkedin={detail.linkedin}
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
