// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCN2ACIBypMQVHOuucArao1CupZql0zms0",
  authDomain: "dasd-scheduler.firebaseapp.com",
  projectId: "dasd-scheduler",
  storageBucket: "dasd-scheduler.appspot.com",
  messagingSenderId: "309908797476",
  appId: "1:309908797476:web:53b0f06527391b778d00b1",
  measurementId: "G-YM7DTK26QL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)

function validateUser(email, password) {
  // return true or false
  return true
}
export { validateUser, db, app }