let display = '';
let queue = [];
const MAX_DISPLAY_LENGTH = 10;
// operations
const add = (addend1, addend2) => +addend1 + +addend2;
const subtract = (minuend, subtrahend) => +minuend - +subtrahend;
const multiply = (multiplier, multiplicand) => +multiplier * +multiplicand;
const divide = (dividend, divisor) => {
    if (parseInt(divisor) === 0) return undefined;
    return +dividend / +divisor;
}
const operate = (operator, num1, num2) => {
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
    if (display.length < MAX_DISPLAY_LENGTH) setDisplay(display += str);
}
const removeDigit = () => {
    if (display.length > 0) setDisplay(display.substring(0, display.length - 1));
}
const clearDisplay = () => setDisplay('');
const setDisplay = (str = '') => {
    display = str;
    updateDisplay();
}
const updateDisplay = () => {
    if (display.length > MAX_DISPLAY_LENGTH) display = display.substring(0, 10);
    if (!isNaN(display) && display.toString().includes('.')) display = parseFloat(display).toFixed(1).toString();
    document.querySelector('#display').textContent = display;
}
// queue
const popFromQueue = () => setQueue(queue.slice(0, queue.length - 1));
const pushToQueue = (str) => setQueue([...queue, str]);
const clearQueue = () => setQueue([]);
const setQueue = (strArray = []) => {
    queue = strArray;
    updateQueue();
}
const updateQueue = () => document.querySelector('#queue').textContent = queue.join(' ');

const backspace = document.querySelector('#backspace');
backspace.addEventListener('click', () => removeDigit());

const buttons = document.querySelectorAll('.button');
buttons.forEach(button => button.addEventListener('click', () => {
    button.classList.add('clicked');
}));
buttons.forEach(button => button.addEventListener('transitionend', () => {
    button.classList.remove('clicked');
}));

const clear = document.querySelector('#clear');
clear.addEventListener('click', () => {
    clearDisplay();
    clearQueue();
});

const digits = document.querySelectorAll('.digit');
digits.forEach(digit => digit.addEventListener('click', () => appendDigit(digit.dataset.key)));

const equal = document.querySelector('#equal');
equal.addEventListener('click', () => {
    if (queue.length === 0) return;
    (display === '') ? popFromQueue() : pushToQueue(display);

    let queueCopy = queue;
    const MDAS = [['*', '/'], ['+', '-']];
    MDAS.forEach(operator => {
        while (true) {
            let i = queueCopy.findIndex(element => element === operator[0] || element === operator[1]);
            if (i === -1) break;

            let newNum = operate(queueCopy[i], queueCopy[i - 1], queueCopy[i + 1]);
            if (newNum === undefined) {
                setDisplay('uh oh');
                return;
            }

            queueCopy.splice(i - 1, 3, newNum.toString());

            if (queueCopy.length === 1) {
                setDisplay(newNum);
                return;
            } else if (queueCopy.length <= 0) {
                setDisplay('ERR');
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
    pushToQueue(operator.dataset.key);
}));

document.addEventListener('keydown', (event) => {
    const button = document.querySelector(`.button[data-key="${event.key}"]`);
    if(button) button.click();
});

// tenth decimal
// clear queue and display when next button after equal is pressed
// consider pushing '=' to queue
// trim leading 0s