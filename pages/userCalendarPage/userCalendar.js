export function loadUserDom() {
const shifts = [
    {id:1, date:"2023-03-27T04:00:00", workhours:"03:00:00", location:"Bakken", username:"Kristian"},
    {id:2, date:"2023-03-28T07:00:00", workhours:"03:00:00", location:"Pappas Pizza", username:"Ferhat"},
    {id:3, date:"2023-03-29T05:00:00", workhours:"05:00:00", location:"KEA", username:"Per"},
    {id:4, date:"2023-03-31T03:00:00", workhours:"07:00:00", location:"Eksamen", username:"Team Beaver"}
]

shifts.forEach((shift) => {
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
    var [hours, minutes, seconds] = shift.workhours.split(':').map(Number);
    const workHoursDate = new Date();
    workHoursDate.setHours(hours);
    workHoursDate.setMinutes(minutes);
    workHoursDate.setSeconds(seconds);

    if(startminute == 0){ // To make sure that minutes comes out as 00:00 and not 00:0
        startminute = "00"
    }

    if(minutes == 0){ // To make sure that minutes comes out as 00:00 and not 00:0
        minutes ="00"
    }

    // DOM manipulation using switch case
    switch (weekdayName) {
        case "Monday":
            document.getElementById("monday-date").innerHTML = startday;
            document.getElementById("monday-event").className = "event start-"+starthour+" end-"+(starthour+hours)+" securities";
            document.getElementById("monday-title").innerHTML = shift.location;
            document.getElementById("monday-time").innerHTML = ""+starthour+":"+startminute+" - "+(starthour+hours)+ ":"+minutes;
            break;
        case "Tuesday":
            document.getElementById("tuesday-date").innerHTML = startday;
            document.getElementById("tuesday-event").className = "event start-"+starthour+" end-"+(starthour+hours)+" securities";
            document.getElementById("tuesday-title").innerHTML = shift.location;
            document.getElementById("tuesday-time").innerHTML = ""+starthour+":"+startminute+" - "+(starthour+hours)+ ":"+minutes;
            break;
    case "Wednesday":
      document.getElementById("wednesday-date").innerHTML = startday;
      document.getElementById("wednesday-event").className = "event start-"+starthour+" end-"+(starthour+hours)+" securities";
      document.getElementById("wednesday-title").innerHTML = shift.location;
      document.getElementById("wednesday-time").innerHTML = ""+starthour+":"+startminute+" - "+(starthour+hours)+ ":"+minutes;
      break;
    case "Thursday":
      document.getElementById("thursday-date").innerHTML = startday;
      document.getElementById("thursday-event").className = "event start-"+starthour+" end-"+(starthour+hours)+" securities";
      document.getElementById("thursday-title").innerHTML = shift.location;
      document.getElementById("thursday-time").innerHTML = ""+starthour+":"+startminute+" - "+(starthour+hours)+ ":"+minutes;
      break;
    case "Friday":
      document.getElementById("friday-date").innerHTML = startday;
      document.getElementById("friday-event").className = "event start-"+starthour+" end-"+(starthour+hours)+" securities";
      document.getElementById("friday-title").innerHTML = shift.location;
      document.getElementById("friday-time").innerHTML = ""+starthour+":"+startminute+" - "+(starthour+hours)+ ":"+minutes;
      break;
      case "Saturday":
      document.getElementById("saturday-date").innerHTML = startday;
      document.getElementById("saturday-event").className = "event start-"+starthour+" end-"+(starthour+hours)+" securities";
      document.getElementById("saturday-title").innerHTML = shift.location;
      document.getElementById("saturday-time").innerHTML = ""+starthour+":"+startminute+" - "+(starthour+hours)+ ":"+minutes;
      break;
      case "Sunday":
      document.getElementById("sunday-date").innerHTML = startday;
      document.getElementById("sunday-event").className = "event start-"+starthour+" end-"+(starthour+hours)+" securities";
      document.getElementById("sunday-title").innerHTML = shift.location;
      document.getElementById("sunday-time").innerHTML = ""+starthour+":"+startminute+" - "+(starthour+hours)+ ":"+minutes;
      break;
      default:
      console.log("Invalid weekday");
      }
      startminute = 0;
      minutes = 0;
    })
  }