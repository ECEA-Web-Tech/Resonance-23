import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { app } from "../firebase.js";

function InitialLogin({ onNewLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [visionID, setVisionID] = useState(
    sessionStorage.getItem("visionID") || null
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (visionID) {
      sessionStorage.setItem("visionID", visionID);
    }
  }, [visionID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const db = getFirestore(app);
      const studentsRef = collection(db, "Students");
      const q = query(studentsRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        let foundUser = false;

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.password === password) {
            setVisionID(userData.uniqueID);
            sessionStorage.setItem("visionID", userData.uniqueID);
            foundUser = true;
          } else {
            setError("Incorrect password");
          }
        });

        if (!foundUser) {
          setError("User not found");
        }
      } else {
        setError("User not found");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("visionID");
    setVisionID(null);
  };

  const handleTechEventsClick = () => {
    navigate("/techevents"); // Navigates to Tech Events page
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full  flex-col">

<div className="bg-white bg-opacity-20 backdrop-blur-lg p-8 rounded-2xl shadow-lg w-full max-w-xl">
<h1 className="text-2xl text-white mb-0 text-center">Login</h1>
<br></br>
      {visionID ? (
        <div>
          <p className="text-center text-2xl">
            Vision ID:{visionID}
          </p>

          {/* Tech Events Button */}
          <button
            onClick={handleTechEventsClick}
            className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 mt-4"
          >
            Take me to Events!!
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 mt-2"
          >
            Logout
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            
            <input
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300-400 bg-white text-black placeholder-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
             className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300-400 bg-white text-black placeholder-gray-400"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-2"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
          </form>)}
          {/* New Registration Button Always Visible */}
          <div  className="mt-4 flex justify-center w-full">

          
          <button
           
            onClick={onNewLogin}
            className="text-white text-sm text-right cursor-pointer hover:underline mt-1 pr-1"
          >
            Don't have an account? Sign up
          </button>
          </div>
        
      
    </div>
    </div>
  );
}

export default InitialLogin;