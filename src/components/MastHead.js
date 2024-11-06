import React from "react";
import Background from "../assets/videos/bgslow.mp4";
import { Slide, Fade } from "react-awesome-reveal";
import logo from "../assets/images/eceaWhite.png";
import r25 from "../assets/images/resonance_25.png";

function MastHead() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed inset-0 w-full h-full object-cover"
      >
        <source src={Background} />
      </video>
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 font-bold text-white">
        {r25 && (
          <img
            src={r25}
            alt="Centered display"
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        )}
      </div>

      <div className="relative z-20 bg-grey-800 bg-opacity-40 backdrop-blur-sm rounded-lg p-6 md:p-10 lg:p-16 max-w-4xl text-white flex flex-col items-center md:flex-row md:justify-between space-y-6 md:space-y-0">
        <div className="flex-1 text-center md:text-left md:pr-8">
          <h2 className="text-yellow-500 text-2xl md:text-4xl lg:text-5xl font-bold text-center">
            R E S O N A N C E '2 5
          </h2>
          <p className="text-justify text-0.5xl md:text-1.5xl lg:text-lg leading-relaxed">
            The Electronics and Communication Engineering Association (ECEA) is
            excited to present Resonance '25, our annual intra-college symposium
            that unites students, industry leaders, and researchers in the field
            of Electronics and Communication. This year’s event features
            engaging workshops, technical sessions, and competitions designed to
            inspire and challenge participants. Join us to connect with
            like-minded peers, showcase your skills, and explore the future of
            ECE technology. Let’s resonate with innovation at Resonance '25!
          </p>
        </div>
      </div>
    </div>
  );
}

export default MastHead;
