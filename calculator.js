let display = '';
let queue = [];
const MAX_DISPLAY_LENGTH = 8;
// operations
const add = (addend1, addend2) => +addend1 + +addend2;
const subtract = (minuend, subtrahend) => +minuend - +subtrahend;
const multiply = (multiplier, multiplicand) => +multiplier * +multiplicand;
const divide = (dividend, divisor) => {
    if (parseFloat(divisor) === 0.0) return undefined;
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
    if (queueHasEqual()) clear();
    if (!displayIsMaxLength() && (!display.includes('.') || (display.charAt(display.length - 1) === '.'))) setDisplay(display += str);
}
const appendDecimal = () => {
    if (queueHasEqual()) clear();
    if (!displayIsMaxLength()) {
        if (display.includes('.')) return;
        (display.length === 0) ? setDisplay(display += '0.') : setDisplay(display += '.');
    }
}
const clearDisplay = () => setDisplay('');
const displayIsMaxLength = () => {return display.length >= MAX_DISPLAY_LENGTH;}
const removeDigit = () => {
    if (queueHasEqual()) clear();
    if (display.length > 0) setDisplay(display.substring(0, display.length - 1));
}
const setDisplay = (str = '') => {
    display = str;
    updateDisplay();
}
const updateDisplay = () => {
    if (display.length > MAX_DISPLAY_LENGTH) display = display.substring(0, MAX_DISPLAY_LENGTH);
    document.querySelector('#display').textContent = display
}
// queue
const appendOperator = (operator) => {
    if (display === '' && queue.length > 0 && !queueHasEqual()) {
        popFromQueue();
        pushToQueue(operator);
    } else if (display !== '' && !isNaN(display)) {
        if (queueHasEqual()) clearQueue();
        pushToQueue(display);
        clearDisplay();
        pushToQueue(operator);
    }
}
const clearQueue = () => setQueue([]);
const popFromQueue = () => setQueue(queue.slice(0, queue.length - 1));
const pushToQueue = (str) => setQueue([...queue, formatStrLikeNum(str)]);
const queueHasEqual = () => {return (queue[queue.length - 1] === '=')};
const setQueue = (strArray = []) => {
    queue = strArray;
    updateQueue();
}
const formatStrLikeNum = (str) => {
    if (!isNaN(str) && str !== '') return (str.toString().includes('.')) ? parseFloat(str).toFixed(1).toString() : parseInt(str).toString();
    return str;
}
const updateQueue = () => document.querySelector('#queue').textContent = queue.join(' ');

const clear = () => {
    clearDisplay();
    clearQueue();
}
const equal = () => {
    if (queue.length === 0 || queueHasEqual()) return;
    (display === '') ? popFromQueue() : pushToQueue(display);
    pushToQueue('=');

    orderOfOp();
}
const L2R = () => {
    let queueCopy = queue;
    try {
        while (true) {
            let newNum = operate(queueCopy[1], queueCopy[0], queueCopy[2]);
            if (newNum === undefined) throw singularityEvent();

            queueCopy.splice(0, 3, newNum.toString());

            if (queueCopy.length === 2) {
                setDisplay(formatStrLikeNum(newNum));
                return;
            }
            if (queueCopy.length <= 1) 'ERR';
        }
    } catch(err) {
        console.log(err);
        setDisplay(err);
    }
}
const MDAS = () => {
    let queueCopy = queue;
    try {
        const MDAS = [['*', '/'], ['+', '-']];
        MDAS.forEach(operator => {
            while (true) {
                let i = queueCopy.findIndex(element => element === operator[0] || element === operator[1]);
                if (i === -1) break;

                let newNum = operate(queueCopy[i], queueCopy[i - 1], queueCopy[i + 1]);
                if (newNum === undefined) throw singularityEvent();

                queueCopy.splice(i - 1, 3, newNum.toString());

                if (queueCopy.length === 2) {
                    setDisplay(formatStrLikeNum(newNum));
                    return;
                }
                if (queueCopy.length <= 1) 'ERR';
            }
        });
    } catch(err) {
        console.log(err);
        setDisplay(err);
    }
}
const singularityEvent = () => {return 'uh oh';}
const toggleOrderOfOp = () => orderOfOp = (orderOfOp.name === 'MDAS') ? L2R : MDAS;

const backspaceBtn = document.querySelector('#backspace');
backspaceBtn.addEventListener('click', () => removeDigit());

const buttons = document.querySelectorAll('.button'); 
buttons.forEach(button => {
    if (button.id === 'l2r') {
        button.addEventListener('click', () => button.classList.toggle('clicked'));
    } else {
        button.addEventListener('click', () => button.classList.add('clicked'));
        button.addEventListener('transitionend', () => button.classList.remove('clicked'));
    }
});

const clearBtn = document.querySelector('#clear');
clearBtn.addEventListener('click', () => clear());

const decimalBtn = document.querySelector('#decimal');
decimalBtn.addEventListener('click', () => appendDecimal());

const digitBtns = document.querySelectorAll('.digit');
digitBtns.forEach(digitBtn => digitBtn.addEventListener('click', () => appendDigit(digitBtn.dataset.key)));

const equalBtn = document.querySelector('#equal');
equalBtn.addEventListener('click', () => equal());

const l2rBtn = document.querySelector('#l2r');
l2rBtn.addEventListener('click', () => toggleOrderOfOp());

const operatorBtns = document.querySelectorAll('.operator');
operatorBtns.forEach(operatorBtn => operatorBtn.addEventListener('click', () => appendOperator(operatorBtn.dataset.key)));

document.addEventListener('keydown', (event) => {
    const button = document.querySelector(`.button[data-key="${event.key}"]`);
    if (button) button.click();
});

let orderOfOp = MDAS;
