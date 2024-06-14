"use strict";

const selectUsers = document.getElementById("#selectUsers");
const displayTasks = document.querySelector("#displayTasks");

fetch("http://localhost:3000/todos")
  .then((response) => response.json())
  .then((todos) => {
    console.log(todos);
  });
  
.catch(error => {
   console.error('Error:', error);
 });

selectUsers.addEventListener(`change`, () => {
  const userId = selectUsers.value;
  fetch("http://localhost:3000/todos")
    .then((response) => response.json())
    .then((tasks) => {
      displayTasks.innerHTML = "";
      tasks.foreach((tasks) => {
        const displayTasks = document.createElement("div");
        displayTasks.textContent = tasks.text;
        displayTasks.appendChild(displayTasks);
      });
    });
});
