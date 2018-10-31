const MAX_STACK_SIZE = 8;
var stack = [];
var heap = {};

function interpret(opcode, arg) {
    console.log(opcode + ", " + arg + ". Peek: " + stack[stack.length - 1]);
    let success = 1;
    let a, b;
    if (OPCODES_ARG.includes(opcode)) {
        // Args
        if (!arg) {
            errorToOutput("Invalid parameter");
            return -1;
        }
        switch (opcode) {
            case "push":
                success = pushOnStack(arg);
                currentLine++;
                break;
            case "jump":
                currentLine = arg;
                break;
            case "jump_true":
                a = popFromStack();
                if (a != null) {
                    if (a === 1) {
                        currentLine = arg;
                    } else {
                        currentLine++;
                    }
                } else {
                    success = -1;
                }
                break;
            case "jump_false":
                a = popFromStack();
                if (a != null) {
                    if (a === 0) {
                        currentLine = arg;
                    } else {
                        currentLine++;
                    }
                } else {
                    success = -1;
                }
                break;
            case "store_var":
                a = popFromStack();
                if (a !== null) {
                    if (Number.isInteger(parseInt(arg)) && parseInt(arg) >= 0) {
                        heap[arg] = a;
                    } else {
                        errorToOutput("Heap location must be a positive integer");
                        success = -1;
                    }
                } else {
                    success = -1;
                }
                currentLine++;
                break;
            case "load_var":
                if (heap.hasOwnProperty(arg)) {
                    success = pushOnStack(heap[arg]);
                } else {
                    errorToOutput("Location " + arg + " does not exist in heap");
                    success = -1;
                }
                currentLine++;
                break;
            default:
                errorToOutput("Unknown opcode: " + opcode);
                success = -1;
                break;
        }
    } else {
        // No args
        switch (opcode) {
            case "pop":
                if (!popFromStack()) {
                    success = -1;
                }
                currentLine++;
                break;
            case "print":
                a = popFromStack();
                if (a != null) {
                    logToOutput(a);
                } else {
                    success = -1;
                }
                currentLine++;
                break;
            case "add":
                a = popFromStack();
                b = popFromStack();
                if (a != null && b != null) {
                    success = pushOnStack(b + a);
                } else {
                    success = -1;
                }
                currentLine++;
                break;
            case "subtract":
                a = popFromStack();
                b = popFromStack();
                if (a !=  null && b != null) {
                    success = pushOnStack(b - a);
                } else {
                    success = -1;
                }
                currentLine++;
                break;
            case "multiply":
                a = popFromStack();
                b = popFromStack();
                if (a != null && b != null) {
                    success = pushOnStack(b * a);
                } else {
                    success = -1;
                }
                currentLine++;
                break;
            case "divide":
                a = popFromStack();
                b = popFromStack();
                if (a != null && b != null) {
                    success = pushOnStack(b / a);
                } else {
                    success = -1;
                }
                currentLine++;
                break;
            case "less_than":
                a = popFromStack();
                b = popFromStack();
                if (a != null && b != null) {
                    success = pushOnStack(b < a ? 1 : 0);
                } else {
                    success = -1;
                }
                currentLine++;
                break;
            case "equal":
                a = popFromStack();
                b = popFromStack();
                if (a != null && b != null) {
                    success = pushOnStack(b === a ? 1 : 0);
                } else {
                    success = -1;
                }
                currentLine++;
                break;
            case "greater_than":
                a = popFromStack();
                b = popFromStack();
                if (a != null && b != null) {
                    success = pushOnStack(b > a ? 1 : 0);
                } else {
                    success = -1;
                }
                currentLine++;
                break;
            case "exit":
                return 0;
            default:
                errorToOutput("Unknown opcode: " + opcode);
                return -1;
        }
    }
    return success;
}

function popFromStack() {
    if (stack.length > 0) {
        return parseFloat(stack.pop());
    }
    errorToOutput("Stack underflow (tried to pop from empty stack)");
    return null;
}

function pushOnStack(val) {
    if (stack.length < MAX_STACK_SIZE) {
        stack.push(val);
        return 1;
    }
    errorToOutput("Stack overflow (tried to push onto full stack)");
    return -1;
}

function logToOutput(msg) {
    document.getElementById("program-output").textContent += msg + '\n';
    scrollToBottom();
}

function errorToOutput(msg) {
    logToOutput("[ERROR][line:" + currentLine + "] " + msg);
}

function scrollToBottom() {
    let textarea = document.getElementById("program-output");
    textarea.scrollTop = textarea.scrollHeight;
}

function reset() {
    document.getElementById("program-output").textContent = '';
    stack = [];
    heap = {};
    currentLine = 0;
}