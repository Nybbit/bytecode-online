var currentLine = 0;
var previousLine = 0;
var programLength = 0;
const runButton = document.getElementById("run-button");
const stopButton = document.getElementById("stop-button");
const programSpeed = document.getElementById("program-speed");
const table = document.getElementById("program");

const helpTab = document.getElementById("help-tab");
const challengesTab = document.getElementById("challenges-tab");

const helpDiv = document.getElementById("help");
const challengesDiv = document.getElementById("challenges");

let running = false;

helpTab.addEventListener("click", () => {
    if (!helpTab.classList.contains("is-active")) {
        helpTab.classList.add("is-active");
        helpDiv.classList.remove("hidden");
        challengesDiv.classList.add("hidden");
        challengesTab.classList.remove("is-active");
    }
});

challengesTab.addEventListener("click", () => {
    if (!challengesTab.classList.contains("is-active")) {
        challengesTab.classList.add("is-active");
        challengesDiv.classList.remove("hidden");
        helpDiv.classList.add("hidden");
        helpTab.classList.remove("is-active");
    }
});

runButton.addEventListener("click", runProgram);
stopButton.addEventListener("click", () => {
    if (running) {
        running = false;
        logToOutput("Program terminated");
    }
});

document.getElementById("opcode-toggle").addEventListener("click", () => {
    document.getElementById("opcode-list").classList.toggle("hidden");
});

document.addEventListener("DOMContentLoaded", () => {
    generateStackAndHeap();
    for (let i = 0; i < 16; i++) {
        addTableRow();
    }
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function runCurrentLine() {
    // Check if line is valid
    if (currentLine < 1 || currentLine > table.rows.length) {
        errorToOutput("Tried to run line that is not in the program");
        return -1;
    }

    // Remove old highlight
    removeHighlight(previousLine);

    // Highlight currently running line
    addHighlight(currentLine);

    let row = table.rows[currentLine - 1];

    // Get opcode and args
    let opcode = row.querySelector("select");
    let arg;
    if (row.querySelector(".arg-list:not(.is-invisible)")) {
        arg = row.querySelector("input").value;
    }

    previousLine = currentLine;
    return interpret(getValueOfDropdown(opcode), arg);
}

async function runProgram() {
    reset();
    runButton.classList.add("hidden");
    stopButton.classList.remove("hidden");

    let sleepTimeInMs;

    running = true;
    previousLine = 1;
    currentLine = 1;
    while (running) {
        switch (getValueOfDropdown(programSpeed)) {
            case "Realtime":
                sleepTimeInMs = 0;
                break;
            case "Fast":
                sleepTimeInMs = 100;
                break;
            case "Normal":
                sleepTimeInMs = 500;
                break;
            case "Slow":
                sleepTimeInMs = 1000;
                break;
        }

        let result = runCurrentLine(currentLine);
        updateStackAndHeap();
        switch (result) {
            case -1: // Error
                logToOutput("Program terminated due to error");
                running = false;
                await sleep(sleepTimeInMs);
                break;
            case 0: // Success exit
                checkChallengeCompletion();
                logToOutput("Program successfully finished");
                running = false;
                await sleep(sleepTimeInMs);
                break;
            case 1: // Success
                await sleep(sleepTimeInMs);
                break;
        }
    }

    removeHighlight(currentLine);
    removeHighlight(previousLine);

    runButton.classList.remove("hidden");
    stopButton.classList.add("hidden");
}

function getValueOfDropdown(element) {
    return element.options[element.selectedIndex].value;
}

function adaptToOpcode(event) {
    let argList = event.target.parentNode.parentNode.parentNode.querySelector(".arg-list");
    if (OPCODES_ARG.includes(event.target.value)) {
        if (argList.classList.contains("is-invisible")) {
            argList.classList.remove("is-invisible");
        }
    } else {
        if (!argList.classList.contains("is-invisible")) {
            argList.classList.add("is-invisible");
        }
    }
}

function addTableRow() {
    programLength++;

    let template = document.querySelector('[template="opcode-arg"]').content.firstElementChild.cloneNode(true);

    template.querySelector("th").innerHTML = programLength;

    for (o of OPCODES_ARG) {
        let opt = document.createElement("option");
        opt.innerHTML = o;
        template.querySelector("select").appendChild(opt);
    }
    for (o of OPCODES_NOARG) {
        let opt = document.createElement("option");
        opt.innerHTML = o;
        template.querySelector("select").appendChild(opt);
    }

    document.getElementById("program").appendChild(template);

    document.getElementById("program").children[programLength - 1].querySelector("select").addEventListener("change", adaptToOpcode);
}

function generateStackAndHeap() {
    // Stack
    for (let i = 0; i < MAX_STACK_SIZE; i++) {
        let template = document.querySelector('[template="stack"]').content.firstElementChild.cloneNode(true);

        template.querySelector("th").innerHTML = MAX_STACK_SIZE - i - 1;

        document.getElementById("stack").appendChild(template);
    }

    // todo: generate heap here instead of re-genning every update

    // Challenges
    for (let i = 0; i < CHALLENGE_OUTPUTS.length; i++) {
        let template = document.querySelector('[template="challenge"]').content.firstElementChild.cloneNode(true);

        template.querySelector(".challenge-title").innerHTML += (i + 1);
        template.querySelector(".challenge-output").textContent = CHALLENGE_OUTPUTS[i] + '\n' + "Program successfully finished" + '\n';

        document.getElementById("challenge-list").appendChild(template);
    }
}

function updateStackAndHeap() {
    // Stack
    for (let i = 0; i < MAX_STACK_SIZE; i++) {
        let element = document.getElementById("stack").children[MAX_STACK_SIZE - i - 1].querySelector("p");
        let stackIndex = i;
        if (stackIndex < stack.length) {
            element.innerHTML = stack[stackIndex];
        } else {
            element.innerHTML = "";
        }
    }

    // Heap
    document.getElementById("heap").innerHTML = "";
    for (let h in heap) {
        let template = document.querySelector('[template="stack"]').content.firstElementChild.cloneNode(true);
        template.querySelector("th").innerHTML = h;
        document.getElementById("heap").appendChild(template);

        for (e of document.getElementById("heap").querySelectorAll("tr")) {
            if (e.querySelector("th").innerHTML == h) {
                e.querySelector("p").innerHTML = heap[h];
                break;
            }
        }
    }
}

function removeHighlight(rowIndex) {
    if (rowIndex > 0 && rowIndex <= table.rows.length) {
        let row = table.rows[rowIndex - 1];
        if (row.classList.contains("is-selected")) {
            row.classList.remove("is-selected");
        }
    }
}

function addHighlight(rowIndex) {
    if (rowIndex > 0 && rowIndex <= table.rows.length) {
        let row = table.rows[rowIndex - 1];
        if (!row.classList.contains("is-selected")) {
            row.classList.add("is-selected");
        }
    }
}

function checkChallengeCompletion() {
    let programOutput = document.querySelector("#program-output").textContent;
    for (e of document.querySelectorAll(".challenge-tile")) {
        let title = e.querySelector(".challenge-title").innerHTML;
        let index = parseInt(title.substring(title.length - 1)) - 1;

        if (CHALLENGE_OUTPUTS[index].trim() === programOutput.trim()) {
            if (!e.classList.contains("is-success")) {
                e.classList.add("is-success");
            }
        }

        console.log(CHALLENGE_OUTPUTS[index]);
        console.log(programOutput);
    }
}