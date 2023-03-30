import { LOCAL_API_URL } from "../../../settings.js";
import { sanitizeStringWithTableRows } from "../../../utils.js";
import { handleHttpErrors } from "../../../utils.js";

export function initUsers() {
  document.getElementById("tbl-body").onclick = showUserDetails;
  getAllUsers();
}

export async function getAllUsers() {
  try {
    const users = await fetch(LOCAL_API_URL + "/users").then((res) =>
    handleHttpErrors(res));
    showAllData(users);
  } catch (err) {
    
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
      <button id="row-btn_delete_${user.username}" type="button"  class="btn btn-sm btn-danger">Delete</button> 
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
  } else if (btnAction === "delete") {
  } else if (btnAction === "edit") {
    window.router.navigate("userAdmin/editUser?username=" + username);
  }
}
