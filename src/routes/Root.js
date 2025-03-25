import React from "react";
import NavBar from "../components/NavBar";
import MastHead from "../components/MastHead";
import EventDescription from "../components/VisionDescp.js";
import SponsorPage from "../components/SponsorPage";
import { daySponsors } from "../utils/SponsorDetails";
import Footer from "../components/Footer.js";
function Root() {
  return (
    <>
      <NavBar />
      <MastHead />
      <EventDescription />
      <SponsorPage props={daySponsors} />

      <Footer />
    </>
  );
}

export default Root;
