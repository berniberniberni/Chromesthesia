document.addEventListener("DOMContentLoaded", function () {
    addButton = document.getElementById("addColor");
    resetButton = document.getElementById("resetButton");
    sortHexButton = document.getElementById("sortHexButton"); // Add the sort button
    nameForm = document.getElementById("nameForm");
    colorNameInput = document.getElementById("colorNameInput");
    saveColorName = document.getElementById("saveColorName");

    loadColorsFromLocalStorage();

    addButton.addEventListener("click", addColor);
    resetButton.addEventListener("click", resetColors);
    sortHexButton.addEventListener("click", sortByHex); // Add event listener for sorting
    saveColorName.addEventListener("click", saveName);
    colorNameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            saveName();
        }
    });

    addDragAndDrop(); // Enable drag-and-drop functionality
});


function addColor() {
    newColorHex = randomHexColor();
    colors.unshift({ hex: newColorHex, name: "" });

    updateColorLibrary();
    setTimeout(() => {
        nameForm.classList.remove("hidden");
        colorNameInput.value = "";
        colorNameInput.focus();
    }, 300);
}

function saveName() {
    let name = colorNameInput.value.trim();
    if (name !== "") {
        let lastColor = colors[0];

        if (lastColor.name) {
            lastColor.name += `, ${name}`;
        } else {
            lastColor.name = name;
        }

        nameForm.classList.add("hidden");
        saveColorsToLocalStorage();
        updateColorLibrary();
    }
}

function updateColorLibrary() {
    let libraryDiv = document.getElementById("colorLibrary");
    libraryDiv.innerHTML = "";

    if (colors.length === 0) {
        libraryDiv.innerHTML = "<p>No colors saved yet.</p>";
        return;
    }

    colors.forEach((color, index) => {
        let colorEntry = document.createElement("div");
        colorEntry.className = "color-stripe";
        colorEntry.style.backgroundColor = color.hex;
        colorEntry.draggable = true; // Enable dragging
        colorEntry.innerHTML = `<span>${color.hex} - ${color.name}</span>`;

        colorEntry.addEventListener("click", () => renameColor(index));
        colorEntry.addEventListener("dragstart", (e) => dragStart(e, index));
        colorEntry.addEventListener("dragover", dragOver);
        colorEntry.addEventListener("drop", (e) => drop(e, index));

        libraryDiv.appendChild(colorEntry);
    });
}

function renameColor(index) {
    let newName = prompt(`Rename ${colors[index].hex}:`, colors[index].name);
    if (newName) {
        colors[index].name += `, ${newName}`;
        saveColorsToLocalStorage();
        updateColorLibrary();
    }
}

function saveColorsToLocalStorage() {
    localStorage.setItem("colorLibrary", JSON.stringify(colors));
}

function loadColorsFromLocalStorage() {
    let storedColors = localStorage.getItem("colorLibrary");
    if (storedColors) {
        colors = JSON.parse(storedColors);
        updateColorLibrary();
    }
}

function resetColors() {
    colors = [];
    localStorage.removeItem("colorLibrary");
    updateColorLibrary();
}

// 🎯 Drag-and-Drop Sorting Functions
let draggedIndex = null;

function dragStart(event, index) {
    draggedIndex = index;
    event.dataTransfer.effectAllowed = "move";
    event.target.classList.add("dragging");
}

function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
}

function drop(event, dropIndex) {
    event.preventDefault();
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
        let draggedColor = colors.splice(draggedIndex, 1)[0];
        colors.splice(dropIndex, 0, draggedColor);
        saveColorsToLocalStorage();
        updateColorLibrary();
    }

    draggedIndex = null;
}

// 🎨 Function to Generate a Random HEX Color
function randomHexColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function sortByHex() {
    colors.sort((a, b) => a.hex.localeCompare(b.hex)); // Sort by HEX value
    saveColorsToLocalStorage(); // Save sorted order
    updateColorLibrary(); // Update display
}