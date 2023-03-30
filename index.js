// import navigo
import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
    setActiveLink, adjustForMissingHash, renderTemplate, loadTemplate
  } from "./utils.js"
  
  import { initLogin,logout } from "./pages/loginPage/loginPage.js"
  import { initAddUser } from "./pages/userAdmin/addUser/addUser.js"
  import { initEditUser } from "./pages/userAdmin/editUser/editUser.js"
  import { initUsers } from "./pages/userAdmin/showUsers/showUsers.js"


  window.addEventListener("load", async () => {
  
    const templateLogin = await loadTemplate("./pages/loginPage/loginPage.html")
    const templateAddUser = await loadTemplate("./pages/userAdmin/addUser/addUser.html")
    const templateEditUser = await loadTemplate("./pages/userAdmin/editUser/editUser.html")
    const templateShowUsers = await loadTemplate("./pages/userAdmin/showUsers/showUsers.html")

    
  
    adjustForMissingHash()
  
    const router = new Navigo("/", { hash: true });
    window.router = router
    

    router
      .hooks({
        before(done, match) {
          setActiveLink("menu", match.url)
          done()
        }
      })
      .on({
        "/": () => document.getElementById("content").innerHTML = `
          <h2>Home</h2>
       `,
        "/loginPage": () => {
          document.getElementById("error").innerText = ""
          renderTemplate(templateLogin, "content")
          initLogin()
          
        },
        "/logout": () => {
          document.getElementById("error").innerText = ""
          logout()
        },
        "/userAdmin/showUsers": () => {
          document.getElementById("error").innerText = ""
          renderTemplate(templateShowUsers, "content")
          initUsers()
        },
        "/userAdmin/addUser": () => {
          document.getElementById("error").innerText = ""
          renderTemplate(templateAddUser, "content")
          initAddUser()
        },
        "/userAdmin/editUser": (match) => {
          document.getElementById("error").innerText = ""
          renderTemplate(templateEditUser, "content")
          initEditUser(match)
        },
        
        
      })
      .notFound(() => {
        renderTemplate(templateNotFound, "content")
      })
      .resolve()
  });
  

  
  window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {
    alert('Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber
      + ' Column: ' + column + ' StackTrace: ' + errorObj);
  }