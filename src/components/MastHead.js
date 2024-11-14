import React from "react";
import Background from "../assets/videos/bg-5.mp4";
import logo from "../assets/images/eceaWhite.png";
import r25 from "../assets/images/resonance_25.png";
import {Typography}  from "@mui/material";
function MastHead() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover"
      >
        <source src={Background} />
      </video>
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center font-bold text-white">
        {r25 && (
          <div className="flex flex-col items-center">
            <img
              src={r25}
              alt="Centered display"
              className="h-72 md:w-72 md:h-72 lg:w-96 lg:h-96 object-contain" // Updated size with object-contain
            />
            <h2 className="text-yellow-500 text-lg md:text-2xl lg:text-3xl mt-5 ">
              NOVEMBER 16<sup>th</sup> & 17<sup>th</sup>
            </h2>
          </div>
        )}
      </div>
      <div className="relative z-20 bg-grey-800 bg-opacity-40 backdrop-blur-sm rounded-lg p-6 md:p-10 lg:p-16 max-w-4xl text-white flex flex-col items-center md:flex-row md:justify-between space-y-6 md:space-y-0">
        <div className="flex-1 text-center md:text-left md:pr-8">
          <p className=" bg-black rounded-xl p-10 max-w-4xl bg-opacity-40 backdrop-blur-sm shadow-lg text-md md:text-lg lg:text-xl font-normal leading-relaxed text-white text-center ">
          <Typography
                  sx={{
                    fontSize: {
                      xs: "0.7rem", // small screens
                      sm: "0.9rem", // medium screens
                      md: "1rem", // large screens
                      lg: "1.2rem",
                      textAlign: "center",
                      fontWeight: "700",
                    },}}
                >
            The Electronics and Communication Engineering Association (ECEA) is
            excited to present Resonance '25, our annual intra-college symposium
            that unites students, industry leaders, and researchers in the field
            of Electronics and Communication. This year’s event features
            engaging workshops, technical sessions, and competitions designed to
            inspire and challenge participants. Join us to connect with
            like-minded peers, showcase your skills, and explore the future of
            ECE technology. Let’s resonate with innovation at Resonance '25!
            </Typography>
          </p>
        </div>
      </div>
    </div>
  );
}

export default MastHead;
