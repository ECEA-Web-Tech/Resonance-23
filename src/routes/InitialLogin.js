import { useState } from "react";
import {
  getAuth,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from "firebase/auth";
import { app } from "../firebase.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";

function InitialLogin({ onNewLogin }) {
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [visionID, setVisionID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState("login"); // 'login', 'forgotPassword', 'resetPassword'
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); // Start loading

    try {
      const db = getFirestore(app);

      // Query the "Students" collection for a document where the "rollNumber" field matches the entered rollNumber
      const studentsRef = collection(db, "Students");
      const q = query(studentsRef, where("rollNumber", "==", rollNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.password === password) {
            setVisionID(userData.uniqueID); // Set the Vision ID
          } else {
            setError("Incorrect password");
          }
        });
      } else {
        setError("Roll number not found");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }
    setLoading(true);
    setError("");
    const auth = getAuth(app);

    try {
      console.log("Sending reset Email");
      await sendPasswordResetEmail(auth, email);
      alert(
        "Password reset email sent. Check your inbox for the temporary code."
      );
      setCurrentView("resetPassword");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!resetCode || !newPassword) {
      setError("Please enter both the reset code and new password");
      return;
    }
    setLoading(true);
    setError("");
    const auth = getAuth(app);

    try {
      await confirmPasswordReset(auth, resetCode, newPassword);

      // Update password in Firestore
      const db = getFirestore(app);
      const studentsRef = collection(db, "Students");
      const q = query(studentsRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const studentDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "Students", studentDoc.id), {
          password: newPassword,
        });
        alert(
          "Password reset successful. You can now login with your new password."
        );
        setCurrentView("login");
      } else {
        setError("No account found with this email");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white p-8 rounded-lg shadow-md w-96 bg-opacity-90">
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      {visionID ? (
        <p className="text-center text-2xl">Your Vision ID: {visionID}</p>
      ) : currentView === "resetPassword" ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleResetPassword();
          }}
        >
          <div className="mb-4">
            <label className="block text-gray-700">Reset Code</label>
            <input
              type="text"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="w-full p-2 border rounded mt-1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
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
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Roll Number</label>
              <input
                type="text"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
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
              disabled={loading} // Disable the button while loading
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </form>
          <button
            onClick={() => setCurrentView("forgotPassword")}
            className="w-full bg-gray-300 text-gray-700 p-2 rounded hover:bg-gray-400 mb-2"
            disabled={loading}
          >
            Forgot Password
          </button>
          {currentView === "forgotPassword" && (
            <div className="mt-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 border rounded mt-1 mb-2"
                required
              />
              <button
                onClick={handleForgotPassword}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                Send Reset Code
              </button>
            </div>
          )}
          <button
            onClick={onNewLogin}
            className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 mt-2"
            disabled={loading}
          >
            New Login
          </button>
        </>
      )}
    </div>
  );
}

export default InitialLogin;
