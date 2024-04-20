import React from "react";
import "../styles/obcard.css";

function SponsorCard({ eventname, image, link }) {
  return (
    <div className="SponsorContainer">
      <div className="SponsorImageContainer">
        <img
          src={image}
          onClick={() => {
            window.open(link, '_blank').focus();
          }}
        />
      </div>
      <div className="SponsorTitle">
        <p className="text-1xl md:text-2xl lg:text-3xl my-3 font-['Title'] text-white text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
          {eventname}
        </p>
      </div>
    </div>
  );
}

export default SponsorCard;
