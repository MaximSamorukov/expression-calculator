

function eval() {
    // Do not use eval!!!
    return;
}

function splitWithMinus(str) {
    let chunk = '';
    let fArray = [];
    str.split('').map((i, index, arr) => {
        if (i !== '-') {
            chunk += i;
            if (index === arr.length - 1) {
                fArray.push(chunk);
                chunk = '';
            }
        };
        if (i === '-') {
            if (index === 0 || (index !== 0 && (arr[index - 1] === '*' || arr[index - 1] === '/'))) {
                chunk += i;
            } else {
                fArray.push(chunk);
                chunk = '';
            }
        };
        return i;
    });
    return fArray;
}

function substraction(array) {
    let value = array.filter((i) => i !== '-');
    value = value.reduce((acc, i, index, arr) => {
        if (index === 0) {
            acc = parseFloat(i);
            return acc;
        }
        return (acc - parseFloat(i));
    }, 0);
    return value;
}

function addition(array) {
    let value = array.filter((i) => i !== '+');
    value = value.reduce((acc, i) => acc + parseFloat(i), 0);
    return value;
}

function multiplicationAndDivision(array) {
    const returnValue = array.map((i, index, arr) => {
        if (index > 0 && (arr[index - 1] === '/' || arr[index - 1] === '*')) {
            const value = arr[index - 1] === '*' ? arr[index - 2] * arr[index] : arr[index - 2] / arr[index];
            arr[index] = value;
            return value;
        }
        return i;
    });
    return returnValue[returnValue.length - 1];
}

function dispatcher(str) {
    const object = {
        '-': (array) => substraction(array),
        '*': (array) => multiplicationAndDivision(array),
        '/': (array) => multiplicationAndDivision(array),
    }
    return object[str];
}

function makeAnArrayFromString(str) {
    return str.split(' ').join('').split('').map((i, index, arr) => {
        if (i === '*' || i === '/' || (i === '-' && (index !== 0 && (arr[index - 1] !== '*' && arr[index - 1] !== '/'))) || i === '+' || i === ')' || i === '(') {
            return ` ${i} `;
        }
        return i;
    }).join('').split(' ').filter((i) => i !== '');
};

function stringAnalyser(str) {
    let returnArray = [];
    const operands = ['-', '*', '/'];
    str.split('').map((i, index, arr) => {
        if (i === '-') {
            if (index === 0 || (index !== 0 && (arr[index - 1] === '*' || arr[index - 1] === '/'))) {
                returnArray.push('');
            } else {
                if (!returnArray.includes(i)) {
                    returnArray.push(i);
                }
            }
        };
        if (i === '*') {
            if (!returnArray.includes('*')) {
                returnArray.push('*')
            }
        };
        if (i === '/') {
            if (!returnArray.includes('*')) {
                returnArray.push('*')
            }
        };
        return i;
    })
    return returnArray.map((i) => {
        if (i === '/' && returnArray.includes('*')) {
            return '';
        }
        return i;
    }).filter((i) => i !== '');
}

function bracketSolver(arr) {
    let innerBracketExpression = [];
    const originalExpression = []
    let count = 0;
    arr.map((i, index, arr) => {
        if (i === '(') {
            count = count + 1;
            if (count > 1) {
                innerBracketExpression.push(i);
            }
        };
        if (i === ')') {
            count = count - 1;

            if (count === 0) {
                originalExpression.push(expressionCalculator(innerBracketExpression.join('')));
                innerBracketExpression = [];
            };
        };
        if (count > 0 && i !== '(') {
            innerBracketExpression.push(i);
        };
        if (count === 0 && i !== ')') {
            originalExpression.push(i);
        };
        if (count < 0 || (count > 0 && index === arr.length - 1)) {
            throw new Error("ExpressionError: Brackets must be paired");
        };
        return i;
    });
    const as = originalExpression.map((i, index, arr) => {

        if (i === '-' && (typeof arr[index + 1] === 'number' && arr[index + 1] < 0)) {
            originalExpression[index + 1] = originalExpression[index + 1] * (-1);
            return '+';
        }
        return i;
    });
    return as;
}

function expressionCalculator(expr) {

    if (expr.includes('/ 0') || expr.includes('/0')) throw new Error("TypeError: Division by zero.");
    const newExp = makeAnArrayFromString(expr);
    const newExpresWithoutBrackets = bracketSolver(newExp);
    const arrayOutOfPlus = newExpresWithoutBrackets.join('').split('+');
    let aa = arrayOutOfPlus.reduce((acc, i) => {
        if (stringAnalyser(i).length === 1) {
            return acc + dispatcher(stringAnalyser(i)[0])(makeAnArrayFromString(i));
        }
        else if (stringAnalyser(i).length > 1) {

            let arrWithoutMinus = splitWithMinus(i);

            return acc + substraction(arrWithoutMinus.map((i) => {
                if (stringAnalyser(i).length === 1) {
                    return multiplicationAndDivision(makeAnArrayFromString(i));
                }
                return i;
            }));
        } else {
            return acc + parseFloat(i);
        }
    }, 0);
    return aa;
}

module.exports = {
    expressionCalculator
}