'use strict';

const addThousandsSeparator = (input = '') => {  
  const isDecimal = /\./.test(input), // Check if the number is integer or decimal.
  indexOfDot = input.indexOf('.'), // Find the index of the decimal point.
  inputInteger = isDecimal
    ? input.slice(0, indexOfDot)
    : input, // Separate the numbers before the decimal point and store them as an integer.
  inputNumber = inputInteger.replace(/\D/g, ''), // Remove all the non-digit characters from the integer.
  absoluteNumber = inputNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ","), // Replace the matched characters with commas as the thousands separator.
  inputDisplay = /-/.test(input)
    ? `-${absoluteNumber}`
    : absoluteNumber; // Check if the number is positive or negative.

  /* 
   * The regex matches the character when
   * the previous and the next one are of the same type,
   * is followed by three digits one or more times,
   * and is not followed by another number.
   */

  return isDecimal
    ? `${inputDisplay}${input.slice(indexOfDot)}`
    : inputDisplay; // Concatenate the numbers after the decimal point to the returned number if the input number is decimal.
}; // Add the thousands separator to the number.

const removeThousandsSeparator = (input = '') => removeUnnecessaryDigits(input).replace(/,/g, ''); // Remove the thousands separator.

const removeUnnecessaryDigits = (input = '') => /\./.test(input) ? input.replace(/\.*0*$/, '') : input; // Remove the unnecessary digits.

const toScientificNotation = (input = '') => {
  const correctedNumber = removeUnnecessaryDigits(input), // Remove the unnecessary digits from the input.
  numberLength = correctedNumber.replace('-', '').length, // Find the length of the digit.
  bigNumber = Number(correctedNumber) / Math.pow(10, 16), // Change the input format to x times ten to the fifteenth power.
  modifiedNumber = `${Number.isInteger(bigNumber) ? `${bigNumber}.` : bigNumber}e+${numberLength - 1}`; // Change the display of the input.

  return numberLength > 16 && Number.isInteger(Number(input))
    ? modifiedNumber
    : correctedNumber; // Change to scientific notation if the input is more than ten to the fifteenth power.
}; // Change the number to scientific notation.

const fixDigitLength = (input = 0) => {
  const absoluteNumber = Math.abs(input), // Store the absolute value of the input.
  stringNumber = String(absoluteNumber); // Change the type of the input to a string.

  return Number.isInteger(input)
    ? input
    : absoluteNumber > 1
      ? Number(input.toFixed(16 - stringNumber.slice(0, stringNumber.indexOf('.')).length))
      : Number(input.toFixed(16)); // Change the input if the input is a decimal number.
}; // Fix the maximum digit length after the decimal point.

const chooseArithmeticOperation = (operation = '', first = 0, second = 0) => {
  let result; // Store the result.

  switch (operation) {
    case '+':
      result = addNumber(first, second);
      break;
    case '-':
      result = subtractNumber(first, second);
      break;
    case 'x':
      result = timesNumber(first, second);
      break;
    default:
      result = divideNumber(first, second);
      break;
  } // Choose the operation to perform based on the operation parameter.

  return fixDigitLength(result); // Fix the maximum digit length after the decimal point.
}; // Choose an arithmetic operation and calculate the result.

const chooseMathematicFunction = (func = '', storage = []) => {
  const equation = $('#equation').text(), // Store the content of the equation bar.
  indexOfSpace = equation.indexOf(' '), // Find the index of whitespace.
  inputDisplay = $('#display').text(), // Store the content of the display bar.
  correctedInput = removeThousandsSeparator(inputDisplay); // Remove the thousands separator.

  let result, // Store the result.
  display, // Store the content to show.
  enclosure = []; // Store the additional content to show.

  switch (func) {
    case 'root':
      result = fixDigitLength(Math.sqrt(Number(correctedInput)));
      display = inputDisplay;
      enclosure.push('√(', ')');
      break;
    case 'square':
      result = fixDigitLength(Math.pow(Number(correctedInput), 2));
      display = inputDisplay;
      enclosure.push('sqr(', ')');
      break;
    case 'one':
      result = fixDigitLength(1 / Number(correctedInput));
      display = inputDisplay;
      enclosure.push('1/(', ')');
      break;
    default:
      result = storage.length > 0 ? fixDigitLength(storage[storage.length - 1] * Number(correctedInput) / 100) : 0;
      display = result;
      enclosure.push('', '');
      break;
  } // Choose the function to perform based on the func parameter.

  equation
    ? $('#equation').text(() => `${indexOfSpace > -1 ? `${equation.slice(0, indexOfSpace + 2)} ` : ''}${enclosure[0]}${display}${enclosure[1]}`)
    : $('#equation').text(() => `${enclosure[0]}${display}${enclosure[1]}`); // Show the content to the display.

  return result;
}; // Choose a mathematic function and calculate the result.

const showResult = (operator = '', first = 0, second = 0, target = '', storage = [], list = [], condition = false) => {
  const result = chooseArithmeticOperation(operator, first, second), // Calculate the result.
  stringFirst = String(first), // Change the type of the first parameter to a string.
  stringResult = String(result); // Change the type of the result to a string.

  if (!/\d/.test(result)) {
    $('#equation').text(() => `${toScientificNotation(stringFirst)} ${operator} ${second} ${target}`);
    first === 0 ? $('#display').text('Result is undefined') : $('#display').text('Cannot divide by zero');
    return true; // Pass the condition to the toggleButton event.
  } // Show the message when the result is not a number.

  condition // Check if the user is clicking the equals button.
    ? $('#equation').text(() => `${toScientificNotation(stringFirst)} ${operator} ${second} ${target}`)
    : $('#equation').text(() => `${toScientificNotation(stringResult)} ${target}`); // Change the content to insert into the equation bar based on the clicked button.

  $('#display').text(() => addThousandsSeparator(toScientificNotation(stringResult))); // Show the result to the display bar.
  storage.push(result); // Store the result.
  list.push(`${toScientificNotation(stringFirst)} ${operator} ${second} =<br><span>${$('#display').text()}<span>`); // Store the equation.

  return false; // Pass the condition to the toggleButton event.
}; // Change the result to display.

const addNumber = (first = 0, second = 0) => + first + second; // Add the number.

const subtractNumber = (first = 0, second = 0) => first - second; // Subtract the number.

const timesNumber = (first = 0, second = 1) => first * second; // Times the number.

const divideNumber = (first = 0, second = 1) => first / second; // Divide the number.

export { addThousandsSeparator, removeThousandsSeparator, removeUnnecessaryDigits, chooseMathematicFunction, showResult };