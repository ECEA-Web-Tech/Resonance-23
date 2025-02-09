import { useState } from "react";
import bg from "../assets/videos/bgslow.mp4";
import Main_BG from "../assets/images/Main_BG.avif";

function Login() {
  const [formData, setFormData] = useState({
    name: "",
    rollNumber: "",
    college: "",
    email: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
    alert("Login Successful!");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-100">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={bg} type="video/mp4" />
        Your browser does not support the video tag.
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
            <label className="block text-gray-700">College</label>
            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full p-2 border rounded mt-1"
              required
            />
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
      </div>
    </div>
  );
}

export default Login;
