import React from "react";
import Typography from "@mui/material/Typography";
import v25White from "../assets/images/visionWhite.svg"; // Vision '25 logo

const EventDescription = () => {
  return (
    <div className="relative z-10 bg-[#22d3ee] text-black py-20 px-6 md:px-16 lg:px-24 flex flex-row gap-10 items-center">
      <div className="relative hidden md:flex">
        <img
          src={v25White}
          alt="Vision 25 Logo"
          className="relative inset-0 m-auto min-w-[140px] w-[70%] max-w-[50%] h-auto"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="max-w-5xl mx-auto">
        <Typography
          sx={{
            fontSize: {
              xs: "0.9rem",
              sm: "1rem",
              md: "1.1rem",
              lg: "1.2rem",
            },
            fontWeight: "500",
            textAlign: "justify",
          }}
        >
          The Electronics and Communication Engineering Association (ECEA)
          proudly presents Vision '25, our flagship national-level inter-college
          symposium that brings together students, industry professionals, and
          researchers from across the country. This year’s edition promises an
          exciting lineup of cutting-edge workshops, technical sessions, and
          thrilling competitions designed to push the boundaries of innovation
          in Electronics and Communication Engineering.
        </Typography>
      </div>
    </div>
  );
};

export default EventDescription;
