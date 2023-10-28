import React from "react";
import Background from "../assets/videos/background.mp4";
import { Slide, Fade } from "react-awesome-reveal";
import logo from "../assets/images/resonanceLogo.png";

function MastHead() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute w-full h-full object-cover"
      >
        <source src={Background} />
      </video>
      <div className="p-12 font-bold z-10 text-white flex flex-col items-center">
        <img src={logo} style={{ height: 300, width: 300 }} />
        <Fade>
          <h2 className=" font-['Title'] tracking-wide text-center">
            ECEA presents
          </h2>
        </Fade>
        <h1 className="mb-6 text-4xl sm:text-6xl md:text-8xl tracking-wide font-['Title']">
          <Fade triggerOnce={true} cascade duration={200}>
            Resonance '24
          </Fade>
        </h1>
      </div>
    </div>
  );
}

export default MastHead;
