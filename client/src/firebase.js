// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "karma-estate.firebaseapp.com",
  projectId: "karma-estate",
  storageBucket: "karma-estate.firebasestorage.app",
  messagingSenderId: "418069956450",
  appId: "1:418069956450:web:bd2fdce5da188fc486ce3b"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

