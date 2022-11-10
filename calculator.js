let displayVal = '';
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

let appendDigit = (digit) => {
    if (displayVal.length < 10) displayVal += digit;
    updateDisplay(displayVal);
}
let clearAll = () => {
    displayVal = '';
    queue = [];
    updateDisplay(displayVal);
    updateQueue(queue);
}
let updateDisplay = (str) => {
    const display = document.querySelector('#display');
    display.textContent = str;
}

const clear = document.querySelector('#clear');
clear.addEventListener('click', () => clearAll());

const digits = document.querySelectorAll('.digit');
digits.forEach(digit => digit.addEventListener('click', () => appendDigit(digit.id)));

// equals
// tenth decimal
// backspace
// keyboard support