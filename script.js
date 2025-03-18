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
        colors[colors.length - 1].name = name;
        nameForm.addClass("hidden");
        redraw();
    }
}

// ✅ Reset function to clear all colors
function resetColors() {
    colors = []; // Clear colors
    redraw(); // Refresh canvas
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
        fill(colors[i].hex);
        rect(0, i * stripeHeight, width, stripeHeight);
        fill(255);
        textSize(16);
        textAlign(LEFT, CENTER);
        let displayText = colors[i].name ? `#${colors[i].hex} - ${colors[i].name}` : `#${colors[i].hex} (Name it below)`;
        text(displayText, 20, i * stripeHeight + stripeHeight / 2);
    }
}

function randomHexColor() {
    return color(random(255), random(255), random(255));
}
