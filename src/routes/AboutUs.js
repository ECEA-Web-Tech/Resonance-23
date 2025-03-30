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
import { Container, Typography } from "@mui/material";
import useWindowDimensions from "../utils/useWindowDimensions";

function AboutUs() {
  const { width } = useWindowDimensions();

  return (
    <>
      <NavBar />
      <div
        className="min-w-full min-h-screen bg-[#2A3033]  p-4 pt-3"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(42,48,51,1) 80%)",
        }}
      >
        <Zoom triggerOnce={true} duration={800}>
          <Container
            className="rounded-xl mt-36 mb-36 py-20 max-w-4xl shadow-lg  "
            style={{ backgroundColor: "#30363a", border: "2px solid #1debf4" }} // Darker, semi-transparent background
          >
            <div className="flex flex-col sm:flex-row gap-10">
              <div className="">
                <h1 className="text-2xl py-2 text-white text-center bg-[#1debf4] font-['Title'] font-bold my-2">
                  COLLEGE OF ENGINEERING GUINDY
                </h1>
                <Slide
                  direction="left"
                  triggerOnce={true}
                  delay={100}
                  duration={800}
                >
                <p className="text-white text-justify text-md md:text-lg lg:text-xl leading-relaxed">
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "0.6rem", // small screens
                        sm: "0.8rem", // medium screens
                        md: "0.9rem", // large screens
                        lg: "1.1rem",
                        textAlign: "justify",
                        fontWeight: "700",
                      },
                      lineHeight: 1.8,
                    }}
                  >
                    The College of Engineering, Guindy (CEG), located in
                    Chennai, is one of the prestigious and oldest technical
                    institutions in India. Over the years, the institution has
                    produced several accomplished laureates in a plethora of
                    fields. CEG comprises 17 Departments and 17 Research
                    Centers. <br></br> The school fosters the advancement of the
                    student's pursuit of knowledge along with providing
                    exhaustive opportunities for their excellence. <br></br> In
                    addition to these, there are multiple student-run clubs and
                    student-run societies that are open to all students. Having
                    close ties with industries and research practices, CEG helps
                    pave a path for the multipronged growth of its students.
                  </Typography>
                </p>
                </Slide>
              </div>
              <div>
                <h1 className="text-2xl py-2 text-white text-center bg-[#1debf4] font-['Title'] font-bold my-2">
                  DEPT. OF ECE
                </h1>
                <Slide
                  direction="right"
                  triggerOnce={true}
                  delay={100}
                  duration={800}
                >
                  <p className="text-white text-justify text-md md:text-lg lg:text-xl leading-relaxed">
                    <Typography
                      sx={{
                        fontSize: {
                          xs: "0.7rem", // small screens
                          sm: "0.8rem", // medium screens
                          md: "0.9rem", // large screens
                          lg: "1.1rem",
                          textAlign: "justify",
                          fontWeight: "700",
                        },
                        lineHeight: 1.8,
                      }}
                    >
                      The department of ECE became a part of the university in
                      1945 and is one of the most reputed departments in the
                      nation. The members of this department form the core of
                      intellects that come up with challenging ideas every day.
                      The curriculum has the entire spectrum of electronics
                      briefly encompassed in it. <br></br> <br></br>To add to
                      its credits, this department launched ANUSAT- a
                      microsatellite with the help of ISRO and ANUSAT-2 in 2017.
                      This department is thus a platform to explore electronics
                      and envision communication.
                    </Typography>
                  </p>
                </Slide>
              </div>
            </div>
            <h1 className="text-2xl py-2 text-white text-center bg-[#1debf4] font-['Title'] font-bold my-12">
              ELECTRONICS AND COMMUNICATION ENGINEERS' ASSOCIATION
            </h1>
            <div className=" flex flex-col sm:flex-row justify-center items-center md:gap-24 sm:gap-12 my-10 sm:my-20">
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
                        alt="ecea logo"
                        className=" w-[150px] sm:w-[600px] p-2 mb-10" // Full width, auto height for responsiveness
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
                delay={200}
                duration={800}
              >
                <p className="text-white text-justify text-md md:text-lg lg:text-xl leading-relaxed">
                  <Typography
                    sx={{
                      fontSize: {
                        xs: "0.6rem", // small screens
                        sm: "0.8rem", // medium screens
                        md: "0.9rem", // large screens
                        lg: "1.1rem",
                        textAlign: "justify",
                        fontWeight: "700",
                      },
                      lineHeight: 1.8,
                    }}
                  >
                    Electronics and Communication Engineer's Association (ECEA)
                    is a student-run organization functioning for the well-being
                    of the students for nearly three decades. It is headed by
                    our most revered HOD Dr.M.A.Bhagyaveni, Chairperson, ECEA.
                    <br />
                    <br />
                    ECEA strives to fulfill its objective to organize various
                    activities that contribute to the academic and professional
                    development of students, along with leadership qualities,
                    teamwork, and other essential employability skills. It
                    builds a platform for young minds to share their thoughts
                    and aid them in becoming productive engineers.
                  </Typography>
                </p>
              </Slide>
            </div>
          </Container>
        </Zoom>
      </div>

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
