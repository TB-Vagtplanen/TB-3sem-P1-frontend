


export function loadUserDom() {

  function getStartOfWeek(date) {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = day - 1; // to set Monday as the first day of the week
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
      const startHourAndMinute = workStartDate.getHours() + ":" + workStartDate.getMinutes();
      const endHourAndMinute = workEndDate.getHours() + ":" + workEndDate.getMinutes();
  
      const startHour = workStartDate.getHours();
      const endHour = workEndDate.getHours();
  
      const startWeekday = weekdays[workStartDate.getDay()-1];
      const endWeekday = weekdays[workEndDate.getDay()-1];
  
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
    
  
  const people = { id: 1, name: "Kristian Wede", age: 22, email: "kristanwede@gmail.com", tlf: "22 22 22 22" }

  document.getElementById("name-id").innerHTML = people.name;
  document.getElementById("name-id").style.fontSize = "1.5rem";
  document.getElementById("userid-id").innerHTML = "id " + people.id;
  document.getElementById("email-id").innerHTML = people.email;
  document.getElementById("tlf-id").innerHTML = people.tlf;
  
  const shifts = [
    { id: 1, workStart: "2023-03-27T04:00:00", workEnd: "2023-03-27T07:00:00", location: "Bakken" },
    { id: 2, workStart: "2023-03-28T02:30:00", workEnd: "2023-03-28T09:45:00", location: "Bakken" },
    { id: 3, workStart: "2023-03-29T22:00:00", workEnd: "2023-03-30T04:00:00", location: "aftenVagt" },
    { id: 3, workStart: "2023-04-02T23:00:00", workEnd: "2023-04-03T06:00:00", location: "aftenVagt2" }
  ];
  
  function addShiftToCalendar(dayIdPrefix, startDay, startTime, endTime, location, startHourAndMinute, endHourAndMinute) {
    document.getElementById(dayIdPrefix + "-event").className = "event start-" + startTime + " end-" + endTime + " securities";
    document.getElementById(dayIdPrefix + "-title").innerHTML = location;
    document.getElementById(dayIdPrefix + "-time").innerHTML = startHourAndMinute + " - " + endHourAndMinute;
  }
  
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
  
  const startOfWeek = getStartOfWeek(new Date());
  updateWeekNumber(startOfWeek);
  updateWeekdayDates(shifts, startOfWeek);


  }