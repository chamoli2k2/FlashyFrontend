// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyAXsTFcMFqaezAHELRKSe2qFRSxcHUP0Kc",
  authDomain: "flashcard-webapp-d8222.firebaseapp.com",
  projectId: "flashcard-webapp-d8222",
  storageBucket: "flashcard-webapp-d8222.appspot.com",
  messagingSenderId: "605274616142",
  appId: "1:605274616142:web:218894978752fa3626ee1f",
  measurementId: "G-W38QYDEQME"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { firebaseConfig };
