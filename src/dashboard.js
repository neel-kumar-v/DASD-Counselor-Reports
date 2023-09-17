import { formatDate, formatTime } from "./util.js";
import { app, db } from "./firebase.js";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  getDocs,
  getFirestore,
} from "firebase/firestore";

function verifyDoc(doc) {
  isExisting = document.getElementById(doc.id);
  if (isExisting == null) {
    throw new Error("Document does not exist.");
  }
}

function formatName(name) {
  let newName = "";
  for (const c of name) {
    newName += "*";
  }
  return newName;
}

// onload
window.onload = async function () {
  let template = document.getElementById("person-card");
  let q = query(collection(db, "checkin"), where("active", "==", true));
  let querySnapshot = await getDocs(q);

  querySnapshot.forEach((docItem) => {
    try {
      verifyDoc(docItem);
    } catch {
      if (Date.now() - docItem.data().date >= 86400000) {
        docItem.data().active = false;
      } else {
        const clone = template.content.cloneNode(true);
        const cloneDOM = clone.querySelector(".person-card");
        cloneDOM.id = docItem.id;
        cloneDOM.querySelector("#person-name").textContent =
          formatName(docItem.data().firstName) +
          " " +
          formatName(docItem.data().lastName);
        cloneDOM.querySelector("#checkin-time").textContent = formatTime(
          docItem.data().date
        );

        cloneDOM
          .querySelector("#deleteButton")
          .addEventListener("click", async function (event) {
            parent = event.parentNode;
            console.log(parent);
            const delDocRef = doc(db, "checkin", cloneDOM.id);
            await setDoc(delDocRef, { active: false }, { merge: true });
            location.reload()
          });

        const containers = document.querySelectorAll(
          ".col-span-1.flex.flex-col"
        );
        containers.forEach((container) => {
          if (container.id !== docItem.data().counselor) return;
          container.insertBefore(cloneDOM, container.lastElementChild);
        });
      }
    }
  });
};
