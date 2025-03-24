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
<<<<<<< HEAD
        <p className="text-1xl md:text-2xl lg:text-3xl my-3 font-['Sponsor'] text-white text-center drop-shadow-[0_5px_5px_rgba(255,255,255,0.5)] font-bold">
=======
        <p className="text-1xl md:text-1xl lg:text-2xl my-5 font-['Title'] text-white text-center font-bold">
>>>>>>> d04940d (FrontEnd)
          {eventname}
        </p>
      </div>
    </div>
  );
}

export default SponsorCard;
