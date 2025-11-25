// j'ai rien compris juste le pdf du TP mais la doc aide bien https://jestjs.io/docs/getting-started
const {checkUserInput} = require('./checkInput');

describe('Test to see see if username is valid', () =>{
    test('Username is empty', () => {
        expect(checkUserInput.isValidUsername("")).toBe(false);
    });
    test('Username with less then 6 char is invalid', () => {
        expect(checkUserInput.isValidUsername("abc")).toBe(false);
    });
    test('Username with at least 6 char is valid', () => {
        expect(checkUserInput.isValidUsername("abcdef")).toBe(true);
    });
});
describe('Test to see see if password is valid', () =>{
    test('Password is empty', () => {
        expect(checkUserInput.isValidPassword("")).toBe(false);
    });
    test('Password with less then 8 char is invalid', () => {
        expect(checkUserInput.isValidPassword("abcef")).toBe(false);
    });
    test('Password with at least 8 char is valid', () => {
        expect(checkUserInput.isValidPassword("abcdefgh")).toBe(true);
    });
});
describe('Test to see see if email is valid', () =>{
    test('Email is empty', () => {
        expect(checkUserInput.isValidPassword("")).toBe(false);
    });
    test('Email without domain is invalid', () => {
        expect(checkUserInput.isValidPassword("jean@")).toBe(false);
    });
    test('Valid email must contain an @ and a domain', () => {
        expect(checkUserInput.isValidPassword("abcdefg@gmail.com")).toBe(true);
    });
});