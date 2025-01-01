const container = document.getElementById('memories-container');
const affirmationsPositions = [];

function openMemoryModal() {
    document.getElementById('memoryInput').value = '';
    const modal = new bootstrap.Modal(document.getElementById('memoryModal'));
    modal.show();
}


function addMemory() {
    const inputText = document.getElementById('memoryInput').value.trim();
    if (!inputText) return;
    let treeSize = 120;
    const existingMemories = container.querySelectorAll('.memory');
    let randomTop, randomLeft;
    let attempts = 0;
    const maxAttempts = 1000;

    const topMargin = 50; // Adjust this value to control top margin
    const leftMargin = 150; // Adjust this value to control left margin

    // Spread trees across the full screen with a margin
    do {
        randomTop = Math.random() * (window.innerHeight - treeSize - topMargin);
        randomLeft = Math.random() * (window.innerWidth - treeSize - leftMargin);
        attempts++;
    } while (isOverlapping(randomTop, randomLeft, affirmationsPositions) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
        alert('Unable to find a non-overlapping position. Please try again.');
        return;
    }

    const newTree = document.createElement('img');
    newTree.src = 'assets/tree2.png';
    newTree.className = 'memory';
    newTree.style.top = `${randomTop}px`;
    newTree.style.left = `${randomLeft}px`;
    newTree.setAttribute('data-memory', inputText);

    newTree.addEventListener('click', () => showMemory(newTree));
    container.appendChild(newTree);

    // Add the new tree's position to the list of positions
    affirmationsPositions.push({ top: randomTop, left: randomLeft });

    bootstrap.Modal.getInstance(document.getElementById('memoryModal')).hide();
}

function isOverlapping(newTop, newLeft, existingPositions) {
    const treeSize = 150; // Size of each tree (you may adjust this value based on the actual size of the trees)

    // Loop through all existing positions (including both types of trees)
    for (const position of existingPositions) {
        const existingTop = position.top + treeSize;
        const existingLeft = position.left + treeSize;
        const existingBottom = existingTop + treeSize;
        const existingRight = existingLeft + treeSize;

        if (
            newTop + treeSize < existingBottom &&
            newTop + treeSize > existingTop &&
            newLeft + treeSize < existingRight &&
            newLeft + treeSize > existingLeft
        ) {
            return true; // Overlap detected
        }
    }

    return false; // No overlap detected
}

async function fetchAffirmations(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.affirmations;
    } catch (error) {
        console.error('Error fetching affirmations:', error);
        return [];
    }
}

function createTree(index) {
    const tree = document.createElement('img');
    tree.src = 'assets/tree1.png';
    tree.className = 'memory';
    tree.alt = `Tree${index + 1}`;
    tree.style.position = 'absolute';

    const treeSize = 100;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const horizontalSpacing = Math.min(200, screenWidth / 8); // Horizontal spacing between trees
    const verticalSpacing = Math.min(350, screenHeight / 4); // Increased vertical spacing between rows

    const treesPerRow = Math.floor(screenWidth / (horizontalSpacing + treeSize)); // Number of trees per row
    const row = Math.floor(index / treesPerRow);
    const column = index % treesPerRow;

    const topMargin = 0; // Top margin to avoid placing trees too close to the top
    const leftMargin = 50; // Left margin to avoid placing trees too close to the left

    // Calculate positions for zigzag pattern
    const topPosition = topMargin + row * verticalSpacing;
    const leftPosition =
        leftMargin + column * (horizontalSpacing + treeSize) + (row % 2 === 1 ? horizontalSpacing / 2 : 0);

    // Ensure trees stay within the screen boundaries
    if (topPosition + treeSize > screenHeight || leftPosition + treeSize > screenWidth) {
        return null; // Skip tree creation if it exceeds the screen
    }

    tree.style.top = `${topPosition}px`;
    tree.style.left = `${leftPosition}px`;

    // Store the position for overlap detection if needed
    affirmationsPositions.push({ top: topPosition, left: leftPosition });

    return tree;
}


