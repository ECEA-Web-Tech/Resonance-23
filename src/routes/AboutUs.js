import React from "react";
import NavBar from "../components/NavBar";
import { Fade, Zoom, Slide } from "react-awesome-reveal";
import eceaFull from "../assets/images/eceaGold.png";
import eceaGold from "../assets/images/eceaGold.png";
import OfficeBearers from "../components/OfficeBearers";
import ObDetails from "../utils/ObDetails";
import OsDetails from "../utils/OsDetails";
import JsDetails from "../utils/JsDetails";
import Footer from "../components/Footer";
import bgLayer1 from "../assets/images/z_bg.png"; // Dark background
import { Container, Typography } from "@mui/material";
import useWindowDimensions from "../utils/useWindowDimensions";

function AboutUs() {
  const { width } = useWindowDimensions();

  return (
    <>
      <NavBar />
      <div className="absolute inset-0 w-full h-full max-w-[1920px] mx-auto -z-10">
        <img
          src={bgLayer1}
          alt="Background Dark"
          className="w-full h-full object-cover"
        />
      </div>
        

      <Zoom triggerOnce={true} duration={800}>
        <Container
          className="rounded-xl p-10 max-w-4xl shadow-lg mt-40 mb-32"
          style={{ backgroundColor: "#30363a" }} // Darker, semi-transparent background
        >
          <div className="m-2 px-10 flex flex-col sm:flex-row justify-center items-center md:gap-32 sm:gap-20 my-3 sm:my-20">
            <Slide
              direction="down"
              triggerOnce={true}
              delay={200}
              duration={1000}
            >
              <Fade triggerOnce={true} delay={400} duration={800}>
                <div className="flex justify-center mt-5">
                  {width > 425 ? (
                    <img
                      src={eceaFull}
                      alt="ecea logo"
                      className=" w-[150px] sm:w-[600px] p-2 mb-10 " // Full width, auto height for responsiveness
                      style={{
                        filter: "brightness(1.2) contrast(1.1)", // Enhancing visibility
                        maxWidth: "100%", // Ensure the image doesn't overflow
                        objectFit: "contain",
                        // Maintain aspect ratio without overflow
                      }}
                    />
                  ) : (
                    <img
                      src={eceaGold}
                      alt="ecea logo"
                      className="w-[100px] h-[30%] mb-7"
                      style={{
                        filter: "brightness(1.2) contrast(1.1)",
                        maxWidth: "100%", // Ensure image fits the container
                        objectFit: "contain", // Keep the aspect ratio
                      }}
                    />
                  )}
                </div>
              </Fade>
            </Slide>

            {/* Text appears after image */}
            <Slide
              direction="right"
              triggerOnce={true}
              delay={1400}
              duration={1200}
            >
              <p className="text-white text-justify text-md md:text-lg lg:text-xl leading-relaxed">
                <Typography
                  sx={{
                    fontSize: {
                      xs: "0.8rem", // small screens
                      sm: "0.8rem", // medium screens
                      md: "0.9rem", // large screens
                      lg: "1.1rem",
                      textAlign: "justify",
                      fontWeight: "700",
                    },
                    lineHeight: 1.8,
                  }}
                >
                  Electronics and Communication Engineer's Association (ECEA) is
                  a student-run organization functioning for the well-being of
                  the students for nearly three decades. It is headed by our
                  most revered HOD Dr.M.A.Bhagyaveni, Chairperson, ECEA.
                  <br />
                  <br />
                  ECEA strives to fulfill its objective to organize various
                  activities that contribute to the academic and professional
                  development of students, along with leadership qualities,
                  teamwork, and other essential employability skills. It builds
                  a platform for young minds to share their thoughts and aid
                  them in becoming productive engineers.
                </Typography>
              </p>
            </Slide>
          </div>
        </Container>
      </Zoom>

      {/* Office Bearers */}
      <OfficeBearers ObDetails={ObDetails} title="Office Bearers" />

      {/* Organising Secretaries */}
      <OfficeBearers ObDetails={OsDetails} title="Organising Secretaries" />

      {/* Joint Secretaries */}
      <OfficeBearers ObDetails={JsDetails} title="Joint Secretaries" />

      <Footer />
    </>
  );
}

export default AboutUs;
