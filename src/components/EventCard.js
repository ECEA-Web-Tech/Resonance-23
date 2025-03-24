import React from "react";
import "../styles/obcard.css";
import { Button } from "@mui/material";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function EventCard({ eventname, image }) {
  const handleRegister = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please login to register!");
      return;
    }

    const db = getFirestore();
    const eventCollection = collection(db, eventname);

    try {
      // 🔍 Check if user is already registered
      const q = query(eventCollection, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        alert("You have already registered for this event!");
        return;
      }

      // ✅ Register the user
      await addDoc(eventCollection, {
        userId: user.uid,
        userEmail: user.email,
        registeredAt: new Date(),
      });

      alert(`Successfully registered for ${eventname}!`);
    } catch (error) {
      console.error("Error registering:", error);
      alert("Registration failed. Try again.");
    }
  };

  return (
    <div className="EventsContainer">
      <img src={image} />
      <div className="EventTitle text-center font-['Title']">
        <Button variant="contained" onClick={handleRegister}>
          <h3 className="text-1xl text-white">Register</h3>
        </Button>
      </div>
    </div>
  );
}

export default EventCard;
