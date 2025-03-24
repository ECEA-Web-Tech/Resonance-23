import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from "../components/NavBar";
import EventPage from "../components/EventPage";
import NonTech from "../utils/NonTech";
import Footer from "../components/Footer";
import bg from "../assets/videos/bgslow.mp4";

function NonTechEvents() {
  const [userEmail, setUserEmail] = useState(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return () => unsubscribe();
  }, [auth]);

  return (
    <>
      <NavBar />
      <video autoPlay loop muted playsInline className="absolute w-full h-full object-cover">
        <source src={bg} />
      </video>
      <h1 className="text-2xl md:text-4xl lg:text-5xl font-['Title'] text-white my-5 text-center font-bold">
        Non Tech Events
      </h1>
      <EventPage props={NonTech} userEmail={userEmail} />
      <Footer />
    </>
  );
}

export default NonTechEvents;
