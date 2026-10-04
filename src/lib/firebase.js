import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore/lite";

const env = import.meta.env;
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

// Without config the public site runs on the bundled seed data and the admin panel explains how to connect.
export const app = config.apiKey && config.projectId ? initializeApp(config) : null;
export const db = app && getFirestore(app);
