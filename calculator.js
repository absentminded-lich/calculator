let display = '';
let queue = [];
// operations
let add = (addend1, addend2) => addend1 + addend2;
let subtract = (minuend, subtrahend) => minuend - subtrahend;
let multiply = (multiplier, multiplicand) => multiplier * multiplicand;
let divide = (dividend, divisor) => {
    if (divisor === 0) return undefined;
    return dividend / divisor;
}
let operate = (operator, num1, num2) => {
    if (typeof operator === 'function') return operator(num1, num2); // just because
    switch (operator) {
        case '+': return add(num1, num2);
        case '-': return subtract(num1, num2);
        case '*': return multiply(num1, num2);
        case '/': return divide(num1, num2);
        default: break;
    }
}

const appendDigit = (str) => {
    if (display.length < 10) display += str;
    updateDisplay();
}
const removeDigit = () => {
    if (display.length > 0) display = display.substring(0, display.length - 1);
    updateDisplay();
}
// display
const clearDisplay = () => {
    display = '';
    updateDisplay();
}
const updateDisplay = () => document.querySelector('#display').textContent = display;
// queue
const appendQueue = (str) => {
    queue.push(str);
    updateQueue();
}
const clearQueue = () => {
    queue = [];
    updateQueue();
}
const updateQueue = () => document.querySelector('#queue').textContent = queue.join(' ');

const backspace = document.querySelector('#backspace');
backspace.addEventListener('click', () => removeDigit());

const clear = document.querySelector('#clear');
clear.addEventListener('click', () => {clearDisplay(); clearQueue();});

const digits = document.querySelectorAll('.digit');
digits.forEach(digit => digit.addEventListener('click', () => appendDigit(digit.id)));

const operators = document.querySelectorAll('.operator');
operators.forEach(operator => operator.addEventListener('click', () => {
    appendQueue(display);
    clearDisplay();
    appendQueue(operator.id);
}));

// equals
// tenth decimal
// keyboard support