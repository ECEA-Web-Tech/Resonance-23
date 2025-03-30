import React from "react";
import "../styles/obcard.css";
import { Button } from "@mui/material";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth } from "../firebase.js";

function EventCard({ eventname, image }) {
  const handleRegister = async () => {
    try {
      const user = auth.currentUser;
      console.log(user);

      if (!user) {
        alert("⚠️ Please login to register!");
        return;
      }

      console.log(user.uid);
      const db = getFirestore();
      const usersCollection = collection(db, "Students");
      const studentsQuery = query(
        usersCollection,
        where("uid", "==", user.uid)
      );
      const studentsSnapshot = await getDocs(studentsQuery);

      if (studentsSnapshot.empty) {
        alert("❌ User data not found! Please contact support.");
        return;
      }

      const studentDoc = studentsSnapshot.docs[0];
      const studentData = studentDoc.data();

      // 🔍 Check if user is already registered
      const eventCollection = collection(db, eventname);
      const eventQuery = query(
        eventCollection,
        where("userId", "==", user.uid)
      );
      const eventSnapshot = await getDocs(eventQuery);

      if (!eventSnapshot.empty) {
        alert("✅ You are already registered for this event!");
        return;
      }

      // ✅ Register the user
      await addDoc(eventCollection, {
        userId: user.uid,
        VisionId: studentData.uniqueID || "N/A",
        Name: studentData.name || "N/A",
        RollNumber: studentData.rollNumber || "N/A",
        College: studentData.college || "N/A",
        Email: user.email,
        Phone: studentData.phoneNumber || "N/A",
        Year: studentData.year || "N/A",
        registeredAt: new Date(),
      });

      alert(`🎉 Successfully registered for ${eventname}!`);
    } catch (error) {
      console.error("❌ Registration failed:", error);
      alert("⚠️ An error occurred. Please try again later.");
    }
  };

  return (
    <div className="EventsContainer">
      <img src={image} alt={eventname} loading="lazy" />
      <div className="EventTitle text-center font-['Title']">
        <Button variant="contained" onClick={handleRegister}>
          <h3 className="text-1xl text-white">Register</h3>
        </Button>
      </div>
    </div>
  );
}

export default EventCard;
