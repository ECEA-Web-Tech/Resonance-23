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
    <div className="relative bg-white p-8 rounded-lg shadow-md w-96 bg-opacity-90">
      <h2 className="text-xl font-bold mb-4 text-center">
        {visionID ? "Welcome" : "Login"}
      </h2>

      {visionID ? (
        <div>
          <p className="text-center text-2xl font-semibold">
            Vision ID: <span className="text-blue-600">{visionID}</span>
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
            <label className="block text-gray-700">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded mt-1"
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

          {/* New Registration Button Always Visible */}
          <button
            type="button"
            onClick={onNewLogin}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
          >
            New Registration
          </button>
        </form>
      )}
    </div>
  );
}

export default InitialLogin;
