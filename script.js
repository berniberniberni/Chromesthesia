let colors = [];
let addButton, resetButton, nameForm, colorNameInput, saveColorName;
let newColorHex = null;

function setup() {
    let canvas = createCanvas(windowWidth * 0.8, windowHeight * 0.6);
    canvas.parent("canvas-container"); // Attach canvas to the div
    noLoop();

    // Get elements from HTML
    addButton = select("#addColor");
    resetButton = select("#resetButton");
    nameForm = select("#nameForm");
    colorNameInput = select("#colorNameInput");
    saveColorName = select("#saveColorName");

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
    newColorHex = randomHexColor(); // Generate HEX color
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
        colors[colors.length - 1].name = name;
        nameForm.addClass("hidden");
        redraw();
    }
}

// Reset function to clear all colors
function resetColors() {
    colors = [];
    redraw();
}

function draw() {
    background(220);

    if (colors.length === 0) {
        fill(0);
        textSize(20);
        textAlign(CENTER, CENTER);
        text("Click 'Add Color' to begin", width / 2, height / 2 - 30);
        return;
    }

    let stripeHeight = height / max(1, colors.length);

    for (let i = 0; i < colors.length; i++) {
        fill(color(colors[i].hex)); // Convert HEX string to p5.js color
        rect(0, i * stripeHeight, width, stripeHeight);
        fill(255);
        textSize(16);
        textAlign(LEFT, CENTER);
        let displayText = `${colors[i].hex} - ${colors[i].name}`; // Use Hex instead of RGB
        text(displayText, 20, i * stripeHeight + stripeHeight / 2);
    }
}

// ✅ Corrected function to generate a proper HEX code
function randomHexColor() {
    let r = floor(random(256));
    let g = floor(random(256));
    let b = floor(random(256));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}
