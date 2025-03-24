import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/videos/bgslow.mp4";
import NavBar from "../components/NavBar";
import InitialLogin from "./InitialLogin";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { app } from "../firebase.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import emailjs from "emailjs-com";

function generateUniqueID(rollNumber, collegeType, phoneNumber) {
  if (!rollNumber || rollNumber.length < 3) return "";
  const collegePrefix = collegeType === "AU" ? "AU" : "OT";
  const phone = phoneNumber.slice(0, 3);
  return `V2${collegePrefix}${rollNumber}${phone}`;
}

function Login() {
  const [showInitialLogin, setShowInitialLogin] = useState(true);
  const [existingVisionID, setExistingVisionID] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [uniqueID, setUniqueID] = useState("");
  const navigate = useNavigate();

  const handleNewLogin = () => {
    setShowInitialLogin(false);
  };

  const handleExistingLogin = (visionID) => {
    setExistingVisionID(visionID);
    setShowInitialLogin(false);
  };

  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    collegeType: "AU",
    college: "Anna University",
    email: "",
    password: "",
    reenterPassword: "",
    phoneNumber: "",
    department: "",
    year: "1",
  });

  const [passwordError, setPasswordError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    if (e.target.name === "password" || e.target.name === "reenterPassword") {
      validatePasswords(
        e.target.name === "password" ? e.target.value : formData.password,
        e.target.name === "reenterPassword"
          ? e.target.value
          : formData.reenterPassword
      );
    }
  };

  const validatePasswords = (password, reenterPassword) => {
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
    } else if (password !== reenterPassword) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError("");
    }
  };
  const handleCollegeTypeChange = (e) => {
    const selectedType = e.target.value;
    setFormData({
      ...formData,
      collegeType: selectedType,
      college: selectedType === "AU" ? "Anna University" : "",
    });
  };
  const handleCollegeChange = (e) => {
    setFormData({ ...formData, college: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return;
    }
    if (formData.password !== formData.reenterPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const generatedID = generateUniqueID(
        formData.rollNumber,
        formData.collegeType,
        formData.phoneNumber
      );
      setUniqueID(generatedID);
      setFormSubmitted(true);

      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      const db = getFirestore(app);
      await addDoc(collection(db, "Students"), {
        ...formData,
        uniqueID: generatedID,
        uid: user.uid,
      });

      console.log("Registration successful.");
      setFormSubmitted(true);
      const templateParams = {
        user_name: formData.name,
        email: formData.email,
        vision_id: generatedID,
      };

      emailjs
        .send(
          "service_6x0bt4b", // Replace with your EmailJS Service ID
          "template_za0sl3g", // Replace with your EmailJS Template ID
          templateParams,
          "98J915iiKG4fVwCrt" // Replace with your EmailJS Public Key
        )
        .then(
          (response) => {
            console.log(
              "Email sent successfully!",
              response.status,
              response.text
            );
          },
          (error) => {
            console.error("Email sending failed!", error);
          }
        );

      setTimeout(() => {
        setShowInitialLogin(true);
        setFormSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error adding user: ", error);
      setPasswordError(error.message);
    }
  };

  return (
    <>
      <NavBar />
      <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={bg} type="video/mp4" />
        </video>

        {showInitialLogin ? (
          <InitialLogin
            onNewLogin={handleNewLogin}
            onExistingLogin={handleExistingLogin}
          />
        ) : formSubmitted ? (
          <div className="relative bg-white p-8 rounded-lg shadow-md w-96 bg-opacity-90">
            <h2 className="text-xl font-bold mb-4 text-center">
              Your Vision ID
            </h2>
            <p className="text-center text-2xl font-semibold">{uniqueID}</p>
            <p className="text-center text-gray-500 mt-2">
              Redirecting to login page
            </p>
          </div>
        ) : (
          <div className="relative bg-white p-8 rounded-lg shadow-md w-96 bg-opacity-90">
            <h2 className="text-xl font-bold mb-4 text-center">
              Student Registration
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">University</label>
                <select
                  name="collegeType"
                  value={formData.collegeType}
                  onChange={handleCollegeTypeChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                >
                  <option value="AU">AU Campus</option>
                  <option value="Other">Other College</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">College Name</label>
                {formData.collegeType === "AU" ? (
                  <select
                    name="college"
                    value={formData.college}
                    onChange={handleCollegeChange}
                    className="w-full p-2 border rounded mt-1"
                    required
                  >
                    <option value="CEG">CEG</option>
                    <option value="MIT">MIT</option>
                    <option value="ACT">ACT</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    name="college"
                    value={formData.college}
                    onChange={handleChange}
                    className="w-full p-2 border rounded mt-1"
                    required
                  />
                )}
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Department</label>
                <input
                  type="text"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Year of study</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Phone Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                  minLength={8}
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Re-enter Password</label>
                <input
                  type="password"
                  name="reenterPassword"
                  value={formData.reenterPassword}
                  onChange={handleChange}
                  className="w-full p-2 border rounded mt-1"
                  required
                  minLength={8}
                />
                {passwordError && (
                  <p className="text-red-500 text-sm mt-1">{passwordError}</p>
                )}
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                disabled={passwordError !== ""}
              >
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
export default Login;
