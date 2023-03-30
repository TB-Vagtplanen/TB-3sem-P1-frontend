import { LOCAL_API_URL, API_URL } from "../../../settings.js"
import { handleHttpErrors } from "../../../utils.js"

let phones = {};

export function initAddUser() {
    document.getElementById("btn-addUser").onclick = () => addUser(getUserDetails())
    document.getElementById("btn-add-phone").onclick = addPhone
    document.getElementById("phoneList").onclick = handlePhoneButtons

}


function makeUsername() {
    const fName = document.getElementById("firstName").value.toLowerCase()
    const lName = document.getElementById("lastName").value.toLowerCase()
    if(fName.length === 0) {
        return
    }
    let num = Math.floor((Math.random() * 4))+1
    let username = fName.slice(0,(6-num)) + lName.slice(0,num) + (Math.floor(Math.random() * 8999)+1000)
    return username
}

function makePassword() {
    // long random text
    const psd = ( Math.floor( Math.random() * 100000000 ) ) + 100000000
    return psd
}

async function addUser(user) {
    const options = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(user),
    }
    try {
        // security - get token and put bearer header 

        const data = await fetch(LOCAL_API_URL+"/users",options).then(handleHttpErrors)

        // return data - display
        // 'realistically' send email with username and password to the worker


    } catch (error) {

    }


}


function getUserDetails() {
    const user = {}
    user.firstName = document.getElementById("firstName").value
    user.lastName = document.getElementById("lastName").value
    user.street = document.getElementById("street").value
    user.zip = document.getElementById("zip").value
    user.city = document.getElementById("city").value
    user.email = document.getElementById("email").value
    user.username = makeUsername()
    user.password = makePassword()

    user.phones = {};
    const phoneList = document.getElementById("phoneList");
    const rows = phoneList.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName("td");
        const phoneName = cells[0].textContent;
        const phoneNumber = cells[1].textContent;
        user.phones[phoneName] = phoneNumber;
  }


    user.worker = true;
    return user
}



function addPhone() {
    const phoneList = document.getElementById("phoneList");
    const phoneName = document.getElementById("phoneName").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
  
    if (phoneName && phoneNumber) {
      phones[phoneName] = phoneNumber
  
      // Create a new phone entry element
      const phoneRow = document.createElement("tr");
      phoneRow.setAttribute("id", "row_" + phoneName);
      phoneRow.innerHTML = `
        <td>${phoneName}</td>
        <td>${phoneNumber}</td>
        <button id="row-btn_delete_${phoneName}" type="button"  class="btn btn-sm btn-danger">Delete</button> 

      `;
      phoneList.appendChild(phoneRow);

      // Clear the input fields
      document.getElementById("phoneName").value = ""
      document.getElementById("phoneNumber").value = ""
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

