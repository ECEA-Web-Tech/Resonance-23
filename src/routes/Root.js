import React from "react";
import NavBar from "../components/NavBar";
import MastHead from "../components/MastHead";
<<<<<<< HEAD
import Resonance from "../components/Resonance";
import OfficeBearers from "../components/OfficeBearers";
import ObDetails from "../utils/ObDetails";
import OsDetails from "../utils/OsDetails";
import JsDetails from "../utils/JsDetails";
=======
import EventDescription from "../components/VisionDescp.js";
import SponsorPage from "../components/SponsorPage";
import { daySponsors } from "../utils/SponsorDetails";
>>>>>>> d04940d (FrontEnd)
import Footer from "../components/Footer.js";
function Root() {
  return (
    <>
      <NavBar />
      <MastHead />
<<<<<<< HEAD
<<<<<<< Updated upstream
      <Resonance />

      {/* Office Bearers */}
      <OfficeBearers ObDetails={ObDetails} title="Office Bearers" />

      {/* Organising Secretaries */}
      <OfficeBearers ObDetails={OsDetails} title="Organising Secretaries" />

      {/* Joint Secretaries */}
      <OfficeBearers ObDetails={JsDetails} title="Joint Secretaries" />
=======
      
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-['Title'] text-yellow-500 my-7 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        SPONSORS
      </h1>
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Sponsor2'] text-yellow-400 my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        DAY SPONSORS
      </h2>
=======
      <EventDescription />

>>>>>>> d04940d (FrontEnd)
      <SponsorPage props={daySponsors} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Sponsor2'] text-yellow-400 my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        EDUCATIONAL PARTNER
      </h2>
      <SponsorPage props={educationSponsor} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Sponsor2'] text-yellow-400 my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        TRAVEL PARTNER
      </h2>
      <SponsorPage props={travelSponsor} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Sponsor2'] text-yellow-400 my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        APPAREL PARTNER
      </h2>
      <SponsorPage props={apparelSponsor} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Sponsor2'] text-yellow-400 my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        FOOD PARTNER
      </h2>
      <SponsorPage props={foodSponsor} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Sponsor2'] text-yellow-400 my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        REFRESHMENT SPONSORS
      </h2>
      <SponsorPage props={refreshmentSponsor} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Sponsor2'] text-yellow-400 my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        PRINTING PARTNERS
      </h2>
      <SponsorPage props={printingSponsor} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Sponsor2'] text-yellow-400 my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        CONSULTANCY PARTNER
      </h2>
      <SponsorPage props={consultancySponsor} />
>>>>>>> Stashed changes
      <Footer/>
    </>
  );
}

export default Root;
