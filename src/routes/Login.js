import { useState } from "react";
import bg from "../assets/videos/bgslow.mp4";
import NavBar from "../components/NavBar";

function generateUniqueID(rollNumber) {
  if (!rollNumber || rollNumber.length < 3) return ""; // Handle invalid input

  const year = "25"; // Fixed year for Resonance '25
  const randomLetters = Array(4)
    .fill()
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26))) // Random A-Z
    .join("");
  const lastThreeDigits = rollNumber.slice(-3); // Get last 3 digits

  return `V${year}${randomLetters}${lastThreeDigits}`;
}

function Login() {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    collegeType: "AU",
    college: "Anna University",
    email: "",
  });

  const [uniqueID, setUniqueID] = useState(""); // Store generated ID

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCollegeTypeChange = (e) => {
    const selectedType = e.target.value;
    setFormData({
      ...formData,
      collegeType: selectedType,
      college: selectedType === "AU" ? "Anna University" : "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const generatedID = generateUniqueID(formData.rollNumber);
    setUniqueID(generatedID);
    console.log("Submitted Data:", { ...formData, uniqueID: generatedID });
    alert(`Login Successful! Your Unique ID: ${generatedID}`);
  };

  const handleCollegeChange = (e) => {
    setFormData({ ...formData, college: e.target.value });
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

        {/* Login Form */}
        <div className="relative bg-white p-8 rounded-lg shadow-md w-96 bg-opacity-90">
          <h2 className="text-xl font-bold mb-4 text-center">Student Login</h2>
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
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Submit
            </button>
          </form>

          {/* Display Unique ID */}
          {uniqueID && (
            <div className="mt-4 p-4 bg-gray-200 rounded text-center">
              <strong>Your Unique ID:</strong> {uniqueID}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Login;
