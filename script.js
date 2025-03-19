let colors = [];
let addButton, resetButton, sortHexButton, nameForm, colorNameInput, saveColorName;
let newColorHex = null;

document.addEventListener("DOMContentLoaded", function () {
    addButton = document.getElementById("addColor");
    resetButton = document.getElementById("resetButton");
    sortHexButton = document.getElementById("sortHexButton");
    nameForm = document.getElementById("nameForm");
    colorNameInput = document.getElementById("colorNameInput");
    saveColorName = document.getElementById("saveColorName");

    loadColorsFromLocalStorage();

    addButton.addEventListener("click", addColor);
    resetButton.addEventListener("click", resetColors);
    sortHexButton.addEventListener("click", sortByHex);
    saveColorName.addEventListener("click", saveName);
    colorNameInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            saveName();
        }
    });

    enableResizing(); // Enable slider functionality
    addDragAndDrop(); // Enable drag-and-drop functionality
});

// ✅ Function to add a new color
function addColor() {
    newColorHex = randomHexColor();
    colors.unshift({ hex: newColorHex, name: "" }); // Add to the top

    updateColorLibrary();
    setTimeout(() => {
        nameForm.classList.remove("hidden");
        colorNameInput.value = "";
        colorNameInput.focus();
    }, 300);
}

// ✅ Function to save the name of the first (newest) color
function saveName() {
    let name = colorNameInput.value.trim();
    if (name !== "") {
        let firstColor = colors[0]; // Select the first (newest) color

        if (firstColor.name) {
            firstColor.name += `, ${name}`;
        } else {
            firstColor.name = name;
        }

        nameForm.classList.add("hidden");
        saveColorsToLocalStorage();
        updateColorLibrary();
    }
}

// ✅ Function to update the Color Library UI
function updateColorLibrary() {
    let colorSection = document.getElementById("color-section");
    let textSection = document.getElementById("text-section");

    colorSection.innerHTML = "";
    textSection.innerHTML = "";

    if (colors.length === 0) {
        textSection.innerHTML = "<p>No colors saved yet.</p>";
        return;
    }

    colors.forEach((color, index) => {
        let colorEntry = document.createElement("div");
        colorEntry.className = "color-stripe";
        colorEntry.style.backgroundColor = color.hex;
        colorEntry.draggable = true;

        let textEntry = document.createElement("div");
        textEntry.className = "text-stripe";
        textEntry.innerText = `${color.hex} - ${color.name}`;

        // Allow renaming on click
        textEntry.addEventListener("click", () => renameColor(index));

        // Drag-and-drop events
        colorEntry.addEventListener("dragstart", (e) => dragStart(e, index));
        colorEntry.addEventListener("dragover", dragOver);
        colorEntry.addEventListener("drop", (e) => drop(e, index));

        colorSection.appendChild(colorEntry);
        textSection.appendChild(textEntry);
    });
}

// ✅ Function to rename a color
function renameColor(index) {
    let newName = prompt(`Rename ${colors[index].hex}:`, colors[index].name);
    if (newName) {
        colors[index].name += `, ${newName}`;
        saveColorsToLocalStorage();
        updateColorLibrary();
    }
}

// ✅ Function to save colors to local storage
function saveColorsToLocalStorage() {
    localStorage.setItem("colorLibrary", JSON.stringify(colors));
}

// ✅ Function to load colors from local storage
function loadColorsFromLocalStorage() {
    let storedColors = localStorage.getItem("colorLibrary");
    if (storedColors) {
        colors = JSON.parse(storedColors);
        updateColorLibrary();
    }
}

// ✅ Function to reset the color library
function resetColors() {
    colors = [];
    localStorage.removeItem("colorLibrary");
    updateColorLibrary();
}

// ✅ Function to sort colors by HEX value
function sortByHex() {
    colors.sort((a, b) => a.hex.localeCompare(b.hex)); // Sort by HEX value
    saveColorsToLocalStorage();
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

// ✅ Function to enable the resizable slider
function enableResizing() {
    const slider = document.getElementById("slider");
    const colorSection = document.getElementById("color-section");
    const textSection = document.getElementById("text-section");

    let isResizing = false;

    slider.addEventListener("mousedown", (e) => {
        isResizing = true;
        document.body.style.cursor = "ew-resize"; // Change cursor on drag

        document.addEventListener("mousemove", resizeSections);
        document.addEventListener("mouseup", () => {
            isResizing = false;
            document.body.style.cursor = "default"; // Reset cursor
            document.removeEventListener("mousemove", resizeSections);
        });
    });

    function resizeSections(e) {
        if (!isResizing) return;

        let containerWidth = document.getElementById("resizable-container").offsetWidth;
        let newColorWidth = Math.max(10, Math.min(90, (e.clientX / containerWidth) * 100)); // Keep within 10-90%

        colorSection.style.width = `${newColorWidth}%`;
        textSection.style.width = `${100 - newColorWidth}%`;
    }
}

// ✅ Function to generate a random HEX color
function randomHexColor() {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}