import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { validateUser } from "./firebase.js";

const passwordInput = document.querySelector(".pass-field input");
const requirementList = document.querySelectorAll(".requirement-list li");
const submitButton = document.getElementById("submit-button");
const loginForm = document.getElementById("login-form");
const studentCounselor = document.getElementById("student-counselor");



const auth = getAuth();


const requirements = [
  { regex: /.{8,}/, index: 0 }, // Minimum of 8 characters
  { regex: /[0-9]/, index: 1 }, // At least one number
  { regex: /[a-z]/, index: 2 }, // At least one lowercase letter
  { regex: /[^A-Za-z0-9]/, index: 3 }, // At least one special character
  { regex: /[A-Z]/, index: 4 }, // At least one uppercase letter
]
passwordInput.addEventListener("keyup", (e) => {

  let allValid = true;
  requirements.forEach(item => {
      // Check if the password matches the requirement regex
      const isValid = item.regex.test(e.target.value);
      const requirementItem = requirementList[item.index];
      // Updating class and icon of requirement item if requirement matched or not
      if (isValid) {
          requirementItem.classList.add("valid");
          requirementItem.firstElementChild.className = "fa-solid fa-check";
      } else {
          requirementItem.classList.remove("valid");
          allValid = false;
          requirementItem.firstElementChild.className = "fa-solid fa-circle";
      }
  });

  if(!allValid) {
    passField.classList.add("invalid"); 
    console.log("bad password")
    return
  } else {
    passField.classList.remove("invalid"); 
    console.log("good password")
  }


});

let emailField = loginForm.querySelector(".email-field")
let emailInput = emailField.querySelector(".email")
let passField = loginForm.querySelector(".password-field")


// Email Validtion
function checkEmail() {
  const emailPattern = /^[^ ]+@[^ ]+dasd[^ ]*\.org$/;
  if (!emailInput.value.match(emailPattern)) {
    emailField.classList.add("invalid"); 
    return
  }
  emailField.classList.remove("invalid"); 
}

// Password Validation
emailInput.addEventListener("keyup", checkEmail);
// passwordInput.addEventListener("keyup", createPass);

// Calling Funtion on Form Sumbit
submitButton.addEventListener("click", (e) => {
  e.preventDefault();
  checkEmail();
  // createPass();

  const emailValid = !emailField.classList.contains("invalid")
  const passValid = !passField.classList.contains("invalid")
  if (!emailValid || !passValid) {
    console.log("bad email or password")
    return
  } 
  signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      window.location.assign('http://localhost:5173/reports/') // replace with actual web URL
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
});