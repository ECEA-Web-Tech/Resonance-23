import React from "react";
import { Grid } from "@mui/material";
import EventCard from "./EventCard";

function EventPage({ props }) {
  return (
    <div className="">
      <div className="min-w-full min-h-screen p-4">
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
                  <EventCard
                    eventname={detail.eventname}
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

export default EventPage;
