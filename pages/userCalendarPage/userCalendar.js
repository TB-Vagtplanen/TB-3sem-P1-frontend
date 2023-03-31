const URL = "https://tbsem3proj1.azurewebsites.net/api/shifts/3"; //HARDCODED

export function loadUserDOM() {

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

  

  // Fetch shifts data from the API
  const url = "https://tbsem3proj1.azurewebsites.net/api/shifts"; //HARDCODED

console.log(url)
  fetch(url)
    .then(response => response.json())
    .then(data => {
      console.log(data)
      const shifts = data.map(shift => {
        const { id, workStart, workEnd, location, user, isSick } = shift;
        return {
          id,
          workStart,
          workEnd,
          location,
          user,
          isSick
        
        };

      });

      // Initialize the calendar with the fetched shifts data
      const startOfWeek = getStartOfWeek(new Date());
      updateWeekNumber(startOfWeek);
      updateWeekdayDates(shifts, startOfWeek);

      // Update the calendar when the previous or next week buttons are clicked
      document.getElementById("previous-week").addEventListener("click", () => {
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        updateWeekNumber(startOfWeek);
        updateWeekdayDates(shifts, startOfWeek);
      });

      document.getElementById("next-week").addEventListener("click", () => {
        startOfWeek.setDate(startOfWeek.getDate() + 7);
        updateWeekNumber(startOfWeek);
        updateWeekdayDates(shifts, startOfWeek);
      });
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });

    fetch(URL)
    .then(response => response.json())
    .then(data => {
      const user = data.user;
      const {username, email, firstName, lastName, street, zip, city, phones} = user;
      const mobile = phones.mobile;
      
      document.getElementById("name-id").innerHTML = firstName + " " + lastName;
      document.getElementById("name-id").style.fontSize = "1.5rem";
      document.getElementById("userid-id").innerHTML = "id " + username;
      document.getElementById("email-id").innerHTML = email;
      document.getElementById("tlf-id").innerHTML = mobile;
    })
    .catch(error => console.error(error));
    const people = { id: 1, name: "Kristian Wede", age: 22, email: "kristanwede@gmail.com", tlf: "22 22 22 22" };
  
  

    function addShiftToCalendar(dayIdPrefix, startDay, startTime, endTime, location, startHourAndMinute, endHourAndMinute) {
      document.getElementById(dayIdPrefix + "-event").className = "event start-" + startTime + " end-" + endTime + " securities";
      document.getElementById(dayIdPrefix + "-title").innerHTML = location;
      document.getElementById(dayIdPrefix + "-time").innerHTML = startHourAndMinute + " - " + endHourAndMinute;
      }
    }
