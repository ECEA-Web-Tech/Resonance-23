import React from "react";
import NavBar from "../components/NavBar";
import EventPage from "../components/EventPage";
import WorkshopDetails from "../utils/WorkshopDetails";
import Footer from "../components/Footer";
function Workshop() {
  return (
    <>
      <NavBar />
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Workshops
      </h1>
      <EventPage props={WorkshopDetails}/>
      <Footer/>
    </>
  );
}

export default Workshop;
