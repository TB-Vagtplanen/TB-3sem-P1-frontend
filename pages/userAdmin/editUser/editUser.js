import { LOCAL_API_URL } from "../../../settings.js";
import { handleHttpErrors } from "../../../utils.js";

export async function initEditUser(match) {
  document.getElementById("btn-find-user").onclick = fetchUserData;
  document.getElementById("phoneList").onclick = handlePhoneButtons;
  document.getElementById("btn-add-phone").onclick = addPhone


  if (match?.params?.username) {
    const username = match.params.username;
    try {
        renderUser(username)
      // hvis vi kommer ind med et username parameter, så fetch data
    } catch (err) {
      // skriv til en DOM div med en custom fejl besked, Husk at clear det når vi gør noget andet/nyt
    }
  }
}

const navigoRoute = "userAdmin/editUser"

function fetchUserData() {
  const username = document.getElementById("username").value;
  if (!username) {
    document.getElementById("error").innerText = "Please provide an id";
    return;
  }
  try {
    renderUser(username);
    const queryString = "?username=" + username

    window.router.navigate(`/${navigoRoute}${queryString}`, {
      callHandler: false,
      updateBrowserURL: true,
    });
  } catch (err) {
    console.log("UPS " + err.message);
  }
}

async function renderUser(username) {
    //clear data
    document.getElementById("phoneList").innerHTML = ``

  try {
    const user = await fetch(LOCAL_API_URL + "/users/" + username)
      .then(res => handleHttpErrors(res));

    if (Object.keys(user).length === 0) {
      //checks for an empty object = {}
      throw new Error("No user found for username:" + username);
    }


    // transfer data to HTML
    document.getElementById("username").value = user.username
    document.getElementById("firstName").value = user.firstName;
    document.getElementById("lastName").value = user.lastName;
    document.getElementById("street").value = user.street;
    document.getElementById("zip").value = user.zip;
    document.getElementById("city").value = user.city;
    document.getElementById("email").value = user.email;

    showAllData(user.phones)
  } catch (err) {
    // edit HTML error div to reflect what happened
  }
}



function showAllData(phones) {
  // Loop through the phones object and add new rows to the table
  for (const [phoneName, phoneNumber] of Object.entries(phones)) {
    const phoneRow = document.createElement("tr");
    phoneRow.innerHTML = `
      <td>${phoneName}</td>
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
    alert("hej")
  }


  
}

function addPhone() {
    const phoneList = document.getElementById("phoneList");
    const phoneName = document.getElementById("phoneName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
  
    if (phoneName && phoneNumber) {
      phones[phoneName] = phoneNumber
  
      // Create a new phone entry element
      const phoneRow = document.createElement("tr");
      phoneRow.innerHTML = `
        <td>${phoneName}</td>
        <td>${phoneNumber}</td>
      `;
      phoneList.appendChild(phoneRow);

      // Clear the input fields
      document.getElementById("phoneName").value = ""
      document.getElementById("phoneNumber").value = ""
    }
}