function showMemory(tree) {
    const memoryText = tree.getAttribute('data-memory');
    const bubble = document.createElement('div');
    bubble.className = 'memory-text';
    bubble.style.padding = `5px`;
    bubble.style.display = `flex`;

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '-4px';
    closeButton.style.right = '-2px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'transparent';
    closeButton.style.fontSize = '1.5rem';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#333';

    closeButton.addEventListener('click', () => bubble.remove());

    bubble.appendChild(closeButton);
    const textContent = document.createElement('div');
    textContent.textContent = memoryText;
    textContent.style.marginTop = '2px';
    textContent.style.padding = '10px';
    textContent.style.wordBreak = 'break-word';
    bubble.appendChild(textContent);

    const rect = tree.getBoundingClientRect();

    // Ensure the bubble stays within the viewport
    let bubbleLeft = rect.left + rect.width / 2;
    if (bubbleLeft + bubble.offsetWidth > window.innerWidth) {
        bubbleLeft = window.innerWidth - bubble.offsetWidth - 10;
    } else if (bubbleLeft < 0) {
        bubbleLeft = 10;
    }

    let bubbleTop = rect.top - 10;
    if (bubbleTop + bubble.offsetHeight < 0) {
        bubbleTop = rect.bottom + 10;
    } else if (bubbleTop + bubble.offsetHeight > window.innerHeight) {
        bubbleTop = window.innerHeight - bubble.offsetHeight - 10;
    }

    bubble.style.top = `${bubbleTop}px`;
    bubble.style.left = `${bubbleLeft}px`;

    document.body.appendChild(bubble);
}

document.addEventListener('DOMContentLoaded', async () => {
    const affirmationsURL = '../data/affirmations.json';
    const container = document.getElementById('tree-container');

    try {
        const affirmations = await fetchAffirmations(affirmationsURL);

        affirmations.forEach((_, index) => {
            const tree = createTree(index);
            if (tree) {
                tree.addEventListener('click', () => showAffirmation(tree, affirmations, index));
                container.appendChild(tree);
            }
        });
    } catch (error) {
        console.error('Error rendering trees:', error);
    }
});

function showAffirmation(tree, affirmations, index) {
    const affirmation = affirmations[index];

    const bubble = document.createElement('div');
    bubble.className = 'memory-text';
    bubble.style.padding = `5px`;
    bubble.style.display = `flex`;

    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '-4px';
    closeButton.style.right = '-2px';
    closeButton.style.border = 'none';
    closeButton.style.background = 'transparent';
    closeButton.style.fontSize = '1.5rem';
    closeButton.style.cursor = 'pointer';
    closeButton.style.color = '#333';

    closeButton.addEventListener('click', () => bubble.remove());

    bubble.appendChild(closeButton);
    const textContent = document.createElement('div');
    textContent.textContent = affirmation;
    textContent.style.marginTop = '2px';
    textContent.style.padding = '10px';
    textContent.style.wordBreak = 'break-word';
    bubble.appendChild(textContent);

    const rect = tree.getBoundingClientRect();

    let bubbleLeft = rect.left + rect.width / 2;
    if (bubbleLeft + bubble.offsetWidth > window.innerWidth) {
        bubbleLeft = window.innerWidth - bubble.offsetWidth - 10;
    } else if (bubbleLeft < 0) {
        bubbleLeft = 10;
    }

    let bubbleTop = rect.top - 10;
    if (bubbleTop + bubble.offsetHeight < 0) {
        bubbleTop = rect.bottom + 10;
    } else if (bubbleTop + bubble.offsetHeight > window.innerHeight) {
        bubbleTop = window.innerHeight - bubble.offsetHeight - 10;
    }

    bubble.style.top = `${bubbleTop}px`;
    bubble.style.left = `${bubbleLeft}px`;

    document.body.appendChild(bubble);
}
