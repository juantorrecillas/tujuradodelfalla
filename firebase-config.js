// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBz9uCfqnOtjsqm2QQVTKFPfFa4w4ou2nQ",
  authDomain: "tujuradodelfalla.firebaseapp.com",
  projectId: "tujuradodelfalla",
  storageBucket: "tujuradodelfalla.firebasestorage.app",
  messagingSenderId: "602644542556",
  appId: "1:602644542556:web:6db6e152fde80d56482299",
  measurementId: "G-KVLVFFHGMJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);