
const shift = {id:1, date:"2023-03-23T04:00:00", workhours:"03:30:00", location:"Bakken", username:"Kristian"}

// Create a new Date object with the date string
const date = new Date(shift.date);

const startyear = date.getFullYear();
const startmonth = date.getMonth() + 1; // Add 1 because getMonth() returns 0-based index
const startday = date.getDate();
const starthour = date.getHours();
var startminute = date.getMinutes();
const startsecond = date.getSeconds();

// Get the weeks
const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]; // Define an array with the weekday names
const weekday = date.getDay(); // Get the weekday (0-6) from the Date object
const weekdayName = weekdays[weekday]; // Get the name of the weekday from the weekdays array

// Get workhours details
const [hours, minutes, seconds] = shift.workhours.split(':').map(Number);
const workHoursDate = new Date();
workHoursDate.setHours(hours);
workHoursDate.setMinutes(minutes);
workHoursDate.setSeconds(seconds);

// DOM manipulation
document.getElementById("monday-date").innerHTML = startday
document.getElementById("monday-day").innerHTML = weekdayName
document.getElementById("monday-event").className = "event start-"+starthour+" end-"+(starthour+hours)+" securities";
document.getElementById("monday-title").innerHTML = shift.location;
if(startminute == 0){ // To make sure that minutes comes out as 00:00 and not 00:0

    startminute = "00"
}
document.getElementById("monday-time").innerHTML = ""+starthour+":"+startminute+" - "+(starthour+hours)+ ":"+minutes;
startminute = 0;

