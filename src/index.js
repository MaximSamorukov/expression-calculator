

function eval() {
    // Do not use eval!!!
    return;
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
    // console.log(array);
    const returnValue = array.map((i, index, arr) => {
        if (index > 0 && (arr[index - 1] === '/' || arr[index - 1] === '*')) {
            const value = arr[index - 1] === '*' ? arr[index - 2] * arr[index] : arr[index - 2] / arr[index];
            arr[index] = value;
            return value;
        }
        return i;
    });
    // console.log(returnValue[returnValue.length - 1]);
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
    return str.split(' ').join('').split('').map((i) => {
        if (i === '*' || i === '/' || i === '-' || i === '+' || i === ')' || i === '(') {
            return ` ${i} `;
        }
        return i
    }).join('').split(' ').filter((i) => i !== '');
};

function stringAnalyser(str) {
    console.log(str);
    console.log(typeof str);
    let returnArray = [];
    const operands = ['-', '*', '/'];
    for (let i = 0; i < operands.length; i += 1) {
        if (str.includes(operands[i]) && !returnArray.includes(operands[i])) {
            returnArray.push(operands[i]);
        }
    }
    return returnArray.map((i) => {
        if (i === '/' && returnArray.includes('*')) {
            return '';
        }
        return i;
    }).filter((i) => i !== '');
}

function bracketSolver(arr) {
    const innerBracketExpression = [];
    const originalExpression = []
    let count = 0;
    arr.map((i, index, arr) => {
        if (i === '(') {
            count = count + 1;
        };
        if (i === ')') {
            count = count - 1;
            if (count === 0) {
                originalExpression.push(expressionCalculator(innerBracketExpression.join('')));
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
    })
    return originalExpression;
}

function expressionCalculator(expr) {

    if (expr.includes('/ 0') || expr.includes('/0')) throw new Error("TypeError: Division by zero.");
    const newExp = makeAnArrayFromString(expr);
    // console.log(newExp);
    const newExpresWithoutBrackets = bracketSolver(newExp);
    // console.log(newExpresWithoutBrackets);
    const arrayOutOfPlus = newExpresWithoutBrackets.join('').split('+');
    // console.log(arrayOutOfPlus);
    let aa = arrayOutOfPlus.reduce((acc, i) => {
        // console.log(`acc: ${acc}`);
        // console.log(`i: ${i}`);
        // console.log(stringAnalyser(i));
        if (stringAnalyser(i).length === 1) {
            // console.log(`i: ${i}`);
            // console.log((makeAnArrayFromString(i)));
            // console.log((stringAnalyser(i)));
            // console.log(dispatcher(stringAnalyser(i)[0])(makeAnArrayFromString(i)));
            return acc + dispatcher(stringAnalyser(i)[0])(makeAnArrayFromString(i));
        }
        else if (stringAnalyser(i).length > 1) {
            return acc + substraction(i.split('-').map((i) => {
                if (stringAnalyser(i).length === 1) {
                    return multiplicationAndDivision(makeAnArrayFromString(i));
                }
                return i;
            }));
        } else {
            return acc + parseFloat(i);
        }
    }, 0);
    // console.log(aa);
    return aa;
}

module.exports = {
    expressionCalculator
}