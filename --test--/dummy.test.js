import {sum,sub,multiply} from "../utils";

describe('sum function', () => {
    test('add 1 + 2 to equal 3 ', () => {
        // Move the closing parenthesis right after sum(1, 2)
        expect(sum(1, 2)).toBe(3); 
    });
});

describe('sub function',() => {
    test('sub 5 - 2 to equal 3', () => {
        expect(sub(5,2)).toBe(3);
    });
});

describe('multiply function',() => {
    test('multiply 2 * 3 to equal 6', () => {
        expect(multiply(2,3)).toBe(6);
    });
});