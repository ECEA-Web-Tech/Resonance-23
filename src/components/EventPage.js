import React from "react";
import Card from "react-animated-3d-card";
import dummy from "../assets/images/posters/mayhem.jpg";

function EventPage() {
  return (
    <div className="min-w-screen m-4 p-10">
      <Card
        style={{ width: "300px", backgroundColor: "#101010" }}
        shineStrength={0.1}
        onClick={() => {
          window.location.href = "https://www.google.com";
        }}
      >
        <a href="https://www.google.com" target="blank">
          <img src={dummy} style={{ zIndex: -1 }} />
        </a>
      </Card>
    </div>
  );
}

export default EventPage;
