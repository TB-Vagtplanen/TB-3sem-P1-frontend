export function initiateAdminCalendar() {
    // Your fetched data would go here:
    const fetchedData = [
        {
            worker: "Alice",
            shifts: [
                {
                    day: new Date("2023-03-20T00:00:00").toISOString(),
                    name: "Shift A",
                    start: new Date("2023-03-20T08:00:00"),
                    end: new Date("2023-03-20T16:00:00"),
                    isSick: false,
                },
                {
                    day: new Date("2023-03-22T00:00:00").toISOString(),
                    name: "Shift B",
                    start: new Date("2023-03-22T16:00:00"),
                    end: new Date("2023-03-23T00:00:00"),
                    isSick: false,
                },
                {
                    day: new Date("2023-03-24T00:00:00").toISOString(),
                    name: "Shift A",
                    start: new Date("2023-03-24T08:00:00"),
                    end: new Date("2023-03-24T16:00:00"),
                    isSick: false,
                },
                // ... extra shifts for Alice
            ],
        },
        {
            worker: "Bob",
            shifts: [
                {
                    day: new Date("2023-03-21T00:00:00").toISOString(),
                    name: "Shift C",
                    start: new Date("2023-03-21T08:00:00"),
                    end: new Date("2023-03-21T16:00:00"),
                    isSick: false,
                },
                {
                    day: new Date("2023-03-23T00:00:00").toISOString(),
                    name: "Shift D",
                    start: new Date("2023-03-23T16:00:00"),
                    end: new Date("2023-03-24T00:00:00"),
                    isSick: false,
                },
                {
                    day: new Date("2023-03-25T00:00:00").toISOString(),
                    name: "Shift C",
                    start: new Date("2023-03-25T08:00:00"),
                    end: new Date("2023-03-25T16:00:00"),
                    isSick: false,
                },
            ],
        },
        {
            worker: "Carol",
            shifts: [
                {
                    day: new Date("2023-03-20T00:00:00").toISOString(),
                    name: "Shift E",
                    start: new Date("2023-03-20T16:00:00"),
                    end: new Date("2023-03-21T00:00:00"),
                    isSick: false,
                },
                {
                    day: new Date("2023-03-22T00:00:00").toISOString(),
                    name: "Shift F",
                    start: new Date("2023-03-22T08:00:00"),
                    end: new Date("2023-03-22T16:00:00"),
                    isSick: false,
                },
                {
                    day: new Date("2023-03-24T00:00:00").toISOString(),
                    name: "Shift E",
                    start: new Date("2023-03-24T16:00:00"),
                    end: new Date("2023-03-25T00:00:00"),
                    isSick: false,
                },
            ],
        },
    ];

    

    // Fetch data from backend here and populate the 'workers' array.
    // fetch(`${URL}/workers`).then(response => response.json()).then(data => workers = data);

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

    const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

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
        const startHour = shift.start.getHours().toString().padStart(2, "0");
        const startMinute = shift.start.getMinutes().toString().padStart(2, "0");
        const endHour = shift.end.getHours().toString().padStart(2, "0");
        const endMinute = shift.end.getMinutes().toString().padStart(2, "0");
        const startDate = formatDate(shift.start);
        const endDate = formatDate(shift.end);

        return `<span class="shift${shift.isSick ? " sick-day" : ""}">${shift.name
            } (${startDate} ${startHour}:${startMinute} - ${endDate} ${endHour}:${endMinute})${shift.isSick ? " <strong>Is sick</strong>" : ""
            }</span>`;
    }

    function updateWeekDates() {
        const today = new Date();
        const firstDay = new Date(
            today.getFullYear(),
            today.getMonth(),
            today.getDate() - today.getDay() + 1 + currentWeekOffset * 7
        );
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);

        const weekNumber = getWeekNumber(firstDay);
        document.getElementById(
            "weekDates"
        ).textContent = `Uge ${weekNumber}: ${formatDate(firstDay)} - ${formatDate(
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
            updateShiftName.value = shift.name;
            updateShiftStart.value = shift.start.toISOString().substr(11, 5);
            updateShiftEnd.value = shift.end.toISOString().substr(11, 5);
            updateShiftIsSick.checked = shift.isSick;
        } else {
            updateShiftName.value = "";
            updateShiftStart.value = "";
            updateShiftEnd.value = "";
            updateShiftIsSick.checked = false;
        }

        // Set the worker name
        updateWorkerName.value = worker.worker;

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

        deleteButton.onclick = () => {
            // Remove the shift from worker's data
            const shiftIndex = worker.shifts.indexOf(shift);
            if (shiftIndex > -1) {
                worker.shifts.splice(shiftIndex, 1);
            }

            // Delete shift from the backend
            // fetch(`${URL}/shifts/${shift.id}`, {
            //   method: 'DELETE',
            // });

            // Update the table
            generateCalendar();

            // Hide the form and title
            updateForm.style.display = "none";
            updateShiftTitle.style.display = "none";
        };

        // Populate the form with the current shift data

        updateForm.onsubmit = (e) => {
            e.preventDefault();


            // If it's a new shift, create a new shift object and add it to the worker's shifts
            if (isNewShift) {
                shift = {
                    id: Math.random().toString(36).slice(2, 9),
                    day: day.toISOString(),
                    start: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9),
                    end: new Date(day.getFullYear(), day.getMonth(), day.getDate(), 17),
                    name: "",
                    isSick: false,
                    worker: worker.worker,
                };

                worker.shifts.push(shift);
            }


            // Update the shift data
            shift.name = updateShiftName.value;
            const shiftStart = updateShiftStart.value;
            const shiftEnd = updateShiftEnd.value;
            shift.start.setHours(parseInt(shiftStart.substr(0, 2)));
            shift.start.setMinutes(parseInt(shiftStart.substr(3, 2)));
            shift.end.setHours(parseInt(shiftEnd.substr(0, 2)));
            shift.end.setMinutes(parseInt(shiftEnd.substr(3, 2)));
            shift.isSick = document.getElementById("updateShiftIsSick").checked;

            // Update shift data in the backend
            // fetch(`${URL}/shifts/${shift.id}`, {
            //   method: 'PUT',
            //   headers: {
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify(shift)
            // });

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
            workerCell.textContent = workerData.worker;
            row.appendChild(workerCell);

            // Shifts for each day of the week
            for (let i = 0; i < 7; i++) {
                const day = new Date(firstDay);
                day.setDate(firstDay.getDate() + i);
                const cell = document.createElement("td");

                if (isPastDay(day, today)) {
                    cell.classList.add("past-day");
                }

                const shifts = workerData.shifts.filter(
                    (s) => new Date(s.day).toISOString() === day.toISOString()
                );

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

    updateWeekDates();
    generateCalendar();
}
