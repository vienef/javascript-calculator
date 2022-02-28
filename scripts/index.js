'use strict';

import { toggleHistory, toggleDisplay } from './display.js';
import { enterNumber, enterDecimalPoint, enterZero, enterArithmeticOperator, negateNumber, rootNumber, squareNumber, oneNth, percentNumber, calculateResult, backSpace, clearAll, clearNumber, clearHistory } from './input.js';

const main = () => {
  $(window).on('resize', toggleDisplay);
  $('#history').on('click', toggleHistory);
  $('#clear-history').on('click', clearHistory);
  $('#decimal').on('click', enterDecimalPoint);
  $('#zero').on('click', enterZero);
  $('#negate').on('click', negateNumber);
  $('div:not(:last-child) > button.color-forest-green').on('click', enterNumber);
  $('div:not(:first-child) > button:last-child.color-cool-gray').on('click', enterArithmeticOperator);
  $('#square-root').on('click', rootNumber);
  $('#square').on('click', squareNumber);
  $('#fraction').on('click', oneNth);
  $('#percent').on('click', percentNumber);
  $('#equals').on('click', calculateResult);
  $('#backspace').on('click', backSpace);
  $('#clear').on('click', clearAll);
  $('#clear-number').on('click', clearNumber);
};

$(document).ready(main);