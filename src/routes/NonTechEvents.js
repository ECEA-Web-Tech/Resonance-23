import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import NavBar from "../components/NavBar";
import EventPage from "../components/EventPage";
import NonTech from "../utils/NonTech";
import Footer from "../components/Footer";
import bgLayer2 from "../assets/images/log.jpg"; // Dark background

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
      <div className="absolute inset-0 w-full h-full max-w-[1920px] mx-auto -z-10">
        <img
          src={bgLayer2}
          alt="Background Dark"
          className="w-full h-full object-cover"
        />
      </div>
      <EventPage props={NonTech} userEmail={userEmail} />
      <Footer />
    </>
  );
}

export default NonTechEvents;
