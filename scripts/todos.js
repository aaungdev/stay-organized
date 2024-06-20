"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const userDropDown = document.getElementById("userDropDownElement");
  const usersDetail = document.querySelector(".todosContainer");
  const apiUrlUsers = "http://localhost:8083/api/users";
  const apiUrlTodosByUser = "http://localhost:8083/api/todos/byuser/";
  const apiUrlTodos = "http://localhost:8083/api/todos";
  const addTaskButton = document.getElementById("addTaskButton");

  userDropDown.addEventListener("change", function () {
    const userId = this.value;
    if (userId) {
      populateUserDetails(userId);
    }
  });

  addTaskButton.addEventListener("click", addTask);

  function getUserDropDown() {
    fetch(apiUrlUsers)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        const defaultOption = document.createElement("option");
        defaultOption.innerText = "Select a user";
        defaultOption.value = "";
        userDropDown.appendChild(defaultOption);

        data.forEach(function (user) {
          const option = document.createElement("option");
          option.innerText = user.name;
          option.value = user.id;
          userDropDown.appendChild(option);
        });
      })
      .catch(function (error) {
        console.error("Error fetching users:", error);
      });
  }

  function populateUserDetails(userId) {
    usersDetail.innerHTML = "";
    fetch(apiUrlTodosByUser + userId)
      .then(function (response) {
        return response.json();
      })
      .then(function (userData) {
        userData.forEach(function (task) {
          const detailsDiv = createTaskCard(task, userId);
          usersDetail.appendChild(detailsDiv);
        });
      })
      .catch(function (error) {
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
      updateTask(
        task.id,
        {
          title: taskTitle.value,
          category: taskCategory.value,
          description: taskDescription.value,
          deadline: taskDeadline.value,
          priority: taskPriority.value,
        },
        userId
      );
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

  function addTask() {
    const userId = userDropDown.value;
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
      .then(function (response) {
        return response.json();
      })
      .then(function (task) {
        const detailsDiv = createTaskCard(task, userId);
        usersDetail.appendChild(detailsDiv); // Add the new task to the list
      })
      .catch(function (error) {
        console.error("Error adding task:", error);
      });
  }

  function updateTask(taskId, updatedTask, userId) {
    fetch(apiUrlTodos + "/" + taskId, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedTask),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function () {
        populateUserDetails(userId); // Refresh the list
      })
      .catch(function (error) {
        console.error("Error updating task:", error);
      });
  }

  function deleteTask(taskId, userId) {
    fetch(apiUrlTodos + "/" + taskId, {
      method: "DELETE",
    })
      .then(function () {
        populateUserDetails(userId); // Refresh the list
      })
      .catch(function (error) {
        console.error("Error deleting task:", error);
      });
  }

  // Initial population of user dropdown
  getUserDropDown();
});
