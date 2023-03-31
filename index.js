// import navigo
import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
    setActiveLink, adjustForMissingHash, renderTemplate, loadTemplate
  } from "./utils.js"
  
  import { initLogin,logout, checkAdmin } from "./pages/loginPage/loginPage.js";
  //import { loadAdminDom } from "./pages/calendarPage/adminCalendar.js"
  import { loadUserDom } from "./pages/userCalendarPage/userCalendar.js"
  import { initiateAdminCalendar } from "./pages/calendarPage/adminCalendar.js"

  console.log("testfhdherh")
  window.addEventListener("load", async () => {
  
    const templateLogin = await loadTemplate("./pages/loginPage/loginPage.html")
    const templateAdminCalendar = await loadTemplate("./pages/calendarPage/adminCalendar.html")
    const templateUserCalendar = await loadTemplate("./pages/userCalendarPage/userCalendar.html")

  
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
          <img style="width:20%;max-width:600px;margin-top:1em;margin-left: 550px;" src="./images/logo.png">
          <p style='margin-top:1em;font-size: 1em;color:darkgray;'>
            Vagtplanen is a software which helps you get a nice view over all your shifts.<span style='font-size:2em;'>&#128516;</span>
          </p>
       `,
        "/loginPage": () => {
            console.log("The function was called.")
          renderTemplate(templateLogin, "content")
          initLogin()
        },
        "/logout": () => {
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