let display = '';
let queue = [];
// operations
let add = (addend1, addend2) => +addend1 + +addend2;
let subtract = (minuend, subtrahend) => +minuend - +subtrahend;
let multiply = (multiplier, multiplicand) => +multiplier * +multiplicand;
let divide = (dividend, divisor) => {
    if (parseInt(divisor) === 0) return undefined;
    return +dividend / +divisor;
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
// display
const appendDigit = (str) => {
    // trim to tenth
    if (display.length < 10) display += str;
    updateDisplay();
}
const removeDigit = () => {
    if (display.length > 0) display = display.substring(0, display.length - 1);
    updateDisplay();
}
const clearDisplay = () => setDisplay();
const setDisplay = (str = '') => {
    display = str;
    updateDisplay();
}
const updateDisplay = () => document.querySelector('#display').textContent = display;
// queue
const popFromQueue = () => {
    queue.pop();
    updateQueue;
}
const pushToQueue = (str) => {
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
clear.addEventListener('click', () => {
    clearDisplay();
    clearQueue();
});

const digits = document.querySelectorAll('.digit');
digits.forEach(digit => digit.addEventListener('click', () => appendDigit(digit.id)));

const equal = document.querySelector('#equal');
equal.addEventListener('click', () => {
    if (queue.length === 0) return;
    (display === '') ? popFromQueue() : pushToQueue(display);

    const MDAS = [['*', '/'], ['+', '-']];
    MDAS.forEach(operator => {
        while (true) {
            let i = queue.findIndex(element => element === operator[0] || element === operator[1]);
            if (i === -1) break;

            let newNum = operate(queue[i], queue[i - 1], queue[i + 1]);
            if (newNum === undefined) {
                setDisplay('uh oh');
                return;
            }

            queue.splice(i - 1, 3, newNum.toString());

            if (queue.length === 1) {
                setDisplay(newNum);
                return;
            } else if (queue.length <= 0) {
                setDisplay('ERROR');
                return;
            }
        }
    });
});

const operators = document.querySelectorAll('.operator');
operators.forEach(operator => operator.addEventListener('click', () => {
    if (display === '') return;
    pushToQueue(display);
    clearDisplay();
    pushToQueue(operator.id);
}));

// tenth decimal
// keyboard support
// clear queue and display when next button after equal is pressed
// consider pushing '=' to queue
// trim leading 0s