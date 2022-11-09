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
// equals
// clear
// output

// tenth decimal
// backspace
// keyboard support