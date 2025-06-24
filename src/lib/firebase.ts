import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB1Hti8lKnxsQzjdZxtY1uAT25XStvQAU4",
    authDomain: "aaconnect-ba6dc.firebaseapp.com",
    projectId: "aaconnect-ba6dc",
    storageBucket: "aaconnect-ba6dc.appspot.com",
    messagingSenderId: "866042913787",
    appId: "1:866042913787:web:c505d54170c674072de15e",
    measurementId: "G-D4RVWQRBMX"
  };

  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

  export const auth = getAuth(app);
  export const db = getFirestore(app);