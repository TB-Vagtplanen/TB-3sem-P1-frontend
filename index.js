// import navigo
import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
    setActiveLink, adjustForMissingHash, renderTemplate, loadTemplate
  } from "./utils.js"
  
  import { initLogin,logout } from "./pages/loginPage/loginPage.js"
  import { initAddUser } from "./pages/userAdmin/addUser/addUser.js"
  import { initEditUser } from "./pages/userAdmin/editUser/editUser.js"
  import { initDeleteUser } from "./pages/userAdmin/deleteUser/deleteUser.js"


  console.log("testfhdherh")
  window.addEventListener("load", async () => {
  
    const templateLogin = await loadTemplate("./pages/loginPage/loginPage.html")
    const templateAddUser = await loadTemplate("./pages/userAdmin/addUser/addUser.html")
    const templateEditUser = await loadTemplate("./pages/userAdmin/editUser/editUser.html")
    const templateDeleteUser = await loadTemplate("./pages/userAdmin/deleteUser/deleteUser.html")

  
    adjustForMissingHash()
  
    const router = new Navigo("/", { hash: true });
    //Not especially nice, BUT MEANT to simplify things. Make the router global so it can be accessed from all js-files
    window.router = router
  
    router
      .hooks({
        before(done, match) {
          setActiveLink("menu", match.url)
          done()
        }
      })
      .on({
        //For very simple "templates", you can just insert your HTML directly like below
        "/": () => document.getElementById("content").innerHTML = `
          <h2>Home</h2>
       `,
        "/loginPage": () => {
            console.log("The function was called.")
          renderTemplate(templateLogin, "content")
          initLogin()
        },
        "/logout": () => {
          logout()
        },
        "/userAdmin/addUser": () => {
          renderTemplate(templateAddUser, "content")
          initAddUser()
        },
        "/userAdmin/editUser": () => {
          renderTemplate(templateEditUser, "content")
          initEditUser()
          
        },
        "/userAdmin/deleteUser": () => {
          renderTemplate(templateDeleteUser, "content")
          initDeleteUser()

        }
        
      })
      .notFound(() => {
        renderTemplate(templateNotFound, "content")
      })
      .resolve()
  });
  

    
  export function checkRole(role) {
    //look at storage roles, return boolean check. If true, show content, if not, dont
  }
  
  window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
      + ' Column: ' + column + ' StackTrace: ' + errorObj);
  }