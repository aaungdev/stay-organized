"use strict";

$(document).ready(function () {
    console.log("Document ready");

    // Fetch users and insert them into the user-select dropdown
    fetch('http://localhost:3000/users')
        .then(response => response.json())
        .then(users => {
            console.log("Users fetched:", users);
            users.forEach(user => {
                $('#user-select').append(`<option value="${user.id}">${user.name}</option>`);
            });
        })
        .catch(error => console.error("Error fetching users:", error));

    // Fetch ToDos for the selected user and insert them into the table
    $('#user-select').change(function () {
        const userId = $(this).val();
        console.log("Selected user ID:", userId);
        fetch(`http://localhost:3000/api/todos/byuser/${userId}`)
            .then(response => response.json())
            .then(todos => {
                console.log("Todos fetched:", todos);
                $('#todos-container').html(todos.map(todo => `<tr>
                        <td>${todo.description}</td>
                        <td>${todo.deadline}</td>
                    </tr>`).join(''));
            })
            .catch(error => console.error("Error fetching todos:", error));
    });
});
