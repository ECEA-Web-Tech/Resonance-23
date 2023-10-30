import React from "react";
import NavBar from "../components/NavBar";
import MastHead from "../components/MastHead";
import Resonance from "../components/Resonance";
import OfficeBearers from "../components/OfficeBearers";
import ObDetails from "../utils/ObDetails";
import OsDetails from "../utils/OsDetails";
import JsDetails from "../utils/JsDetails";
import Footer from "../components/Footer.js";
function Root() {
  return (
    <>
      <NavBar />
      <MastHead />
      <Resonance />

      {/* Office Bearers */}
      <OfficeBearers ObDetails={ObDetails} title="Office Bearers" />

      {/* Organising Secretaries */}
      <OfficeBearers ObDetails={OsDetails} title="Organising Secretaries" />

      {/* Joint Secretaries */}
      <OfficeBearers ObDetails={JsDetails} title="Joint Secretaries" />
      <Footer/>
    </>
  );
}

export default Root;
