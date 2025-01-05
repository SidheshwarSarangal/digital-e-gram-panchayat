// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

import dotenv from 'dotenv';
dotenv.config();  // This will load the variables from the .env file

const secretKey = process.env.SECRET_KEY;  // Now you can access the secret key from the .env

// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUZQVDBOprpltxznXKNXQ8IrwxtzHEQlw",
  authDomain: "new-gram-panchayat.firebaseapp.com",
  projectId: "new-gram-panchayat",
  storageBucket: "new-gram-panchayat.firebasestorage.app",
  messagingSenderId: "133015505126",
  appId: "1:133015505126:web:23546e9f4fe92725d4d327",
  measurementId: "G-WME0PD3QBS"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db, analytics, firebaseConfig };
