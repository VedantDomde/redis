import {sum} from "../utils";

describe('sum function', () => {
    test('add 1 + 2 to equal 3 ', () => {
        // Move the closing parenthesis right after sum(1, 2)
        expect(sum(1, 2)).toBe(3); 
    });
});
