export function loadDom() {

/*   var appointments = document.querySelectorAll(".appointment");
  for (var i = 0; i < appointments.length; i++) {
    appointments[i].addEventListener("click", function () {
      var day = this.getAttribute("data-day");
      var time = this.getAttribute("data-time");
      var name = prompt("Enter appointment name:");
      if (name) {
        alert("Appointment created: " + day + ", " + time + ":00 - " + name);
        this.innerHTML = name;
      }
    });
  } */

  const style = document.createElement("style");

  const peoples = [
    { name: "Kristian Wede", age: 22, email: "kristanwede@gmail.com" },
    { name: "Ferhat Barna", age: 20, email: "frrt.baran@gmail.com" },
    { name: "Ferhat Barna", age: 20, email: "frrt.baran@gmail.com" },
    { name: "Ferhat Barna", age: 20, email: "frrt.baran@gmail.com" },
  ];

  const table = document.querySelector('#myTable');
  const tbody = table.createTBody();

  for (let index = 0; index < peoples.length; index++) {
    //create a new row
    const row = tbody.insertRow(index);

    

    //add the persons name age and email to the row
    const nameCell = row.insertCell(0);
    nameCell.innerHTML =
      peoples[index].name +
      "<br> age: " +
      peoples[index].age +
      "<br> Email: " +
      peoples[index].email;

    const mondayCell = row.insertCell(1);
    //  mondayCell.style.backgroundColor = "rgb(204, 234, 255)"
    const tuesdayCell = row.insertCell(2);
    // tuesdayCell.style.backgroundColor = "rgb(204, 234, 255)"
    const wednesdayCell = row.insertCell(3);
    // wednesdayCell.style.backgroundColor = "rgb(204, 234, 255)"
    const thursdayCell = row.insertCell(4);
    // thursdayCell.style.backgroundColor = "rgb(204, 234, 255)"
    const fridayCell = row.insertCell(5);
    // fridayCell.style.backgroundColor = "rgb(204, 234, 255)"
    const saturdayCell = row.insertCell(6);
    // saturdayCell.style.backgroundColor = "rgb(204, 234, 255)"
    const sundayCell = row.insertCell(7);
    // sundayCell.style.backgroundColor = "rgb(204, 234, 255)"

    // Select all <td> elements in the document, except the first column
    var tds = document.querySelectorAll("td:not(:first-child)");

    // Loop through each <td> element and add a style
    for (var i = 0; i < tds.length; i++) {
      tds[i].style.backgroundColor = "rgb(204, 234, 255)";
    }
  }
}
