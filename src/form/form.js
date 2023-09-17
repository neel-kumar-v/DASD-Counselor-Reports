import { getQueryVariable, setQueryVariable } from "../util";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { db } from "../firebase.js";

let counselor;
let docRef;

window.onload = function () {
  console.log("onload function");
  // getQueryVariable('counselor')
  //create a tailwind h1 with the var
  counselor = getQueryVariable("counselor");
  const radio = document.querySelector(
    `input[type="radio"][name="counselor"][value=${counselor}]`
  );
  console.log(radio);
  radio.checked = true;
};
const firebaseTemplate = {
  firstName: "Neel",
  lastName: "Kumar",
  email: "24nkumar@student.dasd.org",
  reason: "Scheduled Visit/Meeting",
  grade: "10",
  counselor: "hewitt",
  date: Date.now(),
  active: true,
};

document.getElementById("submit-button").onclick = async function handleSubmit(
  event
) {
  event.preventDefault();
  console.log("hello");
  //get all the query params
  const date = Date.now();
  // const formattedDate = `${date.getMonth()}/${date.getDay()}/${date.getFullYear()}`;
  const firstName = document.querySelector(
    "form[name='main'] input[name='firstName']"
  ).value;
  const lastName = document.querySelector(
    "form[name='main'] input[name='lastName']"
  ).value;
  const email = document.querySelector(
    "form[name='main'] input[name='email']"
  ).value;
  const reason = document.querySelector(
    "form[name='main'] select[name='reason']"
  ).value;
  const grade = document.querySelector(
    "form[name='main'] input[name='grade']:checked"
  ).value;
  const counselor = document.querySelector(
    "form[name='main'] input[name='counselor']:checked"
  ).value;

  const firebaseData = {
    firstName: firstName,
    lastName: lastName,
    email: email,
    reason: reason,
    grade: grade,
    counselor: counselor,
    date: date,
    active: true,
  };

  console.log(firebaseData);

  try {
    docRef = await addDoc(collection(db, "checkin"), firebaseData);
    history.back();
  } catch {
    console.error("Document add threw error:", e);
  }
};
