import React from "react";
import NavBar from "../components/NavBar";
import eceaFull from "../assets/images/ecea.png";
import eceaGold from "../assets/images/eceaGold.png";
import OfficeBearers from "../components/OfficeBearers";
import ObDetails from "../utils/ObDetails";
import OsDetails from "../utils/OsDetails";
import JsDetails from "../utils/JsDetails";
import Footer from "../components/Footer";
import Background2 from "../assets/videos/bgborder.mp4";
import { Container, Typography } from "@mui/material";
import { Fade, Slide, Zoom } from "react-awesome-reveal";
import useWindowDimensions from "../utils/useWindowDimensions";

function AboutUs() {
    const { height, width } = useWindowDimensions();

  return (
    <>
    <NavBar/>
    <div className=" flex flex-col justify-center items-center mb-5 "></div>
    
    
      <h1 className="text-white text-center text-5xl md:text-6xl font-bold font-['Title'] my-6 drop-shadow-[0_5px_5px_rgba(240,240,240,0.5)]">
        <Slide direction="down" triggerOnce="true">
          About Us
        </Slide>
      </h1>
      <Fade direction="left" duration={1000}>
        <Container className="border rounded-xl p-8 m-8 bg-white">
          <div className="m-2 px-5 flex flex-col justify-center items-center">
            <Zoom triggerOnce="true" delay={500}>
              <div>
                {width > 425 ? (
                  <img
                    src={eceaFull}
                    width={"100%"}
                    style={{ marginBottom: 10 }}
                  />
                ) : (
                  <img
                    src={eceaGold}
                    width={200}
                    height={200}
                    className="w-52 h-56 mb-7"
                  />
                )}
              </div>
            </Zoom>
            <div className="text-black text-left sm:text-justify text-base sm:text-lg md:text-xl lg:text-2xl font-['Title'] flex-wrap p-0 sm:p-2 ml-1">
              <ul>
                <li className="mb-3">
                  <Typography align="justify">
                  - Electronics and Communication Engineer's Association (ECEA)
                  is a student-run organization functioning for the well-being
                  of the students for nearly three decades.It is headed by our
                  most revered HOD Dr.M.A.Bhagyaveni, Chairperson, ECEA.
                  </Typography>
                </li>
                <li>
                  <Typography align="justify">
                  - ECEA strives to fulfil its objective to organize various
                  activities that contribute to the academic and professional
                  development of students, along with leadership qualities,
                  teamwork, and other essential employability skills. It builds
                  a platform for young minds to share their thoughts and aid
                  them in becoming productive engineers.
                  </Typography>
                </li>
              </ul>
            </div>
          </div>
        </Container>
      </Fade>
    
    {/* Office Bearers */}
    <OfficeBearers ObDetails={ObDetails} title="Office Bearers" />

    {/* Organising Secretaries */}
    <OfficeBearers ObDetails={OsDetails} title="Organising Secretaries" />

    {/* Joint Secretaries */}
    <OfficeBearers ObDetails={JsDetails} title="Joint Secretaries" />
    
    <Footer/>
    </>
    )
}
export default AboutUs;