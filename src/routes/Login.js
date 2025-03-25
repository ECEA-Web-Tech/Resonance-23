import { useState } from "react";
import NavBar from "../components/NavBar";
import InitialLogin from "./InitialLogin";
import { getFirestore, collection, addDoc } from "firebase/firestore"; // Import Firestore functions
import { app } from "../firebase.js"; // Import your Firebase app instance
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import bgLayer1 from "../assets/images/z_bg.png"; // Dark background

function generateUniqueID(rollNumber) {
  if (!rollNumber || rollNumber.length < 3) return "";

  const year = "25";
  const randomLetters = Array(4)
    .fill()
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join("");
  const lastThreeDigits = rollNumber.slice(-3);

  return `V${year}${randomLetters}${lastThreeDigits}`;
}

function Login() {
  const [showInitialLogin, setShowInitialLogin] = useState(true);
  const [existingVisionID, setExistingVisionID] = useState("");

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
  });

  const [uniqueID, setUniqueID] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false); // New state

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

    const generatedID = generateUniqueID(formData.rollNumber);
    setUniqueID(generatedID);

    try {
      const auth = getAuth(app);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Get Firestore instance
      const db = getFirestore(app);

      // Add a new document to the "Students" collection
      const docRef = await addDoc(collection(db, "Students"), {
        ...formData,
        uniqueID: generatedID,
        uid: user.uid, // Store the Firebase Auth UID
      });

      console.log("Document written with ID: ", docRef.id);
      setFormSubmitted(true);
<<<<<<< Updated upstream
=======
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
          "98J915iiKG4fVwCrt" 
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
>>>>>>> Stashed changes
    } catch (error) {
      console.error("Error adding user: ", error);
      setPasswordError(error.message);
    }
  };

  const handleCollegeChange = (e) => {
    setFormData({ ...formData, college: e.target.value });
  };

  return (
    <>
      <NavBar />
      <div className="relative flex items-center justify-center min-h-screen">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full max-w-[1920px] mx-auto -z-10">
          <img
            src={bgLayer1}
            alt="Background Dark"
            className="w-full h-full object-cover"
          />
        </div>

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
        ) : (
          // Your existing login form
          <div className="relative bg-white p-8 rounded-lg shadow-md w-96 bg-opacity-90">
            <h2 className="text-xl font-bold mb-4 text-center">
              Student Login
            </h2>
            {formSubmitted ? (
              // Display Unique ID if form is submitted
              <div className="mt-4 p-4 bg-gray-200 rounded text-center">
                <strong>Your Unique ID:</strong> {uniqueID}
              </div>
            ) : (
              // Display the form if it's not submitted
              <form onSubmit={handleSubmit}>
                {/* Your existing form fields */}
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
                  <label className="block text-gray-700">Are you from?</label>
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
                  <label className="block text-gray-700">College</label>
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
                  <label className="block text-gray-700">
                    Re-enter Password
                  </label>
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
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Login;
