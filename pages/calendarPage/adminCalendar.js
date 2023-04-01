import { API_URL } from "../../settings.js";
import { handleHttpErrors, makeOptions, sanitizeStringWithTableRows } from "../../utils.js";

export function initiateAdminCalendar(weekNumber) {


        // Your fetched data would go here:
        let fetchedData = []
    
        let selectedCell = null;
    
        let currentWeekOffset = 0;
    
        const shiftTable = document.getElementById("shiftTable");
        const updateForm = document.getElementById("updateForm");
        const updateShiftTitle = document.getElementById("updateShiftTitle");
        const updateShiftStart = document.getElementById("updateShiftStart");
        const deleteButton = document.getElementById("deleteShift");
    
        const updateWorkerName = document.getElementById("updateWorkerName");
        const updateShiftName = document.getElementById("updateShiftName");
        const updateShiftEnd = document.getElementById("updateShiftEnd");
        const updateShiftIsSick = document.getElementById("updateShiftIsSick");
    
        const daysOfWeek = [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday",
        ];

        fillOutFetchedShifts();

    async function fillOutFetchedShifts() {

        const options = makeOptions("GET","",true)

        try {
            const fetchAllShifts = await fetch(API_URL + "/users/active", options)//Fetching all active users, that also includes the lists of shifts that they have.
            .then((response) => 
                handleHttpErrors(response)
        )
            
            fetchAllShifts.forEach(user => {
            const username = user.username;
            const shifts = user.shifts;

            fetchedData.push({ username, shifts });
            });

            generateCalendar(); //Call generateCalendar() here to ensure it's executed after the data is fetched
            
            } catch (error) {
                console.error('Error fetching data:', error);
                document.getElementById("errorMessage").innerHTML = error;
            }
    }

    


    function deselectCell() {
        // Remove the 'selected' and 'updating' classes from all cells
        const updatingCells = document.querySelectorAll(".updating");
        updatingCells.forEach((cell) => {
            cell.classList.remove("selected");
            cell.classList.remove("updating");
        });

        selectedCell = null;

        // Hide the form and title
        updateForm.style.display = "none";
        updateShiftTitle.style.display = "none";
    }

    document.addEventListener("click", (event) => {
        if (
            !event.target.closest("table") &&
            !event.target.closest("#updateForm") &&
            !event.target.closest("button")
        ) {
            deselectCell();
        }
    });

    //For formatting the dates for fetch correctly.
    function formatDateInput(date, timeString) {
        if (timeString) {
            const timeParts = timeString.split(':');
            const hour = parseInt(timeParts[0], 10);
            const minute = parseInt(timeParts[1], 10);
    
            date.setHours(hour);
            date.setMinutes(minute);
        }
    
        const yyyy = date.getFullYear();
        const MM = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
        const dd = String(date.getDate()).padStart(2, '0');
        const HH = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');
    
        return `${yyyy}-${MM}-${dd} ${HH}:${mm}:${ss}`;
    }

    function getDayName(date) {
        const dayIndex = (date.getDay() + 6) % 7;
        return daysOfWeek[dayIndex];
    }

    function getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear + 86400000) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    }

    function formatDate(date) {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        return `${month}/${day}`;
    }

    function formatShift(shift) {

        const shiftStart = new Date(shift.workStart);
        const shiftEnd = new Date(shift.workEnd);


        const startHour = shiftStart.getHours().toString().padStart(2, "0");
        const startMinute = shiftStart.getMinutes().toString().padStart(2, "0");
        const endHour = shiftEnd.getHours().toString().padStart(2, "0");
        const endMinute = shiftEnd.getMinutes().toString().padStart(2, "0");
        const startDate = formatDate(shiftStart);
        const endDate = formatDate(shiftEnd);

        return `<span class="shift${shift.isSick ? " sick-day" : ""}">${shift.location
            } (${startDate} ${startHour}:${startMinute} - ${endDate} ${endHour}:${endMinute})${shift.isSick ? " <strong>Is sick</strong>" : ""
            }</span>`;
    }

    //Gets the current week that is being viewed.
    function getDateForWeek(weekNumber) {
        // Get the current date and time
        var currentDate = new Date();
      
        // Get the current day of the week (0-6)
        var currentDay = currentDate.getDay();
      
        // Calculate the number of days to subtract from the current date to get to the start of the week
        var daysToSubtract = currentDay + 7 * (weekNumber - 1);
      
        // Subtract the number of days from the current date to get the first day of the week
        var firstDayOfWeek = new Date(currentDate.getTime() - (daysToSubtract * 24 * 60 * 60 * 1000));
      
        // Set the time to 00:00:00
        firstDayOfWeek.setHours(0, 0, 0, 0);
      
        return firstDayOfWeek;
      }

    //Gets the corresponding weeks for the calendar.
    function updateWeekDates(weekNumber) {

        let today; //Added for tmp.

        if(weekNumber){
            today = getDateForWeek(weekNumber);
        } else {
            today = new Date();
        }

        const firstDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - today.getDay() + 1 + currentWeekOffset * 7
        );
        
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);

        const numberOfWeek = getWeekNumber(firstDay);
        document.getElementById(
            "weekDates"
        ).textContent = `Uge ${numberOfWeek}: ${formatDate(firstDay)} - ${formatDate(
            lastDay
        )}`;
        return { firstDay, lastDay };
    }

    function isPastDay(date, today) {
        return date < today;
    }

    function showUpdateForm(worker, shift, isNewShift, cell, day) {

        // Display the form and title
        updateForm.style.display = "block";
        updateShiftTitle.style.display = "block";

        // Set form title based on whether it's a new shift or an existing one
        updateShiftTitle.textContent = isNewShift ? "New Shift" : "Update Shift";

        // Set the input values based on the shift data if it exists, otherwise clear the input fields
        
        if (shift) {
            updateShiftName.value = shift.location;
            updateShiftStart.value = shift.workStart.substr(11, 5);
            updateShiftEnd.value = shift.workEnd.substr(11, 5);
            updateShiftIsSick.checked = shift.isSick;
        } else {
            updateShiftName.value = "";
            updateShiftStart.value = "";
            updateShiftEnd.value = "";
            updateShiftIsSick.checked = false;
        }

        // Set the worker name
        updateWorkerName.value = worker.username;

        // Add the updating class to the cell
        cell.classList.add("updating");

        // Hide or show the delete button
        if (isNewShift) {
            deleteButton.style.display = "none";
        } else {
            deleteButton.style.display = "block";
        }

        // Remove the updating class from the cell when clicking outside the form
        const removeUpdatingClass = (event) => {
            event.stopPropagation();
            cell.classList.remove("updating");
        };
        
        document
            .getElementById("updateForm")
            .addEventListener("click", removeUpdatingClass);


        //Button for deleting the shift.
        deleteButton.onclick = async () => {

            // Remove the shift from worker's data (locally)
            const shiftIndex = worker.shifts.indexOf(shift);

            if (shiftIndex > -1) {
                worker.shifts.splice(shiftIndex, 1);
            }


            try{

            const options = makeOptions("DELETE","",false)

            const deleteResult = await fetch(API_URL + "/shifts/" + shift.id, options).then((response) => 
                    handleHttpErrors(response)
                )
                

            }catch(error){
                console.log(error)
            }

            // Update the table
            generateCalendar();

            // Hide the form and title
            updateForm.style.display = "none";
            updateShiftTitle.style.display = "none";
        };

        // Populate the form with the current shift data when trying to update a shift.
        updateForm.onsubmit = async (e) => {
            e.preventDefault();

            //Extracts the information form the from.
            const shiftStart = updateShiftStart.value;
            const shiftEnd = updateShiftEnd.value;

            //Inserts the times (for example 08:00) into the date objects.
            const workStart = new Date(day.getFullYear(), day.getMonth(), day.getDate(), parseInt(shiftStart.substr(0, 2)), parseInt(shiftStart.substr(3, 2)));
            const workEnd = new Date(day.getFullYear(), day.getMonth(), day.getDate(), parseInt(shiftEnd.substr(0, 2)), parseInt(shiftEnd.substr(3, 2)));


            // If it's a new shift, create a new shift object and add it to the worker's shifts.


            const body = {
                workStart: formatDateInput(workStart,shiftStart),
                workEnd: formatDateInput(workEnd,shiftEnd),
                location: DOMPurify.sanitize(updateShiftName.value), //Purifies the input, so that it's safe from CrossScript.
                isSick: document.getElementById("updateShiftIsSick").checked,
                username: worker.username, // Assuming you need to send the worker's username
            };


            if (isNewShift) {

                const addedShift = await addShiftFetch(body);
            
                    // Add the new shift to the worker's shifts
                    /* const newShift = addedShift{
                        id: addedShift.id,
                        workStart: body.workStart,
                        workEnd: body.workEnd,
                        location: body.location,
                        isSick: body.isSick,
                      }; */
                      // Add the new shift to the worker's shifts
                      worker.shifts.push(addedShift);

            } else {
 
                const options = makeOptions("PUT",body,false)

                    // Update the existing shift data
                    shift.location = updateShiftName.value;
                    shift.workStart = body.workStart;
                    shift.workEnd = body.workEnd;
                    shift.isSick = document.getElementById("updateShiftIsSick").checked;

                //Update a shift.
                try{
                const response = await fetch(API_URL + "/shifts/" + shift.id, options)

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
    
                const updatedShift = await response.json();

    
            } catch (error) {
                console.error("Error updating shift:", error);

                
            }
        }
            
            // Update the table
            generateCalendar();

            // Hide the form and title
            updateForm.style.display = "none";
            updateShiftTitle.style.display = "none";

            // Remove the event listener
            updateForm.removeEventListener("click", removeUpdatingClass);



        };
    }

    function generateCalendar() {

        shiftTable.innerHTML = "";

        const headerRow = document.createElement("tr");

        // Add an empty cell for the top-left corner
        headerRow.appendChild(document.createElement("th"));

       
        // Add days of the week as headers
        daysOfWeek.forEach((day) => {
            const headerCell = document.createElement("th");
            headerCell.textContent = day;
            headerRow.appendChild(headerCell);
        });

        shiftTable.appendChild(headerRow);

        const { firstDay, lastDay } = updateWeekDates();
        const today = new Date();
        today.setHours(0, 0, 0, 0);


        fetchedData.forEach((workerData) => {
            const row = document.createElement("tr");

            // Worker name
            const workerCell = document.createElement("td");
            workerCell.textContent = workerData.username;
            row.appendChild(workerCell);

            // Shifts for each day of the week
            for (let i = 0; i < 7; i++) {
                const day = new Date(firstDay);
                day.setDate(firstDay.getDate() + i);

                const cell = document.createElement("td");

                if (isPastDay(day, today)) {
                    cell.classList.add("past-day");
                }

                const shifts = workerData.shifts.filter((s) => {
                    const shiftDate = new Date(s.workStart).setHours(0, 0, 0, 0);
                    const isEqual = shiftDate === day.valueOf();
                    return isEqual;
                });


                //For the worker's workday that matches that day, it takes the first occurrence of a shift and puts it into the cell.
                const shift = shifts[0];
                if (shifts.length > 0) {
                    cell.innerHTML = formatShift(shift);
                

                    if (shift.isSick) {
                        cell.classList.add("sick-day");
                    }

                    cell.onclick = () => {
                        deselectCell();
                        selectedCell = cell;
                        cell.classList.add("selected");

                        showUpdateForm(workerData, shift, false, cell, day);
                    };

                    } else {

                    cell.classList.add("empty-cell");
                    cell.onclick = () => {
                        deselectCell();
                        selectedCell = cell;
                        cell.classList.add("selected");

                        // Show the form without creating a new shift
                        showUpdateForm(workerData, null, true, cell, day);
                    };
                }
                row.appendChild(cell);
            }
            shiftTable.appendChild(row);
        });

        deselectCell();
    }

    document.getElementById("previousWeek").onclick = () => {
        deselectCell();
        currentWeekOffset--;
        shiftTable.innerHTML = "";
        generateCalendar();
    };

    document.getElementById("nextWeek").onclick = () => {
        deselectCell();
        currentWeekOffset++;
        shiftTable.innerHTML = "";
        generateCalendar();
    };


    updateWeekDates(weekNumber);
    generateCalendar();
}


async function addShiftFetch(shift){

    try{

    const options = makeOptions("POST",shift,false)

    const addedShift = await fetch(API_URL + "/shifts/makeShift", options)
      .then((response) => {
        return handleHttpErrors(response);
      })

      return addedShift;

        } catch(error) {
            getElementById("errorMessage").innerHTML = error;
        }

}
