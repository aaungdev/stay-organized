"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const userDropDown = document.getElementById("userDropDownElement");
  const usersDetail = document.querySelector(".todosContainer");
  const apiUrlUsers = "http://localhost:8083/api/users";
  const apiUrlTodosByUser = "http://localhost:8083/api/todos/byuser/";
  const apiUrlTodos = "http://localhost:8083/api/todos";
  const addTaskButton = document.getElementById("addTaskButton");

  userDropDown.addEventListener("change", handleUserChange);
  addTaskButton.addEventListener("click", handleAddTask);

  function handleUserChange() {
    const userId = this.value;
    if (userId) {
      populateUserDetails(userId);
    } else {
      usersDetail.innerHTML = "";
    }
  }

  function handleAddTask() {
    const userId = userDropDown.value;
    if (!userId) {
      alert("Please select a user to add a task.");
      return;
    }

    const newTask = {
      title: "New Task",
      category: "General",
      description: "New task description",
      deadline: "2023-12-31",
      priority: "Medium",
      userId: parseInt(userId),
      completed: false,
    };

    fetch(apiUrlTodos, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTask),
    })
      .then((response) => response.json())
      .then((task) => {
        const detailsDiv = createTaskCard(task, userId);
        usersDetail.appendChild(detailsDiv);
      })
      .catch((error) => {
        console.error("Error adding task:", error);
      });
  }

  function getUserDropDown() {
    fetch(apiUrlUsers)
      .then((response) => response.json())
      .then((data) => {
        const defaultOption = document.createElement("option");
        defaultOption.innerText = "Select a user";
        defaultOption.value = "";
        userDropDown.appendChild(defaultOption);

        data.forEach((user) => {
          const option = document.createElement("option");
          option.innerText = user.name;
          option.value = user.id;
          userDropDown.appendChild(option);
        });
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }

  function populateUserDetails(userId) {
    usersDetail.innerHTML = "";
    fetch(apiUrlTodosByUser + userId)
      .then((response) => response.json())
      .then((userData) => {
        userData.forEach((task) => {
          const detailsDiv = createTaskCard(task, userId);
          usersDetail.appendChild(detailsDiv);
        });
      })
      .catch((error) => {
        console.error("Error fetching ToDos:", error);
      });
  }

  function createTaskCard(task, userId) {
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "todoCard";

    const taskCompleted = document.createElement("img");
    taskCompleted.src = task.completed
      ? "images/right_sign_icon.png"
      : "images/wrong_sign_icon.png";
    taskCompleted.alt = task.completed ? "Completed" : "Not completed";
    taskCompleted.style.width = "20px";
    taskCompleted.style.height = "20px";

    const taskTitle = document.createElement("input");
    taskTitle.type = "text";
    taskTitle.value = task.title || "No title";
    taskTitle.disabled = true;

    const taskCategory = document.createElement("input");
    taskCategory.type = "text";
    taskCategory.value = task.category || "No category";
    taskCategory.disabled = true;

    const taskDescription = document.createElement("input");
    taskDescription.type = "text";
    taskDescription.value = task.description || "No description";
    taskDescription.disabled = true;

    const taskDeadline = document.createElement("input");
    taskDeadline.type = "text";
    taskDeadline.value = task.deadline || "No deadline";
    taskDeadline.disabled = true;

    const taskPriority = document.createElement("input");
    taskPriority.type = "text";
    taskPriority.value = task.priority || "No priority";
    taskPriority.disabled = true;

    const editButton = document.createElement("button");
    editButton.innerHTML = "&#x270E;"; // Pencil icon for edit
    editButton.addEventListener("click", function () {
      taskTitle.disabled = false;
      taskCategory.disabled = false;
      taskDescription.disabled = false;
      taskDeadline.disabled = false;
      taskPriority.disabled = false;
      saveButton.style.display = "inline";
      editButton.style.display = "none";
    });

    const saveButton = document.createElement("button");
    saveButton.innerHTML = "&#x2714;"; // Check mark for save
    saveButton.style.display = "none";
    saveButton.addEventListener("click", function () {
      const updatedTask = {
        title: taskTitle.value,
        category: taskCategory.value,
        description: taskDescription.value,
        deadline: taskDeadline.value,
        priority: taskPriority.value,
      };
      updateTask(task.id, updatedTask, userId);
      taskTitle.disabled = true;
      taskCategory.disabled = true;
      taskDescription.disabled = true;
      taskDeadline.disabled = true;
      taskPriority.disabled = true;
      saveButton.style.display = "none";
      editButton.style.display = "inline";
    });

    const deleteButton = document.createElement("button");
    deleteButton.innerHTML = "&#x2716;"; // Cross icon for delete
    deleteButton.addEventListener("click", function () {
      deleteTask(task.id, userId);
    });

    detailsDiv.appendChild(taskCompleted);
    detailsDiv.appendChild(taskTitle);
    detailsDiv.appendChild(taskCategory);
    detailsDiv.appendChild(taskDescription);
    detailsDiv.appendChild(taskDeadline);
    detailsDiv.appendChild(taskPriority);
    detailsDiv.appendChild(editButton);
    detailsDiv.appendChild(saveButton);
    detailsDiv.appendChild(deleteButton);

    return detailsDiv;
  }

  function updateTask(taskId, updatedTask, userId) {
    fetch(apiUrlTodos + "/" + taskId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then((response) => response.json())
      .then(() => {
        populateUserDetails(userId); // Refresh the list
      })
      .catch((error) => {
        console.error("Error updating task:", error);
      });
  }

  function deleteTask(taskId, userId) {
    fetch(apiUrlTodos + "/" + taskId, {
      method: "DELETE",
    })
      .then(() => {
        populateUserDetails(userId); // Refresh the list
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  }

  // Initial population of user dropdown
  getUserDropDown();
});
