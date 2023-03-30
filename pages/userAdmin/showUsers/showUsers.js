import { LOCAL_API_URL } from "../../../settings.js";
import { makeOptions, sanitizeStringWithTableRows } from "../../../utils.js";
import { handleHttpErrors } from "../../../utils.js";

export function initUsers() {
  document.getElementById("tbl-body").onclick = showUserDetails;
  document.getElementById("user-details-modal").onclick = handleModalExit
  document.getElementById("btn-show-all-workers").onclick = getAllUsers;
  document.getElementById("btn-show-active-workers").onclick = getAllActiveUsers;
  getAllActiveUsers()
}

let fetchedUsers = {}

export async function getAllUsers() {

  const options = makeOptions("GET", "", true) 

  try {
    const users = await fetch(LOCAL_API_URL + "/users", options).then((res) =>
    handleHttpErrors(res));
    showAllData(users);
    fetchedUsers = users;
  } catch (err) {
    document.getElementById("error").innerText = err
    
  }
}

async function getAllActiveUsers() {

  const options = makeOptions("GET", "", true) 

  try {
    const users = await fetch(LOCAL_API_URL + "/users/active", options).then((res) =>
    handleHttpErrors(res));
    showAllData(users);
    fetchedUsers = users;
  } catch (err) {
    document.getElementById("error").innerText = err
    
  }
}

function showAllData(data) {
  const tableRowsArray = data.map(
    (user) => `
    <tr>                                
      <td>${user.username} </td>              
      <td>${user.firstName} ${user.lastName} </td>                     
      <td>${user.street} </td>  
      <td>${user.city} </td>
      <td>
      <button id="row-btn_details_${user.username}" type="button"  class="btn btn-sm btn-primary">Details</button> 
      <button id="row-btn_edit_${user.username}" type="button"  class="btn btn-sm btn-primary">Edit</button> 
      <button id="row-btn_archive_${user.username}" type="button"  class="btn btn-sm btn-danger">Archive</button> 
      </td>      
    </tr>`
  );

  const tableRowsString = tableRowsArray.join("\n");
  document.getElementById("tbl-body").innerHTML =
    sanitizeStringWithTableRows(tableRowsString);
}


async function showUserDetails(evt) {
  const target = evt.target;

  if (!target.id.startsWith("row-btn_")) {
    return;
  }

  const parts = target.id.split("_");
  const username = parts[2];
  const btnAction = parts[1];
  if (btnAction === "details") {
    showUserModal(username)
  } else if (btnAction === "archive") {
    archiveUser(username)
    getAllActiveUsers()
  } else if (btnAction === "edit") {
    window.router.navigate("userAdmin/editUser?username=" + username);
  }
}


function handleModalExit(evt) {
  if (evt.target.id === "user-details-modal") {
    const modal = document.getElementById("user-details-modal");
    if( modal.style.display === "block") {
      modal.style.display = "none";
    }
  } else {
    evt.stopPropagation()
  }


}


async function showUserModal (username) {
  const user = fetchedUsers.find(u => u.username === username);
  const modal = document.getElementById("user-details-modal");
  const modalContent = modal.querySelector(".modal-content");

  const phones = Object.entries(user.phones).map(([name, number]) => `${name}: ${number}`);
  const phoneHtml = phones.map(phone => `<p>${phone}</p>`).join('');
  
  const userHtml = `
    <h2>User Details</h2>
    <p><strong>Username:</strong> ${user.username}</p>
    <p><strong>Full Name:</strong> ${user.firstName} ${user.lastName}</p>
    <p><strong>Email</strong> ${user.email}</p>
    <p><strong>Address:</strong> ${user.street}, ${user.zip}, ${user.city}</p>
    <div><strong>Phones:</strong>${phoneHtml}</div>
    `;

  modalContent.innerHTML = userHtml;

  modal.style.display = "block";

}

async function archiveUser(username) {
  try {
    const options = makeOptions("PATCH", {}, true)
      
    const users = await fetch(LOCAL_API_URL + "/users/enabled/" + username, options).then((res) =>
    handleHttpErrors(res));
  } catch (err) {

  }
}

