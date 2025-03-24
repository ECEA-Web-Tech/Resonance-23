import React from "react";
<<<<<<< HEAD
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
  
=======
import bgLayer1 from "../assets/images/landingPageBg1.png"; // Dark background
import bgLayer2 from "../assets/images/circle.png"; // Circle
import bgLayer3 from "../assets/images/landingPageTop.png";
import v25 from "../assets/images/z_logo.svg"; // Vision '25 logo

const CountdownTimer = () => (
  <div className="flex flex-wrap lg:flex-nowrap gap-4 md:gap-6 justify-center md:justify-start w-full">
    {["DAYS", "HOURS", "MINUTES", "SECONDS"].map((label, index) => (
      <div
        key={index}
        className="flex flex-col items-center p-4 md:p-6 bg-gray-800 bg-opacity-60 rounded-md shadow-lg w-20 md:w-28 lg:w-30"
      >
        <p className="text-4xl md:text-5xl lg:text-6xl text-cyan-400 font-extrabold">
          22
        </p>
        <p className="text-xs md:text-sm lg:text-lg">{label}</p>
      </div>
    ))}
  </div>
);

const MastHead = () => {
  return (
    <div className="relative h-screen flex flex-col justify-center items-center text-white font-bold">
      {/* Background */}
      <div className="absolute inset-0 w-full h-full max-w-[1920px] mx-auto -z-10">
        <img
          src={bgLayer1}
          alt="Background Dark"
          className="w-full h-full object-cover"
        />
        <img
          src={bgLayer3}
          alt="Background Dark"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content Section - Full Vertical Centering */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-center w-full px-4 mt-16 sm:mt-40 md:px-16 lg:px-24 md:gap-10">
        {/* Left: Countdown Timer */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left gap-10">
          <h1 className="sm:pl-4 text-5xl md:text-6xl lg:text-7xl font-extrabold text-white-400 mt-4 sm:mb-4 sm:mt-0" >
            VISION'25
          </h1>
          <CountdownTimer />
          <p className="sm:pl-4 mt-4 text-lg md:text-xl lg:text-2xl text-white-400 font-semibold">
            APRIL 4, 5 & 6
          </p>
          <button className="ml-2 mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg rounded-lg transition duration-300">
            Login
          </button>
        </div>

        {/* Right: Circle with Logo - Centered */}
        <div className="w-full md:w-1/2 flex justify-center items-center relative">
          <div className="relative w-[80%] sm:w-[65%] max-w-[1000px] h-auto flex justify-center">
            <img
              src={bgLayer2}
              alt="Circle with Logo"
              className="w-full h-auto"
            />
            <img
              src={v25}
              alt="Vision 25 Logo"
              className="absolute inset-0 m-auto w-[40%] max-w-[50%] h-auto"
              style={{ objectFit: "contain" }}
            />
          </div>
>>>>>>> d04940d (FrontEnd)
        </div>
>>>>>>> Stashed changes
      </div>
<<<<<<< HEAD
    </>
  );
}
=======

      {/* Event Description - Stays Below */}
    </div>
  );
};

>>>>>>> d04940d (FrontEnd)
export default MastHead;
