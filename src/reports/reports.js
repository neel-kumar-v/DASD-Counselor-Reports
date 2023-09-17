import {
  query,
  where,
  collection,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { app, db } from "../firebase.js";
import { formatTime, formatDate, capitalizeFirstLetter } from "../util.js";

// Frontend

const counselorFilterDropdownButton = document.getElementById(
  "filterDropdownButton"
);
const counselorFilterDropdown = document.getElementById("filterDropdown");
counselorFilterDropdownButton.addEventListener("click", () => {
  counselorFilterDropdown.classList.toggle("hidden");
  closeOtherDropdowns(counselorFilterDropdown);
});
const reasonFilterDropdownButton = document.getElementById(
  "filterDropdownButton2"
);
const reasonFilterDropdown = document.getElementById("filterDropdown2");
reasonFilterDropdownButton.addEventListener("click", () => {
  reasonFilterDropdown.classList.toggle("hidden");
  closeOtherDropdowns(reasonFilterDropdown);
});
const gradeFilterDropdownButton = document.getElementById(
  "filterDropdownButton3"
);
const gradeFilterDropdown = document.getElementById("filterDropdown3");
gradeFilterDropdownButton.addEventListener("click", () => {
  gradeFilterDropdown.classList.toggle("hidden");
  closeOtherDropdowns(gradeFilterDropdown);
});
const dateFilterDropdownButton = document.getElementById(
  "filterDropdownButton4"
);
const dateFilterDropdown = document.getElementById("filterDropdown4");
dateFilterDropdownButton.addEventListener("click", () => {
  dateFilterDropdown.classList.toggle("hidden");
  closeOtherDropdowns(dateFilterDropdown);
});

const dropdowns = [
  counselorFilterDropdown,
  reasonFilterDropdown,
  gradeFilterDropdown,
  dateFilterDropdown,
];

function closeOtherDropdowns(openedDropdown) {
  dropdowns.forEach((dropdown) => {
    if (dropdown !== openedDropdown) {
      if (!dropdown.classList.contains("hidden")) {
        dropdown.classList.add("hidden");
      }
    }
  });
}


function startOfDay(timestamp) {
  // Convert the timestamp from milliseconds to seconds
  let date = new Date(timestamp);

  // Set the time to the start of the day (midnight)
  date.setHours(0, 0, 0, 0);

  // Convert back to the large number format (milliseconds since the Unix epoch)
  return date.getTime();
}
let loggedIn = true;
window.onload = async function () {
  if (!loggedIn) {
    window.location.href = "/login/";
  }
  let q = query(
    collection(db, "checkin"),
    where("date", ">=", Date.now() - 1000 * 86400 * 365)
  );
  let snapshot = await getCountFromServer(q);
  document.getElementById('yearly-meetings').innerText = snapshot._data.count.integerValue;
  q = query(collection(db, 'checkin'), where('date', '>=', Date.now()-(1000*86400*30)))
  snapshot = await getCountFromServer(q);
  document.getElementById('monthly-meetings').innerText = snapshot._data.count.integerValue;
  q = query(collection(db, 'checkin'), where('date', '>=', Date.now()-(1000*86400*7)))
  snapshot = await getCountFromServer(q);
  document.getElementById('weekly-meetings').innerText = snapshot._data.count.integerValue;

  // console.log(startOfDay(1694558471326));
  let template = document.getElementById("student-entry");

  let totalQuery = query(collection(db, "checkin"), where("date", ">=", Date.now() - 1000 * 86400 * 365));
  let querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    // console.log(person)
    const clone = template.content.cloneNode(true);
    const elements = clone.childNodes[1].children;
    // console.log(elements)
    elements[0].innerHTML = `<a href="https://mail.google.com/mail/?view=cm&to=${doc.data().email}" class="group-hover:underline" target="_blank">${capitalizeFirstLetter(doc.data().firstName)}</a>`;
    elements[1].innerHTML = `<a href="https://mail.google.com/mail/?view=cm&to=${doc.data().email}" class="group-hover:underline" target="_blank">${capitalizeFirstLetter(doc.data().lastName)}</a>`;

    elements[2].innerHTML = capitalizeFirstLetter(doc.data().counselor);
    elements[3].innerHTML = doc.data().grade;

    elements[4].innerHTML = formatDate(doc.data().date);
    elements[4].id = doc.data().date;

    elements[5].innerHTML = doc.data().reason;
    // elements[5].innerHTML = person.email
    const container = document.getElementById("student-entries");
    container.appendChild(clone);
  });
};

