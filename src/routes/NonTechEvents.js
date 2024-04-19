import React from "react";
import NavBar from "../components/NavBar";
import EventPage from "../components/EventPage";
import NonTech from "../utils/NonTech";
import Footer from "../components/Footer";

function NonTechEvents() {
  return (
    <>
      <NavBar />
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Non Tech Events
      </h1>
      <h1 className="min-h-screen min-w-screen text-2xl md:text-4xl lg:text-5xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Stay Tuned for Event updates !!
      </h1>
      <Footer/>
    </>
  );
}

export default NonTechEvents;
