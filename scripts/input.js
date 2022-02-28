'use strict';

import { finishClick, toggleButton, renderHistory } from './display.js';
import { addThousandsSeparator, removeThousandsSeparator, removeUnnecessaryDigits, chooseMathematicFunction, showResult} from './helper.js';

let firstNumbers = [], // Store the entered numbers before the user enter an arithmetic operator.
secondNumbers = [], // Store the entered numbers after the user enter an arithmetic operator.
operators = [], // Store the entered operators.
historyList = [], // Store the completed calculations.
isEnteringNumber = true, // Detect the clicked button.
isCalculatingResult = false; // Check if the user is clicking the equals button.

const enterNumber = e => {
  const inputDisplay = $('#display').text(),
  digitLength = inputDisplay.replace(/\D/g, '').length,
  isLessThanAbsoluteOne = /^-*0\./.test(inputDisplay),
  clickTarget = e.target.textContent;

  if (!/\d/.test(inputDisplay) || isCalculatingResult) {
    reset();
    $('#display').text(() => clickTarget);
  } else {
    isEnteringNumber
      ? digitLength <= 16 && isLessThanAbsoluteOne || digitLength <= 15 && !isLessThanAbsoluteOne
        ? inputDisplay === '0'
          ? $('#display').text(() => clickTarget)
          : $('#display').text(() => addThousandsSeparator(`${inputDisplay}${clickTarget}`))
        : inputDisplay
      : $('#display').text(() => clickTarget);
  }

  isEnteringNumber = true;
  isCalculatingResult = false;

  toggleButton();
  finishClick(e);
}; // Enter the number other than zero.

const enterZero = e => {
  const inputDisplay = $('#display').text(),
  digitLength = inputDisplay.replace(/\D/g, '').length,
  isLessThanAbsoluteOne = /^-*0\./.test(inputDisplay);

  if (!/\d/.test(inputDisplay) || isCalculatingResult) {
    reset();
    $('#display').text('0');
  } else {
    isEnteringNumber
      ? inputDisplay === '0' || digitLength > 16 && isLessThanAbsoluteOne || digitLength > 15 && !isLessThanAbsoluteOne
        ? inputDisplay
        : $('#display').text(() => addThousandsSeparator(`${inputDisplay}0`))
      : $('#display').text(() => '0');
  }

  isEnteringNumber = true;
  isCalculatingResult = false;

  toggleButton();
  finishClick(e);
}; // Enter zero.

const enterDecimalPoint = e => {
  const inputDisplay = $('#display').text();

  if (!/\d/.test(inputDisplay) || isCalculatingResult) {
    reset();
    $('#display').text('0.');
  } else {
    isEnteringNumber
      ? /\./.test(inputDisplay)
        ? inputDisplay
        : $('#display').text(() => `${inputDisplay}.`)
      : $('#display').text(() => '0.');
  }

  isEnteringNumber = true;
  isCalculatingResult = false;

  finishClick(e);
}; // Enter the decimal point.

const enterArithmeticOperator = e => {
  const correctedInput = removeThousandsSeparator($('#display').text()),
  clickTarget = e.target.textContent,
  firstLength = firstNumbers.length,
  secondLength = secondNumbers.length;

  if (firstLength === secondLength || !isEnteringNumber) {
    firstNumbers.push(Number(correctedInput));
    operators.push(clickTarget);
    $('#equation').text(() => `${correctedInput} ${clickTarget}`);
    $('#display').text(() => addThousandsSeparator(correctedInput));
  } else if (firstLength > secondLength && isEnteringNumber) {
    secondNumbers.push(Number(correctedInput));
    operators.push(clickTarget);
    toggleButton(showResult(operators[operators.length - 2], firstNumbers[firstNumbers.length - 1], secondNumbers[secondNumbers.length - 1], clickTarget, firstNumbers, historyList));
    if (/\d/.test($('#display').text())) { renderHistory(historyList[historyList.length - 1]); }
  }

  isEnteringNumber = false;
  isCalculatingResult = false;

  finishClick(e);
}; // Determine the first number, the second number, and the arithmetic operation based on the input.

const negateNumber = e => {
  const equation = $('#equation').text(),
  inputDisplay = $('#display').text();

  inputDisplay === '0'
    ? inputDisplay
    : /-/.test(inputDisplay)
      ? $('#display').text(() => inputDisplay.replace('-', ''))
      : $('#display').text(() => `-${inputDisplay}`);

  if (isCalculatingResult || /^negate/.test(equation)) {
    firstNumbers.push(Number(removeThousandsSeparator($('#display').text())));
    secondNumbers.push(secondNumbers[secondNumbers.length - 1]);
    $('#equation').text(() => `negate(${inputDisplay})`);
  } else if (equation) {
    /negate/.test(equation)
      ? $('#equation').text(() => `${equation.slice(0, equation.lastIndexOf(' '))} negate(${inputDisplay})`)
      : $('#equation').text(() => `${equation} negate(${inputDisplay})`);
  }

  isEnteringNumber = true;
  isCalculatingResult = false;

  finishClick(e);
}; // Negate the number.