var input,
  filter,
  table,
  tr,
  firstName,
  lastName,
  i,
  firstNameTextValue,
  lastNameTextValue;
input = document.getElementById("student-name");
table = document.getElementById("table-student-entries");
tr = table.getElementsByTagName("tr");
// console.log(tr);

function nameSearch() {
  filter = input.value.toUpperCase();
  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    firstName = tr[i].getElementsByTagName("td")[0];
    lastName = tr[i].getElementsByTagName("td")[1];
    if (firstName) {
      const firstNameElement = firstName.children[0];
      firstNameTextValue = firstNameElement.textContent;
      firstNameTextValue = firstNameTextValue.toUpperCase();
      // console.log(firstNameTextValue, filter);

      const lastNameElement = lastName.children[0];
      lastNameTextValue = lastNameElement.textContent;
      lastNameTextValue = lastNameTextValue.toUpperCase();
      console.log(lastNameTextValue, filter);

      const hasFirstName = firstNameTextValue.indexOf(filter) > -1;
      const hasLastName = lastNameTextValue.indexOf(filter) > -1;
      if (hasFirstName || hasLastName) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
input.addEventListener("keyup", nameSearch);

const filterDropdownCheckboxes = document.querySelectorAll(
  '#filterDropdown input[type="checkbox"]'
);
const filterDropdown2Checkboxes = document.querySelectorAll(
  '#filterDropdown2 input[type="checkbox"]'
);

const filterDropdown3Checkboxes = document.querySelectorAll(
  '#filterDropdown3 input[type="checkbox"]'
);

const filterDropdown4Radios = document.querySelectorAll(
  '#filterDropdown4 input[type="radio"]'
);

function getCheckedValues(checkboxes) {
  const checkedValues = [];
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedValues.push(checkbox.value);
    }
  });
  return checkedValues;
}

// Event listener for filterDropdown checkboxes
filterDropdownCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      counselorFilters.push(checkbox.id);
    } else {
      const index = counselorFilters.indexOf(checkbox.id);
      if (index !== -1) {
        counselorFilters.splice(index, 1);
      }
    }
  });
});

// Event listener for filterDropdown2 checkboxes
filterDropdown2Checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      reasonFilters.push(checkbox.value);
    } else {
      let index = reasonFilters.indexOf(checkbox.value);
      if (index > -1) {
        reasonFilters.splice(index, 1);
      }
    }
    // You can use counselorFilters for further processing
  });
});

// Event listener for filterDropdown3 checkboxes
filterDropdown3Checkboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      gradeFilters.push(checkbox.id);
    } else {
      const index = gradeFilters.indexOf(checkbox.id);
      if (index !== -1) {
        gradeFilters.splice(index, 1);
      }
    }
  });
});

filterDropdown4Radios.forEach((radio) => {
  radio.addEventListener("change", () => {
    if (radio.checked) {
      dateFilters = radio.id;
    } else {
      const index = dateFilters.indexOf(radio.id);
      if (index !== -1) {
        gradeFilters.splice(index, 1);
      }
    }
  });
});

let counselorFilters = [];
let gradeFilters = [];
let dateFilters = "";
let reasonFilters = [];
// Function to apply filters
function applyFilters() {
  const entries = document.querySelectorAll(".student-entry");
  // parse through all of the checkboxes and see which ones are checked
  // if they are checked, then add them to an array of filter strings
  // parse through all of the data and see if the specified column value is contained in the filter array

  // Get checked values from filterDropdown checkboxes
  console.log(counselorFilters);
  console.log(gradeFilters);
  console.log(dateFilters);
  console.log(reasonFilters);
  for (i = 0; i < reasonFilters.length; i++) {
    reasonFilters[i] = reasonFilters[i].toLowerCase();
    console.log(reasonFilters[i]);
  }
  // Check the table with the filters

  for (i = 1; i < tr.length; i++) {
    // Get all the sorting-necessary values of the table row
    let counselorColumn = tr[i]
      .getElementsByTagName("td")[2]
      .textContent.toLowerCase();
    // console.log(counselorColumn);
    let gradeColumn = tr[i]
      .getElementsByTagName("td")[3]
      .textContent.toLowerCase();
    let dateColumn = parseInt(tr[i].getElementsByTagName("td")[4].id);
    let reasonColumn = tr[i]
      .getElementsByTagName("td")[5]
      .textContent.toLowerCase();

    // Check what date the table value must be ahead of
    let afterThisDate = 0;
    switch (dateFilters) {
      case "alltime":
        afterThisDate = 0;
        break;
      case "year":
        afterThisDate = startOfDay(Date.now()) - 86400 * 365;
        break;
      case "month":
        afterThisDate = startOfDay(Date.now()) - 86400 * 30;
        break;
      case "week":
        afterThisDate = startOfDay(Date.now()) - 86400 * 7;
        break;
      case "day":
        break;
      default:
        break;
    }
    afterThisDate = startOfDay(afterThisDate);
    // console.log(afterThisDate, dateColumn);

    // console.log(tr[i]);
    // check if the table row matches the filters
    const counselorMatch =
      counselorFilters.includes(counselorColumn) ||
      counselorFilters.length == 0; // the value is filtered yes
    const gradeMatch =
      gradeFilters.includes(gradeColumn) || gradeFilters.length == 0;
    const dateMatch = dateColumn <= afterThisDate || dateFilters == "";
    const reasonMatch =
      reasonFilters.includes(reasonColumn) || reasonFilters.length == 0;

    console.log(counselorMatch, gradeMatch, dateMatch, reasonMatch);
    if (counselorMatch && gradeMatch && dateMatch) {
      tr[i].style.display = "";
      if (reasonMatch) {
        tr[i].style.display = "";
        console.log("match");
      } else {
        tr[i].style.display = "none";
          console.log("reason doesn't match", reasonFilters, reasonColumn);
      }
    } else {
      tr[i].style.display = "none";
    }
  }
}

