// import navigo
import "https://unpkg.com/navigo"  //Will create the global Navigo object used below
import {
    setActiveLink, adjustForMissingHash, renderTemplate, loadTemplate
  } from "./utils.js"
  
  import { initLogin,logout } from "./pages/loginPage/loginPage.js"

  console.log("testfhdherh")
  window.addEventListener("load", async () => {
  
    const templateLogin = await loadTemplate("./pages/loginPage/loginPage.html")

  
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
          <img style="width:50%;max-width:600px;margin-top:1em;" src="./images/cars.png">
          <p style='margin-top:1em;font-size: 1.5em;color:darkgray;'>
            Car's 'R' Us - Created, as a help to make GREAT fullstack developers <span style='font-size:2em;'>&#128516;</span>
          </p>
       `,
        "/loginPage": () => {
            console.log("The function was called.")
          renderTemplate(templateLogin, "content")
          initLogin()
        },
        "/logout": () => {
          logout()
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