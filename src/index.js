

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
    console.log(`str: ${str === '-'}`);
    return object[str];
}

function makeAnArrayFromString(str) {
    return str.split(' ').join('').split('').map((i) => {
        if (i === '*' || i === '/' || i === '-' || i === '+') {
            return ` ${i} `;
        }
        return i
    }).join('').split(' ');
};

function stringAnalyser(str) {
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

function expressionCalculator(expr) {

    if (expr.includes('/ 0')) throw new Error("TypeError: Division by zero.");
    const newExp = makeAnArrayFromString(expr);
    const arrayOutOfPlus = newExp.join('').split('+');
    let aa = arrayOutOfPlus.reduce((acc, i) => {
        if (stringAnalyser(i).length === 1) {
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
    return aa;
}

module.exports = {
    expressionCalculator
}