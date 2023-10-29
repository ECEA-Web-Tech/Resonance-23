import React from "react";
import "../styles/obcard.css";
import { Button } from "@mui/material";

function EventCard({ eventname, image, link }) {
  return (
    <a href={link}><div className="EventsContainer">
      <img src={image} onClick={link} />
      <div className="EventTitle text-center font-['Title']"  >
        <Button variant="contained"><a href={link}><h3 className="text-1xl text-white">Register</h3></a></Button>
      </div>
      
    </div>
    </a>
  );
}

export default EventCard;
