import React from "react";
import NavBar from "../components/NavBar";
import EventPage from "../components/EventPage";
import Tech from "../utils/Tech";
import Footer from "../components/Footer";
import bgLayer1 from "../assets/images/log.jpg"; // Dark background

function TechEvents() {
  return (
    <>
      <NavBar />
      <div className="absolute inset-0 w-full h-full max-w-[1920px] mx-auto -z-10">
        <img
          src={bgLayer1}
          alt="Background Dark"
          className="w-full h-full object-cover"
        />
      </div>
      <EventPage props={Tech} />
      <Footer />
    </>
  );
}

export default TechEvents;
