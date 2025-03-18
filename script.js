let colors = [];
let addButton, resetButton, nameForm, colorNameInput, saveColorName;
let newColorHex = null;

function setup() {
    let canvas = createCanvas(windowWidth * 0.8, windowHeight * 0.6);
    canvas.parent("canvas-container");
    noLoop();

    // Get elements from HTML
    addButton = select("#addColor");
    resetButton = select("#resetButton");
    nameForm = select("#nameForm");
    colorNameInput = select("#colorNameInput");
    saveColorName = select("#saveColorName");

    // Load stored colors from local storage
    loadColorsFromLocalStorage();

    // Add event listeners
    addButton.mousePressed(addColor);
    resetButton.mousePressed(resetColors);
    saveColorName.mousePressed(saveName);
    colorNameInput.elt.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            saveName();
        }
    });
}

function addColor() {
    newColorHex = randomHexColor();
    colors.push({ hex: newColorHex, name: "" });

    redraw();
    setTimeout(() => {
        nameForm.removeClass("hidden");
        colorNameInput.value("");
        colorNameInput.elt.focus();
    }, 300);
}

function saveName() {
    let name = colorNameInput.value().trim();
    if (name !== "") {
        let lastColor = colors[colors.length - 1];

        if (lastColor.name) {
            lastColor.name += `, ${name}`;
        } else {
            lastColor.name = name;
        }

        nameForm.addClass("hidden");
        saveColorsToLocalStorage();
        updateColorLibrary(); // Update only the list
    }
}


//  Function to update the Color Library section
function updateColorLibrary() {
    let libraryDiv = select("#colorLibrary");
    libraryDiv.html(""); // Clear existing content

    if (colors.length === 0) {
        libraryDiv.html("<p>No colors saved yet.</p>");
        return;
    }

    for (let i = 0; i < colors.length; i++) {
        let colorEntry = createDiv();
        colorEntry.class("color-stripe");
        colorEntry.style("background-color", colors[i].hex);
        colorEntry.html(`<span>${colors[i].hex} - ${colors[i].name}</span>`);

        // Allow clicking a color to rename it
        colorEntry.mousePressed(() => renameColor(i));

        libraryDiv.child(colorEntry);
    }
}


//  Function to rename an existing color in the library
function renameColor(index) {
    let newName = prompt(`Rename ${colors[index].hex}:`, colors[index].name);
    if (newName) {
        colors[index].name += `, ${newName}`;
        saveColorsToLocalStorage();
        updateColorLibrary();
        redraw();
    }
}

//  Function to save colors to local storage
function saveColorsToLocalStorage() {
    localStorage.setItem("colorLibrary", JSON.stringify(colors));
}

//  Function to load colors from local storage when site opens
function loadColorsFromLocalStorage() {
    let storedColors = localStorage.getItem("colorLibrary");
    if (storedColors) {
        colors = JSON.parse(storedColors);
        updateColorLibrary();
    }
}


//  Reset function clears local storage
function resetColors() {
    colors = [];
    localStorage.removeItem("colorLibrary");
    updateColorLibrary(); // Clear the displayed list
}


// Draw the colors on the canvas
function draw() {
    //background(220);

    if (colors.length === 0) {
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Click 'Add Color' to begin", width / 2, height / 2 - 30);
        return;
    }

    let stripeHeight = height / max(1, colors.length);

    for (let i = 0; i < colors.length; i++) {
        fill(color(colors[i].hex));
        rect(0, i * stripeHeight, width, stripeHeight);
        fill(255);
        textSize(16);
        textAlign(LEFT, CENTER);
        let displayText = `${colors[i].hex} - ${colors[i].name}`;
        text(displayText, 20, i * stripeHeight + stripeHeight / 2);
    }
}

//  Function to generate a random HEX color
function randomHexColor() {
    let r = floor(random(256));
    let g = floor(random(256));
    let b = floor(random(256));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
