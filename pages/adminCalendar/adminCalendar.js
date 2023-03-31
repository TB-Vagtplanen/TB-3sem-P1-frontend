import {
  handleHttpErrors,
  sanitizeStringWithTableRows,
  makeOptions,
} from "../../utils.js";
import { LOCAL_API_URL } from "../../settings.js";


export function initAdminCalendar() {
    document.getElementById("btns-weeks").onclick = handleWeekButtons;
    setWeekNumberAndYear()
    renderWeek()

 
}

function getWeekNumberFromDate(date) {
    // Get the day of the week (0 - 6)
    const dayOfWeek = date.getDay();
  
    // Get the date of the month (1 - 31)
    const dayOfMonth = date.getDate();
  
    // Set the date to the beginning of the week (Monday)
    const startOfWeek = new Date(date);
    startOfWeek.setDate(dayOfMonth - dayOfWeek + 1);
  
    // Calculate the week number based on the Thursday of the week
    const yearStart = new Date(startOfWeek.getFullYear(), 0, 1);
    const thursday = new Date(startOfWeek);
    thursday.setDate(startOfWeek.getDate() + 3 - (startOfWeek.getDay() + 6) % 7);
    const weekNumber = Math.floor((thursday - yearStart) / (7 * 24 * 60 * 60 * 1000)) + 1;
  
    return weekNumber;
  }


  function setWeekNumberAndYear(date) {
    let today = new Date()
    if (date) {
        today = date;
    }
    document.getElementById("year-number").innerText = today.getFullYear()
    document.getElementById("week-number").innerText = getWeekNumberFromDate(today)
}

function getWeekNumberAndYear() {

    const year = document.getElementById("year-number").innerText
    const week = document.getElementById("week-number").innerText
    const date = getFirstDayOfWeekNumberAndYear(year, week)
    return getWeekFromMonday(date)
}
 
function getWeekFromMonday(date) {
    const week = [];
    const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay()+1);
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
        week.push(date);
    }
    return week
}


function getFirstDayOfWeekNumberAndYear(year, weekNumber) {
    const januaryFirst = new Date(year, 0, 1);
    const daysToFirstWeekday = (7 - januaryFirst.getDay() + 1) % 7;
    const firstWeekday = new Date(year, 0, 1 + (weekNumber - 1) * 7 + daysToFirstWeekday);
  
    return firstWeekday;
  }

async function fetchUsers() {
    const URL = LOCAL_API_URL + "/users/active"
    const options = makeOptions("GET", "", true)
    try {
        const json = await fetch(URL, options).then(response => handleHttpErrors(response))
        return json
    }
    catch (err ) {
        console.log(err)
    }
}


function formatDate(date, wantTime, wantYear) {
    console.log(date)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    console.log(year, month, day)

  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  let string = `${month}-${day}`
  if(wantYear) {
    string = `${year}-`+string  
  }
  if(wantTime) {
    string = string + ` ${hours}:${minutes}:${seconds}`
  }
  return string
}

function handleWeekButtons(evt) {
  const target = evt.target;
  if (!target.id.startsWith("btn-go-week")) {
    return;
  }
  const weekNumber = document.getElementById("week-number");
  const number = weekNumber.innerText;

  const parts = target.id.split("_");
  const action = parts[1];
  if (action === "forward") {
    weekNumber.innerHTML = getWeekNumberFromDate();
  } else if (action === "backward") {
    weekNumber.innerHTML = parseInt(number) - 1;
  }
  renderWeek()
}

function renderWeek() {
    const week = getWeekNumberAndYear()
    const headers = Array.from(document.querySelectorAll('th[id^="day-"]'));
    for(let i = 0; i < headers.length; i++) {
      headers[i].innerText = formatDate(week[i], false, false)
    }
} 
