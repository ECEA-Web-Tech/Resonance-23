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
          The Electronics and Communication Engineering Association (ECEA) is
          excited to present <strong>Resonance '25</strong>, our annual
          intra-college symposium that unites students, industry leaders, and
          researchers in the field of Electronics and Communication. This year’s
          event features engaging workshops, technical sessions, and
          competitions designed to inspire and challenge participants. Join us
          to connect with like-minded peers, showcase your skills, and explore
          the future of ECE technology. Let’s resonate with innovation at
          <strong> Resonance '25!</strong>
        </Typography>
      </div>
    </div>
  );
};

export default EventDescription;