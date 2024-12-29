const character = document.getElementById("character");
const messageBox = document.getElementById("message-box");
const closeIcon = document.querySelector(".close-icon");

// Add click event to the image
character.addEventListener("click", function () {
  messageBox.classList.remove("message-hidden");
  messageBox.classList.add("message-visible");
});

// Close icon functionality
closeIcon.addEventListener("click", function () {
  messageBox.classList.remove("message-visible");
  messageBox.classList.add("message-hidden");
});


