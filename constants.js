const OPCODES_NOARG = [
    "pop", // Pops number from stack
    "print", // Pops and prints top number
    "add", // Pops top two numbers. top-1 + top
    "subtract", // Pops top two numbers. top-1 - top
    "multiply", // Pops top two numbers. top-1 * top
    "divide", // Pops top two numbers. top-1 / top
    "less_than", // Pops top two numbers. top-1 < top. 1 if true, 0 if false
    "equal", // Pops top two numbers. top-1 == top. 1 if true, 0 if false
    "greater_than", // Pops top two numbers. top-1 > top. 1 if true, 0 if false
    "exit" // Exits the program
];

const OPCODES_ARG = [
    "push", // Pushes number onto stack
    "jump", // Jumps unconditionally
    "jump_true", // Pops top, jumps if 1
    "jump_false", // Pops top, jumps if 0
    "store_var", // Pops top number and stores in specified location
    "load_var" // Pushes number from specified location
];

const CHALLENGE_OUTPUTS = [
    `1
2
3`,

    `1
2
4
8
16
32
64
128
256
512
1024`
];