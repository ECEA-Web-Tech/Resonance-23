import React from "react";
import Background from "../assets/videos/bgslow.mp4";
import { Slide, Fade } from "react-awesome-reveal";
import logo from "../assets/images/eceaWhite.png";
import r25 from "../assets/images/resonance_25.png"
function MastHead() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed w-full h-full object-cover"
      >
        <source src={Background} />
      </video>
      <div className="flex items-center justify-center p-4 font-bold z-10 text-white">
      {r25 && (
        <img
          src={r25}
          alt="Centered display"
          className="max-h-[90vh] max-w-[90vw] object-contain"
        />
      )}
       </div>
    </div>
  );
}

export default MastHead;

