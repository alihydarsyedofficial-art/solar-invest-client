// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA93IkjX2jDdpMTbWVN-fHpVtrcJ_JbH4o",
  authDomain: "solar-invest-9b72a.firebaseapp.com",
  projectId: "solar-invest-9b72a",
  storageBucket: "solar-invest-9b72a.firebasestorage.app",
  messagingSenderId: "196996461265",
  appId: "1:196996461265:web:666d632b2e3ade6d8ecbf0",
  measurementId: "G-EVM7YDZ725"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize and export Firestore and Auth for use in other components
export const db = getFirestore(app);
export const auth = getAuth(app);