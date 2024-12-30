const woodenBlocks = document.querySelectorAll(".wooden-step-img, .wooden-step-img-right, .wooden-step-img-2");
const finalStep = document.getElementById("final-step");
const character = document.getElementById("character");
const modal = document.getElementById("challengeModal");
const doneButton = document.getElementById("doneButton");
const closeButton = document.getElementById("closeButton");  // Close button reference
let currentStep = 0;

// Fetch tasks from the JSON file
// Fetch tasks from the JSON file
fetch('tasks.json')
  .then(response => response.json())
  .then(tasks => {
    const taskKeys = Object.keys(tasks);

    // Ensure we have 10 tasks
    if (taskKeys.length === 10) {
      // Assign tasks to the blocks
      woodenBlocks.forEach((block, index) => {
        block.addEventListener("click", () => {
          showTask(index, taskKeys, tasks);
        });
      });
    } else {
      console.error("There must be 10 tasks in the JSON file.");
    }
  })
  .catch(error => console.error("Error fetching tasks:", error));

// Show task in the modal
function showTask(index, taskKeys, tasks) {
  const modalBody = document.getElementById("modalBody");

  // Set title and body
  const taskTitle = taskKeys[index];
  const taskBody = tasks[taskTitle];

  modal.querySelector(".custom-modal-title").textContent = taskTitle;
  modalBody.textContent = taskBody;

  const modalInstance = new bootstrap.Modal(modal);
  document.body.style.overflow = "auto";
}

// Position the modal near the character when the block is clicked
woodenBlocks.forEach((block, index) => {
  block.addEventListener("click", () => {
    if (index === currentStep) {
      const rect = character.getBoundingClientRect();
      const parentRect = character.offsetParent.getBoundingClientRect();
      const offsetX = rect.left - parentRect.left + 280;
      const offsetY = rect.top - parentRect.top + 120;

      modal.style.left = `${offsetX}px`;
      modal.style.top = `${offsetY}px`;
      modal.style.display = "block"; // Show the modal
    }
  });
});

// Handle 'Done' button click
doneButton.addEventListener("click", () => {
  modal.style.display = "none";
  character.style.transition = "opacity 0.5s ease-in-out";
  character.style.opacity = "0";

  setTimeout(() => {
    character.style.opacity = "1";
    currentStep++;
    if (currentStep < woodenBlocks.length) {
    // if (currentStep < 1) {
      const nextBlock = woodenBlocks[currentStep];
      const rect = nextBlock.getBoundingClientRect();
      const parentRect = character.offsetParent.getBoundingClientRect();
      const offsetX = rect.left - parentRect.left - 25;
      const offsetY = rect.top - parentRect.top - 140;
      character.style.left = `${offsetX}px`;
      character.style.top = `${offsetY}px`;
      character.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      moveToFinalStep(); // Call function to move to the final step
    }
  }, 600);
});

// Handle 'Close' button click
closeButton.addEventListener("click", () => {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
});

// Move character to final step and play animation
function moveToFinalStep() {
  console.log("Finalll")
  const rect = finalStep.getBoundingClientRect();
  const parentRect = character.offsetParent.getBoundingClientRect();
  const offsetX = rect.left - parentRect.left - 33;
  const offsetY = rect.top - parentRect.top - 55;
  character.style.left = `${offsetX}px`;
  character.style.top = `${offsetY}px`;
  character.scrollIntoView({ behavior: "smooth", block: "center" });

  // Celebration animation
  setTimeout(() => {
    triggerFullScreenConfetti();
  }, 800);
}

function triggerFullScreenConfetti() {
  const confettiContainer = document.createElement("div");
  confettiContainer.classList.add("confetti");

  for (let i = 0; i < 100; i++) {
    const confettiPiece = document.createElement("div");
    confettiPiece.classList.add("confetti-piece");
    confettiPiece.style.left = `${Math.random() * 100}vw`;
    confettiPiece.style.animationDelay = `${Math.random() * 2}s`;
    confettiPiece.style.animationDuration = `${1 + Math.random() * 2}s`;
    confettiContainer.appendChild(confettiPiece);
  }

  document.body.appendChild(confettiContainer);
  setTimeout(() => {
    confettiContainer.remove();

    window.location.href = "congratulations.html"; // Redirect to the congratulations page
  }, 3000); // Duration of confetti animation
}




document.addEventListener("DOMContentLoaded", () => {
  const tasksModal = new bootstrap.Modal(document.getElementById("tasksModal"));
  const woodenBlocksContainer = document.getElementById("woodenBlocksContainer");
  const taskDescription = document.getElementById("taskDescription");
  const taskTitle = document.querySelector(".task-title");

  fetch("tasks.json")
    .then(response => response.json())
    .then(tasks => {
      const taskKeys = Object.keys(tasks);

      if (taskKeys.length === 10) {
        // Create 10 wooden blocks (images) and display them
        taskKeys.forEach((key, index) => {
          const block = document.createElement("img");
          block.className = "wooden-block";
          block.src = "../assets/wooden_block.png"; // Path to your wooden block image
          block.alt = `Wooden block ${index + 1}`;
          block.style.width = "40px";
          block.style.height = "40px";
          block.style.cursor = "pointer";

          // Add click event to each block to show the task description
          block.addEventListener("click", () => {
            taskTitle.innerHTML = `<strong>${key}</strong>:`;
            taskDescription.innerHTML = `${tasks[key]}`;
          });

          // Append the block to the container
          woodenBlocksContainer.appendChild(block);
        });

        // Show the modal when the page loads
        tasksModal.show();
      } else {
        console.error("There must be 10 tasks in the JSON file.");
      }
    })
    .catch(error => console.error("Error fetching tasks:", error));
});