const rootNumber = e => {
  const result = chooseMathematicFunction('root');
  isEnteringNumber = true;
  isCalculatingResult = false;
  showFunctionResult(result);
  finishClick(e);
}; // Calculate the square root of the number.

const squareNumber = e => {
  const result = chooseMathematicFunction('square');
  isEnteringNumber = true;
  isCalculatingResult = false;
  showFunctionResult(result);
  finishClick(e);
}; // Calculate the squared number.

const oneNth = e => {
  const inputDisplay = $('#display').text(),
  result = chooseMathematicFunction('one');
  
  if (inputDisplay === '0' || inputDisplay === '0.') {
    $('#display').text('Cannot divide by zero');
    toggleButton(true);
  } else {
    showFunctionResult(result);
  }

  isEnteringNumber = true;
  isCalculatingResult = false;

  finishClick(e);
}; // Calculate the one nth.

const percentNumber = e => {
  const result = chooseMathematicFunction('', firstNumbers);
  isEnteringNumber = true;
  isCalculatingResult = false;
  showFunctionResult(result);
  finishClick(e);
}; // Calculate the percentage of the given number.

const calculateResult = e => {
  const inputDisplay = $('#display').text(),
  correctedNumber = removeUnnecessaryDigits(inputDisplay),
  pureNumber = removeThousandsSeparator(correctedNumber),
  firstLength = firstNumbers.length,
  secondLength = secondNumbers.length;

  if (!/\d/.test(inputDisplay)) {
    clearAll(e);
  } else {
    if (!firstLength) {
      $('#equation').text(() => `${pureNumber} =`);
      $('#display').text(() => correctedNumber);
      historyList.push(`${pureNumber} =<br><span>${correctedNumber}</span>`);
    } else {
      if (firstLength > secondLength || !isEnteringNumber) { secondNumbers.push(Number(pureNumber)) };
      toggleButton(showResult(operators[operators.length - 1], firstNumbers[firstNumbers.length - 1], secondNumbers[secondNumbers.length - 1], '=', firstNumbers, historyList, true));
      secondNumbers.push(secondNumbers[secondNumbers.length - 1]);
    }
    if (/\d/.test($('#display').text())) { renderHistory(historyList[historyList.length - 1]); }
  }

  isEnteringNumber = true;
  isCalculatingResult = true;

  finishClick(e);
}; // Calculate the result.

const showFunctionResult = (result = 0) => {
  $('#display').text(() => addThousandsSeparator(String(result)));
  historyList.push(`${$('#equation').text()}<br><span>${result}</span>`);
  renderHistory(historyList[historyList.length - 1]);
}; // Show the result of the mathematic function.

const backSpace = e => {
  const inputDisplay = $('#display').text(),
  inputLength = inputDisplay.length;

  if (!/\d/.test(inputDisplay)) {
    clearAll(e);
  } else if (isCalculatingResult) {
    $('#equation').text('');
  } else if (isEnteringNumber) {
    inputLength > 1
      ? $('#display').text(() => addThousandsSeparator(inputDisplay.slice(0, inputLength - 1)))
      : $('#display').text('0');
  }

  finishClick(e);
}; // Delete the last entered number.

const clearAll = e => {
  $('#display').text('0');
  reset();
  finishClick(e);
}; // Reset all.

const clearNumber = e => {
  if (!/\d/.test($('#display').text())) {
    clearAll(e);
  } else if (isCalculatingResult) {
    $('#equation').text('');
    firstNumbers.push(0);
    secondNumbers.push(secondNumbers[secondNumbers.length - 1]);
  }
  
  $('#display').text('0');
  finishClick(e);
}; // Reset the display bar.

const reset = () => {
  firstNumbers = [];
  secondNumbers = [];
  operators = [];
  toggleButton();
  $('#equation').text('');
}; // Reset the equation bar and empty the storage when the result is not a number.

const clearHistory = e => {
  historyList = [];
  $('li').remove();
  $('ul').append('<li class="m-3 m-md-0 mt-md-3" id="initial-history">There\'s no history yet</li>');
  $('ul ~ form').css('visibility', 'hidden');
  finishClick(e);
}; // Clear all calculation history.

export { enterNumber, enterDecimalPoint, enterZero, enterArithmeticOperator, negateNumber, rootNumber, squareNumber, oneNth, percentNumber, calculateResult, backSpace, clearAll, clearNumber, clearHistory };