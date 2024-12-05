const BASE_URL = "http://localhost:9090/employees";

let allEmployees = []; // Global variable to store employee data

// Fetch and display all employees
function fetchEmployees() {
    fetch(BASE_URL)
        .then(response => response.json())
        .then(employees => {
            allEmployees = employees; // Store fetched employees in global variable
            displayEmployees(allEmployees); // Display employees in the table
            enableSearch(); // Enable the search bar once data is loaded
        })
        .catch(error => {
            console.error("Error fetching employees:", error);
            alert("Failed to fetch employee data.");
        });
}

// Function to display employee data in the table
function displayEmployees(employees) {
    const tableBody = document.getElementById("employeeTableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    employees.forEach(employee => {
        const row = `
            <tr>
                <td>${employee.id}</td>
                <td>${employee.name}</td>
                <td>${employee.email}</td>
                <td>${employee.phone}</td>
                <td>${employee.department}</td>
                <td>
                    <button onclick="showEditForm(${employee.id})">Edit</button>
                    <button class="delete" onclick="deleteEmployee(${employee.id})">Delete</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Search functionality
document.getElementById("searchBar").addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();

    // If no employees are loaded, don't search
    if (allEmployees.length === 0) {
        console.warn("Employee data is not yet loaded.");
        return;
    }

    const filteredEmployees = allEmployees.filter(employee =>
        employee.name.toLowerCase().includes(searchTerm) ||
        employee.department.toLowerCase().includes(searchTerm)
    );

    displayEmployees(filteredEmployees);
});

// Enable search bar once data is loaded
function enableSearch() {
    const searchBar = document.getElementById("searchBar");
    searchBar.disabled = false; // Enable the search bar
}


// Show edit form with existing employee details
function showEditForm(id) {
    fetch(`${BASE_URL}/${id}`)
        .then(response => response.json())
        .then(employee => {
            document.getElementById("editEmployeeId").value = employee.id;
            document.getElementById("editName").value = employee.name;
            document.getElementById("editEmail").value = employee.email;
            document.getElementById("editPhone").value = employee.phone;
            document.getElementById("editDepartment").value = employee.department;

            document.getElementById("editEmployeeForm").style.display = "block";
            document.getElementById("addEmployeeForm").style.display = "none";
        })
        .catch(error => alert("Error fetching employee details: " + error.message));
}

// Update an employee
document.getElementById("editEmployeeForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const employeeId = document.getElementById("editEmployeeId").value;
    const updatedEmployee = {
        name: document.getElementById("editName").value,
        email: document.getElementById("editEmail").value,
        phone: document.getElementById("editPhone").value,
        department: document.getElementById("editDepartment").value,
    };

    try {
        const response = await fetch(`${BASE_URL}/${employeeId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedEmployee),
        });

        const message = await response.text(); // Get plain text response from backend

        if (response.ok) {
            alert(message); // Success message from backend
            fetchEmployees(); // Refresh the employee list
            e.target.style.display = "none"; // Hide the edit form
            document.getElementById("addEmployeeForm").style.display = "block"; // Show the add employee form
            e.target.reset(); // Clear the form fields
        } else {
            alert(`Error: ${message}`); // Error message from backend
        }
    } catch (error) {
        console.error("Error occurred:", error); // Log any unexpected errors
        alert("An unexpected error occurred. Please try again.");
    }
});

// Delete an employee
function deleteEmployee(id) {
    fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    })
        .then(response => response.text()) // Get plain text from the response
        .then(message => {
            alert(message); // Show the backend message (success or error)
            fetchEmployees(); // Reload the employee list
        })
        .catch(error => {
            alert("Error deleting employee: " + error); // Show error if there's an issue with the request
        });
}

// Initialize the app and load employees on page load
window.onload = function() {
    fetchEmployees(); // Fetch employees as soon as the page loads
};


//add employee
document.getElementById("addEmployeeForm").addEventListener("submit", async function (e) {
    e.preventDefault(); // Prevent default form submission

    const employee = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        department: document.getElementById("department").value,
    };

    try {
        const response = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(employee),
        });

        const message = await response.text(); // Get plain text response from backend

        // Display the pop-up with appropriate message
        const popup = document.getElementById("popup");
        const popupMessage = document.getElementById("popupMessage");
        const popupOkButton = document.getElementById("popupOkButton");

        // Set the pop-up message based on response
        popupMessage.textContent = response.ok ? message : `${message}`;

        // Show the pop-up
        popup.style.display = "block";

        // Close the pop-up when "OK" button is clicked
        popupOkButton.onclick = function () {
            popup.style.display = "none"; // Hide the pop-up
            if (response.ok) {
                fetchEmployees(); // Refresh the employee list
                e.target.reset(); // Clear the form fields
            }
        };

        // Close the pop-up when the user clicks the "x"
        const closeButton = document.getElementsByClassName("popup-close")[0];
        closeButton.onclick = function () {
            popup.style.display = "none"; // Hide the pop-up
        };

    } catch (error) {
        console.error("Error occurred:", error); // Log any unexpected errors
        const popup = document.getElementById("popup");
        const popupMessage = document.getElementById("popupMessage");
        const popupOkButton = document.getElementById("popupOkButton");

        // Display error message in pop-up
        popupMessage.textContent = "An unexpected error occurred. Please try again.";
        popup.style.display = "block"; // Show the pop-up

        // Close the pop-up when "OK" button is clicked
        popupOkButton.onclick = function () {
            popup.style.display = "none"; // Hide the pop-up
        };
    }
});
