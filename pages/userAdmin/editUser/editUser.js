import { LOCAL_API_URL } from "../../../settings.js";
import { handleHttpErrors, makeOptions } from "../../../utils.js";
import { sanitizeStringWithTableRows } from "../../../utils.js";

export async function initEditUser(match) {
  document.getElementById("btn-find-user").onclick = fetchUserData;
  document.getElementById("phoneList").onclick = handlePhoneButtons;
  document.getElementById("btn-add-phone").onclick = addPhone;
  document.getElementById("btn-edited-user-submit").onclick = submitEditedUser;

  if (match?.params?.username) {
    const username = match.params.username;
    try {
      renderUser(username);
      document.getElementById("username").setAttribute("readonly","")
      // hvis vi kommer ind med et username parameter, så fetch data
    } catch (err) {
      // skriv til en DOM div med en custom fejl besked, Husk at clear det når vi gør noget andet/nyt
    }
  }
}

const navigoRoute = "userAdmin/editUser";

function fetchUserData() {
  const username = document.getElementById("username").value;
  if (!username) {
    document.getElementById("error").innerText = "Please provide an id";
    return;
  }
  try {
    renderUser(username);
    const queryString = "?username=" + username;
    document.getElementById("username").removeAttribute("readonly")


    window.router.navigate(`/${navigoRoute}${queryString}`, {
      callHandler: false,
      updateBrowserURL: true,
    });
  } catch (err) {
    console.log("UPS " + err.message);
  }
}

async function renderUser(username) {
  document.getElementById("phoneList").innerHTML = ``;
  document.getElementById("error").innerText = ""


  try {
    const options = makeOptions("GET", "", true)
    const user = await fetch(LOCAL_API_URL + "/users/" + username, options).then((res) =>
      handleHttpErrors(res)
    );

    if (Object.keys(user).length === 0) {
      //checks for an empty object = {}
      throw new Error("No user found for username:" + username);
    }

    document.getElementById("username").value = user.username;
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("street").value = user.street;
    document.getElementById("zip").value = user.zip;
    document.getElementById("city").value = user.city;
    document.getElementById("email").value = user.email;

    showAllData(user.phones);
  } catch (err) {
    document.getElementById("error").innerText = err;
  }
}

const usersPhones = {};

function showAllData(phones) {
  for (const [phoneName, phoneNumber] of Object.entries(phones)) {
    const phoneRow = document.createElement("tr");
    phoneRow.setAttribute("id", "row_" + phoneName);
    phoneRow.innerHTML = `
    <td id="row_${phoneName}">${phoneName}</td>
    <td>${phoneNumber}</td>
      <button id="row-btn_delete_${phoneName}" type="button"  class="btn btn-sm btn-danger">Delete</button> 
      `;
    phoneList.appendChild(phoneRow);
  }
}

async function handlePhoneButtons(evt) {
  const target = evt.target;
  if (!target.id.startsWith("row-btn_")) {
    return;
  }
  const parts = target.id.split("_");
  const phoneName = parts[2];
  const btnAction = parts[1];
  if (btnAction === "delete") {
    const rowid = `row_${phoneName}`;
    const phonerow = document.getElementById(rowid);
    phonerow.remove();
  }
}

function addPhone() {
  let phoneList = document.getElementById("phoneList");
  const phoneName = document.getElementById("phoneName").value;
  const phoneNumber = document.getElementById("phoneNumber").value;

  if (phoneName && phoneNumber) {
    const phoneRow = document.createElement("tr");
    phoneRow.setAttribute("id", "row_" + phoneName);
    phoneRow.innerHTML = `
        <td>${phoneName}</td>
        <td>${phoneNumber}</td>
        <button id="row-btn_delete_${phoneName}" type="button"  class="btn btn-sm btn-danger">Delete</button> 
        `;
    phoneList.appendChild(phoneRow);

    phoneList = sanitizeStringWithTableRows(phoneList);

    document.getElementById("phoneName").value = "";
    document.getElementById("phoneNumber").value = "";
  }
}

function gatherUserData() {
  const user = {};

  user.username = document.getElementById("username").value;
  user.firstName = document.getElementById("firstName").value;
  user.lastName = document.getElementById("lastName").value;
  user.city = document.getElementById("city").value;
  user.zip = document.getElementById("zip").value;
  user.street = document.getElementById("street").value;
  user.email = document.getElementById("email").value;

  user.phones = {};
  const phoneList = document.getElementById("phoneList");
  const rows = phoneList.getElementsByTagName("tr");
  for (let i = 0; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    const phoneName = cells[0].textContent;
    const phoneNumber = cells[1].textContent;
    user.phones[phoneName] = phoneNumber;
  }
  return user;
}

async function submitEditedUser() {
  const options = makeOptions("PUT", gatherUserData(), true);

  try {
    //maybe use modal as a response
    
    const user = await fetch(LOCAL_API_URL + "/users", options).then((res) =>
      handleHttpErrors(res)
    );
  } catch (err) {}
}
