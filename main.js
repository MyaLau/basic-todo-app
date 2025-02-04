
let todoList = [];

// Declare the array first
// This stores all tasks as an array.Each task is an object with two properties: { text: "My Task", completed: false }



// Load tasks from localStorage when the page loads
document.addEventListener("DOMContentLoaded", function () {
    let savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
        todoList = JSON.parse(savedTasks); // Convert back to array

        // Loop through saved tasks and display them
        todoList.forEach(task => {
            addTaskToDOM(task.text, task.completed);
        });
    }
});

const addTask = document.getElementById("addTask");

// Add event listener for the "Add Task" button
addTask.addEventListener("click", addTodoItem);

function addTodoItem() {
    let item = document.getElementById("todoInput").value.trim();

    if (item === "") {
        alert("Task cannot be empty!");
        return;
    }

    todoList.push({ text: item, completed: false });
    localStorage.setItem("tasks", JSON.stringify(todoList));

    addTaskToDOM(item, false); // Display the new task in the UI

    document.getElementById("todoInput").value = ""; // Clear input field
}

function addTaskToDOM(itemText, isCompleted) {
    let list = document.getElementById("todoList");
    let listItem = document.createElement("div");
    listItem.className = "todoItem";

    // Create a checkbox
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = isCompleted; // ✅ Keep checkbox checked if saved as completed

    // Apply strikethrough if task was completed
    let itemTextElement = document.createElement("span");
    itemTextElement.textContent = itemText;
    if (isCompleted) {
        itemTextElement.style.textDecoration = "line-through";
        listItem.classList.add("checked");
    }

    checkbox.onclick = function () {
        let index = todoList.findIndex(task => task.text === itemText); // Find task in array
        if (index !== -1) {
            todoList[index].completed = checkbox.checked; // Update completion status
            localStorage.setItem("tasks", JSON.stringify(todoList)); // Save updated status
        }

        if (checkbox.checked) {
            itemTextElement.style.textDecoration = "line-through"; // Strike-through
            listItem.classList.add("checked");
        } else {
            itemTextElement.style.textDecoration = "none"; // Remove strike-through
            listItem.classList.remove("checked");
        }
    };

    listItem.appendChild(checkbox);
    listItem.appendChild(itemTextElement);

    // Buttons container
    let buttonsDiv = document.createElement("div");
    buttonsDiv.className = "buttons";

    // Edit button
    let editButton = document.createElement("button");
    editButton.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    editButton.onclick = function () {
        itemTextElement.contentEditable = true;
        itemTextElement.focus();

        // Move cursor to the end
        let range = document.createRange();
        let selection = window.getSelection();
        range.selectNodeContents(itemTextElement);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    // Save updated text on blur
    itemTextElement.onblur = function () {
        itemTextElement.contentEditable = false;
        let index = todoList.findIndex(task => task.text === itemText);
        if (index !== -1) {
            todoList[index].text = itemTextElement.textContent; // Update text
            localStorage.setItem("tasks", JSON.stringify(todoList)); // Save updated tasks
        }
    };
    buttonsDiv.appendChild(editButton);

    // Delete button
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteButton.onclick = function () {
        list.removeChild(listItem);
        let index = todoList.findIndex(task => task.text === itemText);
        if (index !== -1) {
            todoList.splice(index, 1); // Remove task from array
            localStorage.setItem("tasks", JSON.stringify(todoList)); // Update localStorage
        }
    };
    buttonsDiv.appendChild(deleteButton);

    // Add buttons to task
    listItem.appendChild(buttonsDiv);
    list.appendChild(listItem);
}