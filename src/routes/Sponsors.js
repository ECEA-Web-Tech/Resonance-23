import React from "react";
import NavBar from "../components/NavBar";
import SponsorPage from "../components/SponsorPage";
import daySponsors from "../utils/SponsorDetails";
function Sponsors() {
  return (
    <div>
      <NavBar />
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Sponsors
      </h1>
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Day Sponsors
      </h2>
      <SponsorPage props={daySponsors} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Title'] text-white  text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Refreshment Sponsors
      </h2>
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Printing Partners
      </h2>
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Consultancy Partner
      </h2>
    </div>
  );
}

export default Sponsors;
