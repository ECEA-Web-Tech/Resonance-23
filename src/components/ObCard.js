import React from "react";
import "../styles/obcard.css";

function ObCard({ name, designation, photo }) {
  return (
    <div className="Container">
      <img src={photo} />
      <div className="Title text-center font-['Title'] ">
        <h2 className="text-3xl mb-2">{name}</h2>
        <h3 className="text-1xl text-gray-400">{designation}</h3>
      </div>
    </div>
  );
}

export default ObCard;
