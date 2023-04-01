import { makeOptions } from "../../utils.js"; 
import { API_URL } from "../../settings.js";

export function loadUserDOM() {

  function updateCurrentMonth(date) {
    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const currentMonth = monthNames[date.getMonth()];
    document.getElementById('current-month').innerText = currentMonth;
  }
  
  function getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = (day + 6) % 7; // to set Monday as the first day of the week
    startOfWeek.setDate(startOfWeek.getDate() - diff);
    return startOfWeek;
  }

  function getWeekNumber(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  }

  function updateWeekNumber(date) {
    const weekNumber = getWeekNumber(date);
    document.getElementById("current-week").innerHTML = "Week " + weekNumber;
  }

  function updateWeekdayDates(shifts, startOfWeek) {
    // Clear all events
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    weekdays.forEach(weekday => {
      document.getElementById(weekday + "-event").className = "";
      document.getElementById(weekday + "-title").innerHTML = "";
      document.getElementById(weekday + "-time").innerHTML = "";
    });

    // Set dates for the current week
    weekdays.forEach((weekday, index) => {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(currentDate.getDate() + index);
      document.getElementById(weekday + "-date").innerHTML = currentDate.getDate();
    });

    // Check if the date belongs to the current week
    function isInCurrentWeek(date) {
      const weekNumber = getWeekNumber(date);
      return weekNumber === getWeekNumber(startOfWeek);
    }

    // Display shifts for the current week
    shifts.forEach(shift => {
      const workStartDate = new Date(shift.workStart);
      const workEndDate = new Date(shift.workEnd);

      // If the shift does not belong to the current week, skip it
      if (!isInCurrentWeek(workStartDate)) {
        return;
      }

      const startHourAndMinute = workStartDate.getHours() + ":" + String(workStartDate.getMinutes()).padStart(2, '0');
      const endHourAndMinute = workEndDate.getHours() + ":" + String(workEndDate.getMinutes()).padStart(2, '0');
      

      const startHour = workStartDate.getHours();
      const endHour = workEndDate.getHours();

      const startWeekday = weekdays[workStartDate.getDay() - 1];
      const endWeekday = weekdays[workEndDate.getDay() - 1];

      if (startWeekday === endWeekday) {
        addShiftToCalendar(startWeekday, workStartDate.getDate(), startHour, endHour, shift.location, startHourAndMinute, endHourAndMinute);
      } else {
        // Add the first part of the shift to the start day
        addShiftToCalendar(startWeekday, workStartDate.getDate(), startHour, "24", shift.location, startHourAndMinute, endHourAndMinute);

        // Add the second part of the shift to the end day
        addShiftToCalendar(endWeekday, workEndDate.getDate(), "0", endHour, shift.location, startHourAndMinute, endHourAndMinute);
      }
    });
  }

  const options = makeOptions("GET", "", true)
  const userFetch = localStorage.getItem("user")
  const url = API_URL + "/users/" + userFetch;


     fetch(url,options)
     .then(response => response.json())
     .then(data => {
       const username = data.username;
       const firstName = data.firstName;
       const lastName = data.lastName;
       const email = data.email;
       const mobilePhone = data.phones.mobile;
       const shifts = data.shifts;

       shifts.forEach(shift => {
        const shiftId = shift.id;
        const workStart = shift.workStart;
        const workEnd = shift.workEnd;
        const location = shift.location;
        const isSick = shift.isSick;

        
// Initialize the calendar with the fetched shifts data
const startOfWeek = getStartOfWeek(new Date());
updateWeekNumber(startOfWeek);
updateWeekdayDates(shifts, startOfWeek);
updateCurrentMonth(startOfWeek);

// Update the calendar when the previous or next week buttons are clicked
document.getElementById("previous-week").addEventListener("click", () => {
  startOfWeek.setDate(startOfWeek.getDate() - 7);
  updateWeekNumber(startOfWeek);
  updateWeekdayDates(shifts, startOfWeek);
  updateCurrentMonth(startOfWeek);
});

document.getElementById("next-week").addEventListener("click", () => {
  startOfWeek.setDate(startOfWeek.getDate() + 7);
  updateWeekNumber(startOfWeek);
  updateWeekdayDates(shifts, startOfWeek);
  updateCurrentMonth(startOfWeek);
});

     })

       document.getElementById("name-id").innerHTML = firstName + " " + lastName;
       document.getElementById("name-id").style.fontSize = "1.5rem";
       document.getElementById("userid-id").innerHTML = "id " + username;
       document.getElementById("email-id").innerHTML = email;
       document.getElementById("tlf-id").innerHTML = mobilePhone;

       
     })
     .catch(error => console.error(error));   


    function addShiftToCalendar(dayIdPrefix, startDay, startTime, endTime, location, startHourAndMinute, endHourAndMinute) {
      document.getElementById(dayIdPrefix + "-event").className = "event start-" + startTime + " end-" + endTime + " securities";
      document.getElementById(dayIdPrefix + "-title").innerHTML = location;
      document.getElementById(dayIdPrefix + "-time").innerHTML = startHourAndMinute + " - " + endHourAndMinute;
      }

    }
