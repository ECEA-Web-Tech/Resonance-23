import React from "react";
import "../styles/obcard.css";

function SponsorCard({ eventname, image, link }) {
  return (
    <div className="SponsorContainer flex justify-center items-center">
      <div className="SponsorImageContainer ">
        <img
          src={image}
          alt="sponsorLogo"
          onClick={() => {
            window.open(link, "_blank").focus();
          }}
        />
      </div>
      <div className="SponsorTitle">
        <p className="text-1xl md:text-1xl lg:text-2xl my-5 font-['Title'] text-white text-center font-bold">
          {eventname}
        </p>
      </div>
    </div>
  );
}

export default SponsorCard;