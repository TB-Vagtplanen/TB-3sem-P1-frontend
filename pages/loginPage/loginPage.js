import { API_URL, LOCAL_API_URL} from "../../settings.js"
import {handleHttpErrors} from "../../utils.js"

const URL = API_URL + "/auth/login"

export function initLogin() {
  console.log("attempting Logging in")
  document.getElementById("login-btn").onclick = login
}

export function logout(){
  document.getElementById("login-id").style.display="block"
  document.getElementById("logout-id").style.display="none"
  document.getElementById("adminCalendar-id").style.display="none"
  document.getElementById("userCalendar-id").style.display="none"
  document.getElementById("addUser").style.display="none"
  document.getElementById("editUser").style.display="none"
  document.getElementById("showUsers").style.display="none"
  localStorage.clear()


}

export function checkAdmin(){
    return localStorage.getItem("roles") == "ADMIN"
}


async function login(evt) {
  document.getElementById("error").innerText = ""

  //Added DOMPurify.sanitize to add security. With this we prevent cross-site scripting (XSS) attacks and other types of malicious code injection.
  const username = DOMPurify.sanitize(document.getElementById("username").value)
  const password = DOMPurify.sanitize(document.getElementById("password").value)


  //const userDto = {username:username,password:password}
  const userDto = { username, password }

  const options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(userDto)
  }
  try {
    const response = await fetch(URL, options).then(res=>handleHttpErrors(res))
    localStorage.setItem("user",response.username)
    localStorage.setItem("token",response.token)
    localStorage.setItem("roles",response.roles)

    document.getElementById("login-id").style.display="none"
    document.getElementById("logout-id").style.display="block"
    
    console.log(localStorage.getItem("roles"))

    if (localStorage.getItem("roles", response.roles)=="ADMIN") {
      document.getElementById("adminCalendar-id").style.display="block"
      document.getElementById("addUser").style.display="block"
      document.getElementById("editUser").style.display="block"
      document.getElementById("showUsers").style.display="block"
    } else {
     document.getElementById("userCalendar-id").style.display="block"
     
    }

    window.router.navigate("")
  } catch (err) {
    document.getElementById("error").innerText = err.message
  }

}