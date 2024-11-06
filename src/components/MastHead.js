import React from "react";
<<<<<<< Updated upstream
import Background from "../assets/videos/background.mp4";
import { Slide, Fade } from "react-awesome-reveal";
import logo from "../assets/images/visionLogo.png";
=======
import Background from "../assets/videos/bg2.mp4";
import { Slide, Fade } from "react-awesome-reveal";
import r25 from "../assets/images/resonance_25lss.png"
import '../styles/rotate.css'
>>>>>>> Stashed changes

function MastHead() {
  return (
    <>

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
<<<<<<< Updated upstream
        className="absolute w-full h-full object-cover"
      >
        <source src={Background} />
      </video>
      <div className="p-12 font-bold z-10 text-white flex flex-col items-center">
        <img src={logo} style={{ height: 400, width: 400 }} />
        <Fade>
          <h2 className=" font-['Title'] tracking-wide text-center">
            ECEA presents
          </h2>
        </Fade>
        <h1 className="mb-6 text-4xl sm:text-6xl md:text-8xl tracking-wide font-['MainTitle']">
          <Fade triggerOnce={true} cascade duration={200}>
            Vision '24
          </Fade>
        </h1>
=======
        className=" fixed w-full h-full object-cover " // Ensure video is full screen and behind everything
      >
        <source src={Background} />
      </video>
  
      {/* Overlay Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center font-sans px-4">
        
        {/* Semi-transparent Text Box */}
        <div className="bg-grey-950 bg-opacity-40 backdrop-blur-sm rounded-lg p-6 md:p-10 lg:p-16 max-w-4xl text-white flex flex-col items-center md:flex-row md:justify-between space-y-6 md:space-y-0">
  
          {/* Logo Section for Small Screens (Centered Above Text) and Side for Larger Screens */}
          <div className="flex-shrink-0 mb-4 md:mb-0 md:ml-8 md:order-2">
            <img src={r25} alt="ECEA Logo" className="rotating-image sh-24 md:h-60 lg:h-70" />
          </div>
  
          {/* Text Section */}
          <div className="flex-1 text-center md:text-left md:pr-8 md:order-1">
            <h2 className="text-yellow-500 text-2xl md:text-4xl lg:text-5xl font-bold text-center">
              R E S O N A N C E '2 5
            </h2>
            <p className="text-justify text-0.5xl md:text-1.5xl lg:text-lg leading-relaxed">
              The Electronics and Communication Engineering Association (ECEA) is excited to present Resonance '25,
              our annual intra college symposium that unites students, industry leaders, and researchers in the field of
              Electronics and Communication. This year’s event features engaging workshops, technical sessions, and
              competitions designed to inspire and challenge participants. Join us to connect with like-minded peers,
              showcase your skills, and explore the future of ECE technology. Let’s resonate with innovation
              at Resonance '25!
            </p>
          </div>
  
        </div>
>>>>>>> Stashed changes
      </div>
    </>
  );
}
export default MastHead;
