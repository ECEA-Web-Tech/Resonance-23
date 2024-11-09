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
import bg from "../assets/videos/bgslow.mp4";
import { Container, Typography } from "@mui/material";
import useWindowDimensions from "../utils/useWindowDimensions";

function AboutUs() {
  const { width } = useWindowDimensions();

  return (
    <>
      <NavBar />
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed w-full h-full object-cover"
      >
        <source src={bg} />
      </video>
      <div className="flex flex-col justify-center items-center mb-5"></div>

      <h1 className="text-white text-center text-5xl md:text-6xl font-bold font-['Title'] my-6 drop-shadow-[0_5px_5px_rgba(240,240,240,0.5)]">
        <Fade triggerOnce={true} duration={800}>
          About Us
        </Fade>
      </h1>

      <Zoom triggerOnce={true} duration={800}>
        <Container
          className="rounded-xl p-10 max-w-4xl shadow-lg"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }} // Darker, semi-transparent background
        >
          <div className="m-2 px-5 flex flex-col justify-center items-center">
            <Slide
              direction="down"
              triggerOnce={true}
              delay={200}
              duration={1000}
            >
              <Fade triggerOnce={true} delay={400} duration={800}>
                <div>
                  {width > 425 ? (
                    <img
                      src={eceaFull}
                      className="w-52 h-75 mb-10" // Full width, auto height for responsiveness
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
                      className="w-full h-auto mb-7"
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
              direction="up"
              triggerOnce={true}
              delay={1400}
              duration={1200}
            >
              <p className="text-white text-justify text-md md:text-lg lg:text-xl leading-relaxed">
                <Typography
                  sx={{
                    fontSize: {
                      xs: "0.7rem", // small screens
                      sm: "0.9rem", // medium screens
                      md: "1rem", // large screens
                      lg: "1.2rem",
                      textAlign: "center",
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
