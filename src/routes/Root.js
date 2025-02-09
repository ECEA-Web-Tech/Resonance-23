import React from "react";
import NavBar from "../components/NavBar";
import MastHead from "../components/MastHead";
import Resonance from "../components/Resonance";
import SponsorPage from "../components/SponsorPage";
import { daySponsors } from "../utils/SponsorDetails";
import Footer from "../components/Footer.js";
function Root() {
  return (
    <>
      <NavBar />
      <MastHead />

      <h1 className="text-2xl md:text-4xl lg:text-5xl font-['Title'] text-white my-7 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Sponsors
      </h1>

      <SponsorPage props={daySponsors} />

      <Footer />
    </>
  );
}

export default Root;
