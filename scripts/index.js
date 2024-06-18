document.addEventListener("DOMContentLoaded", () => {
  const todoImages = [
    "images/todo1.png",
    "images/todo2.png",
    "images/todo4.png",
  ];

  const container = document.querySelector(".todoImagesContainer");

  let index = 0;
  const interval = setInterval(() => {
    if (index < todoImages.length) {
      const img = document.createElement("img");
      img.src = todoImages[index];
      img.alt = "ToDo Image";
      img.classList.add("todoImage");
      container.appendChild(img);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 2000); // Adds a new image every 2 seconds

  const greeting = document.querySelector("h1");

  greeting.addEventListener("mouseover", () => {
    greeting.textContent = "Welcome to Stay Organized!";
  });

  greeting.addEventListener("mouseout", () => {
    greeting.textContent = "Stay Organized";
  });
});