document.getElementById("filterButton").addEventListener("click", applyFilters);


const testData = [
  {
    firstName: "Maryellen",
    lastName: "Sargent",
    email: "maryellensargent@zboo.com",
    date: 292715684058,
    counselor: "Glowik",
    grade: "10",
    reason: "Organization/Time Management Help",
  },
  {
    firstName: "Wade",
    lastName: "Hopper",
    email: "wadehopper@zboo.com",
    date: 780987232362,
    counselor: "Glowik",
    grade: "12",
    reason: "Class/Grade Concern",
  },
  {
    firstName: "Kennedy",
    lastName: "Reilly",
    email: "kennedyreilly@zboo.com",
    date: 463768509861,
    counselor: "Hewitt",
    grade: "9",
    reason: "I'm concerned about a friend",
  },
  {
    firstName: "Weiss",
    lastName: "Bailey",
    email: "weissbailey@zboo.com",
    date: 1291233002131,
    counselor: "Glowik",
    grade: "11",
    reason: "I'm concerned about a friend",
  },
  {
    firstName: "Colleen",
    lastName: "Banks",
    email: "colleenbanks@zboo.com",
    date: 192225583280,
    counselor: "Wallin",
    grade: "10",
    reason: "Schedule Question/Concern",
  },
  {
    firstName: "Nunez",
    lastName: "Sanders",
    email: "nunezsanders@zboo.com",
    date: 380588685475,
    counselor: "Stratton",
    grade: "10",
    reason: "Organization/Time Management Help",
  },
  {
    firstName: "Robert",
    lastName: "Harris",
    email: "robertharris@zboo.com",
    date: 1492893745771,
    counselor: "Stratton",
    grade: "12",
    reason: "Schedule Question/Concern",
  },
  {
    firstName: "Gabriela",
    lastName: "Davis",
    email: "gabrieladavis@zboo.com",
    date: 1073508540329,
    counselor: "Stratton",
    grade: "11",
    reason: "Personal or Mental Health Check In",
  },
  {
    firstName: "Kramer",
    lastName: "Acevedo",
    email: "krameracevedo@zboo.com",
    date: 818370036362,
    counselor: "Wallin",
    grade: "12",
    reason: "Personal or Mental Health Check In",
  },
  {
    firstName: "Livingston",
    lastName: "Serrano",
    email: "livingstonserrano@zboo.com",
    date: 1240752324780,
    counselor: "Stratton",
    grade: "11",
    reason: "I'm concerned about a friend",
  },
  {
    firstName: "Letitia",
    lastName: "Farley",
    email: "letitiafarley@zboo.com",
    date: 214558549988,
    counselor: "Wallin",
    grade: "9",
    reason: "Yearly Meeting - Freshman, Sophomore, Junior, Senior Meeting",
  },
  {
    firstName: "Gamble",
    lastName: "Strong",
    email: "gamblestrong@zboo.com",
    date: 247746207450,
    counselor: "Hewitt",
    grade: "9",
    reason: "Class/Grade Concern",
  },
  {
    firstName: "Day",
    lastName: "Schwartz",
    email: "dayschwartz@zboo.com",
    date: 615957350868,
    counselor: "Stratton",
    grade: "10",
    reason: "Personal or Mental Health Check In",
  },
  {
    firstName: "Allison",
    lastName: "Weber",
    email: "allisonweber@zboo.com",
    date: 1287851918437,
    counselor: "Stratton",
    grade: "10",
    reason: "Class/Grade Concern",
  },
  {
    firstName: "Douglas",
    lastName: "Walter",
    email: "douglaswalter@zboo.com",
    date: 332546240228,
    counselor: "Stratton",
    grade: "12",
    reason: "Schedule Question/Concern",
  },
  {
    firstName: "Marci",
    lastName: "Cohen",
    email: "marcicohen@zboo.com",
    date: 356655093651,
    counselor: "Hewitt",
    grade: "9",
    reason: "I'm concerned about a friend",
  },
  {
    firstName: "Frost",
    lastName: "Patrick",
    email: "frostpatrick@zboo.com",
    date: 465654952222,
    counselor: "Stratton",
    grade: "10",
    reason: "Yearly Meeting - Freshman, Sophomore, Junior, Senior Meeting",
  },
  {
    firstName: "Rhea",
    lastName: "Coleman",
    email: "rheacoleman@zboo.com",
    date: 636629170638,
    counselor: "Stratton",
    grade: "11",
    reason: "Yearly Meeting - Freshman, Sophomore, Junior, Senior Meeting",
  },
  {
    firstName: "Gina",
    lastName: "Maddox",
    email: "ginamaddox@zboo.com",
    date: 210393893518,
    counselor: "Glowik",
    grade: "9",
    reason: "Class/Grade Concern",
  },
  {
    firstName: "Cotton",
    lastName: "Tate",
    email: "cottontate@zboo.com",
    date: 39732894912,
    counselor: "Glowik",
    grade: "12",
    reason: "Personal or Mental Health Check In",
  },
  {
    firstName: "Macdonald",
    lastName: "Lloyd",
    email: "macdonaldlloyd@zboo.com",
    date: 282986654828,
    counselor: "Hewitt",
    grade: "11",
    reason: "Organization/Time Management Help",
  },
  {
    firstName: "Mia",
    lastName: "Doyle",
    email: "miadoyle@zboo.com",
    date: 684073089473,
    counselor: "Hewitt",
    grade: "9",
    reason: "College/Career",
  },
  {
    firstName: "Adams",
    lastName: "Simmons",
    email: "adamssimmons@zboo.com",
    date: 1177621833050,
    counselor: "Hewitt",
    grade: "11",
    reason: "Class/Grade Concern",
  },
  {
    firstName: "Willa",
    lastName: "Yang",
    email: "willayang@zboo.com",
    date: 389262440439,
    counselor: "Glowik",
    grade: "11",
    reason: "Schedule Question/Concern",
  },
  {
    firstName: "Elma",
    lastName: "Rowe",
    email: "elmarowe@zboo.com",
    date: 409840262934,
    counselor: "Wallin",
    grade: "12",
    reason: "Class/Grade Concern",
  },
  {
    firstName: "Porter",
    lastName: "Henderson",
    email: "porterhenderson@zboo.com",
    date: 918559436188,
    counselor: "Stratton",
    grade: "12",
    reason: "Personal or Mental Health Check In",
  },
  {
    firstName: "Bright",
    lastName: "Maldonado",
    email: "brightmaldonado@zboo.com",
    date: 698787766179,
    counselor: "Glowik",
    grade: "12",
    reason: "Yearly Meeting - Freshman, Sophomore, Junior, Senior Meeting",
  },
  {
    firstName: "Mai",
    lastName: "Trujillo",
    email: "maitrujillo@zboo.com",
    date: 1466736756549,
    counselor: "Hewitt",
    grade: "9",
    reason: "Schedule Question/Concern",
  },
  {
    firstName: "Underwood",
    lastName: "Elliott",
    email: "underwoodelliott@zboo.com",
    date: 1481482347932,
    counselor: "Hewitt",
    grade: "12",
    reason: "Personal or Mental Health Check In",
  },
  {
    firstName: "Vinson",
    lastName: "Riley",
    email: "vinsonriley@zboo.com",
    date: 442037113537,
    counselor: "Stratton",
    grade: "12",
    reason: "I'm concerned about a friend",
  },
  {
    firstName: "Terrie",
    lastName: "Conrad",
    email: "terrieconrad@zboo.com",
    date: 508605772527,
    counselor: "Glowik",
    grade: "9",
    reason: "College/Career",
  },
];