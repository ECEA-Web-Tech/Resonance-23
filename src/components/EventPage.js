import React from "react";
import { Grid } from "@mui/material";
import EventCard from "./EventCard";

function EventPage({ props }) {
  return (
    <div className="">
      <div className="min-w-full min-h-screen bg-[#2A3033] p-4 pt-32 ">
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
        <h1 className="text-0.5xl sm:text-1xl mb-2 mt-2 sm: mt-12 sm:mb-3 py-8 text-white text-center">
          *For event and workshop details, download the <></>
          <a
            href="/Brouchure.pdf"
            download="event_brouchure.pdf"
            className="underline text-[#1debf4] hover:text-[#12c7d9] transition-all duration-300"
          >
            Event Brouchure
          </a>
        </h1>
      </div>
    </div>
  );
}

export default EventPage;
