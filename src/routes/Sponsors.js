import React from "react";
import NavBar from "../components/NavBar";
import SponsorPage from "../components/SponsorPage";
import Footer from "../components/Footer"
import { daySponsors, refreshmentSponsors, apparelSponsor, consultancySponsor, printingSponsor, travelSponsor, educationSponsor } from "../utils/SponsorDetails";

function Sponsors() {
  return (
    <div>
      <NavBar />
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-['Title'] text-white my-7 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Sponsors
      </h1>
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Day Sponsors
      </h2>
      <SponsorPage props={daySponsors}/>
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Educational Partner 
      </h2>
      <SponsorPage props={educationSponsor} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Travel Partner 
      </h2>
      <SponsorPage props={travelSponsor} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Apparel Partner
      </h2>
      <SponsorPage props={apparelSponsor} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Refreshment Partners
      </h2>
      <SponsorPage props={refreshmentSponsors} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Printing Partners
      </h2>
      <SponsorPage props={printingSponsor} />
      <h2 className="text-1xl md:text-3xl lg:text-4xl font-['Title'] text-white my-5 text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
        Consultancy Partner
      </h2>
      <SponsorPage props={consultancySponsor} />
      <Footer />
    </div>
  );
}

export default Sponsors;
