// import navigo
import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
    setActiveLink, adjustForMissingHash, renderTemplate, loadTemplate
  } from "./utils.js"
  
  import { initLogin,logout, checkAdmin } from "./pages/loginPage/loginPage.js"
  import { initAddUser } from "./pages/userAdmin/addUser/addUser.js"
  import { initEditUser } from "./pages/userAdmin/editUser/editUser.js"
  import { initUsers } from "./pages/userAdmin/showUsers/showUsers.js"
  import { loadUserDOM } from "./pages/userCalendarPage/userCalendar.js"
  import { initLogin,logout, checkAdmin } from "./pages/loginPage/loginPage.js";
  //import { loadAdminDom } from "./pages/calendarPage/adminCalendar.js"
  import { loadUserDom as initUserCalendarDOM } from "./pages/userCalendarPage/userCalendar.js"
  import { initiateAdminCalendar } from "./pages/calendarPage/adminCalendar.js"

  window.addEventListener("load", async () => {
  
    const templateLogin = await loadTemplate("./pages/loginPage/loginPage.html")
    const templateAddUser = await loadTemplate("./pages/userAdmin/addUser/addUser.html")
    const templateEditUser = await loadTemplate("./pages/userAdmin/editUser/editUser.html")
    const templateShowUsers = await loadTemplate("./pages/userAdmin/showUsers/showUsers.html")

    const templateAdminCalendar = await loadTemplate("./pages/calendarPage/adminCalendar.html")
    const templateUserCalendar = await loadTemplate("./pages/userCalendarPage/userCalendar.html")

  
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

        "/": () => {
          document.getElementById("error").innerText = ""
          document.getElementById("content").innerHTML = `
          <h2>Home</h2>
          <img style="width:20%;max-width:600px;margin-top:1em;margin-left: 550px;" src="./images/logo.png">
          <p style='margin-top:1em;font-size: 1em;color:darkgray;'>
            Vagtplanen is a software which helps you get a nice view over all your shifts.<span style='font-size:2em;'>&#128516;</span>
          </p>
          `
        },
        "/loginPage": () => {
          document.getElementById("error").innerText = ""
        renderTemplate(templateLogin, "content")
        initLogin()
        
        },
        "/logout": () => {
          document.getElementById("error").innerText = ""
          logout()
          renderTemplate(templateLogin, "content")
        },
        "/adminCalendar": () => {
          if (checkAdmin()){
          renderTemplate(templateAdminCalendar, "content")
          initiateAdminCalendar();
          //loadAdminDom()
        } else{
          renderTemplate(templateUserCalendar, "content")
          loadUserDom()
        }
        },
        "/userCalendar": () => {
          renderTemplate(templateUserCalendar, "content")
          loadUserDom()
        }
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