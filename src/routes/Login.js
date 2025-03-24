import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../assets/videos/bgslow.mp4";
import NavBar from "../components/NavBar";
import InitialLogin from "./InitialLogin";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { app } from "../firebase.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

async function generateUniqueID(rollNumber, collegeType) {
  if (!rollNumber || rollNumber.length < 3) return "";

  const db = getFirestore();
  const studentsRef = collection(db, "Students");
  const snapshot = await getDocs(studentsRef);

  let count = 0;
  snapshot.forEach((doc) => {
    const student = doc.data();
    if (student.collegeType === collegeType) {
      count++;
    }
  });

  const baseID = collegeType === "AU" ? 50001 : 59001;
  const uniqueNumber = baseID + count;

  return `V2${uniqueNumber}`;
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
    year: "",
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
      const generatedID = await generateUniqueID(
        formData.rollNumber,
        formData.collegeType
      );
      setUniqueID(generatedID);

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

      setFormSubmitted(true);

      // Redirect to login after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
        setShowInitialLogin(true);
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
        {/* Background Video */}
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
        ) : existingVisionID ? (
          <div className="relative bg-white p-8 rounded-lg shadow-md w-96 bg-opacity-90">
            <h2 className="text-xl font-bold mb-4 text-center">
              Your Vision ID
            </h2>
            <p className="text-center text-2xl">{existingVisionID}</p>
          </div>
        ) : formSubmitted ? (
          // Display Unique ID for 5 seconds, then redirect to login
          <div className="relative bg-white p-8 rounded-lg shadow-md w-96 bg-opacity-90 text-center">
            <h2 className="text-xl font-bold mb-4">Registration Successful!</h2>
            <p className="text-2xl font-semibold">Your Vision ID:</p>
            <p className="text-3xl text-blue-600 font-bold">{uniqueID}</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
          </div>
        ) : (
          // Registration Form
          <div className="relative bg-white p-8 rounded-lg shadow-md w-96 bg-opacity-90">
            <h2 className="text-xl font-bold mb-4 text-center">
              Student Registration
            </h2>
            <form onSubmit={handleSubmit}>
              {/* Name */}
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

              {/* College Type */}
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

              {/* Email */}
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

              {/* Password */}
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
