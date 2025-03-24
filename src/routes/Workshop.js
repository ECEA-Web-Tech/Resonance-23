import React from "react";
import NavBar from "../components/NavBar";
import EventPage from "../components/EventPage";
import WorkshopDetails from "../utils/WorkshopDetails";
import Footer from "../components/Footer";
<<<<<<< HEAD
import bg from "../assets/videos/bg.mp4";
=======
import bgLayer1 from "../assets/images/z_bg.png"; // Dark background
>>>>>>> d04940d (FrontEnd)

function Workshop() {
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
      <EventPage props={WorkshopDetails} />
      <Footer />
    </>
  );
}

export default Workshop;
