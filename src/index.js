

function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    const math = require('mathjs');
    try {
        const result = math.evaluate(expr);
        if (!Number.isFinite(result) || expr.includes('/ 0')) {
            throw new Error("TypeError: Division by zero.");
        }
        return result;
    } catch (e) {
        if (e instanceof SyntaxError) {
            throw new Error("ExpressionError: Brackets must be paired");
        }

        if (e.toString() === "Error: TypeError: Division by zero.") {
            throw new Error("TypeError: Division by zero.");
        }
    }
}

module.exports = {
    expressionCalculator
}