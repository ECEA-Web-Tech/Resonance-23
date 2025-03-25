import { useState, useEffect } from "react";
import React from "react";
import bgLayer1 from "../assets/images/landingPageBg1.png"; // Dark background
import bgLayer2 from "../assets/images/circle.png"; // Circle
import bgLayer3 from "../assets/images/landingPageTop.png";
import v25 from "../assets/images/z_logo.svg"; // Vision '25 logo

const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = targetDate - new Date();
    if (difference > 0) {
      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-4 md:gap-6 justify-center md:justify-start w-full">
      {["DAYS", "HOURS", "MINUTES", "SECONDS"].map((label, index) => {
        const timeValue = [timeLeft.days, timeLeft.hours, timeLeft.minutes, timeLeft.seconds][index];
        return (
          <div
            key={index}
            className="flex flex-col items-center p-4 md:p-6 bg-gray-800 bg-opacity-60 rounded-md shadow-lg w-20 md:w-28 lg:w-30"
          >
            <p className="text-4xl md:text-5xl lg:text-6xl text-cyan-400 font-extrabold">
              {timeValue}
            </p>
            <p className="text-xs md:text-sm lg:text-lg">{label}</p>
          </div>
        );
      })}
    </div>
  );
};

const MastHead = () => {
  const targetDate = new Date("2025-04-04T16:00:00");

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
          <CountdownTimer targetDate={targetDate} />
          <p className="sm:pl-4 mt-4 text-lg md:text-xl lg:text-2xl text-white-400 font-semibold">
            APRIL 4, 5 & 6
          </p>
          <button onClick={() => window.location.href='/Vision-ID'} className="ml-2 mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold text-lg rounded-lg transition duration-300">
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
        </div>
      </div>

      {/* Event Description - Stays Below */}
    </div>
  );
};

export default MastHead;
