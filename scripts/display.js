'use strict';

const finishClick = e => {
  e.preventDefault();
  e.target.blur();
}; // Prevent the page from refreshing and blurring the button after the user clicks the button.

const toggleButton = (condition = false) => {
  /*
   * These buttons will be disabled when the result is not a number.
   * When the user clicks the other available buttons, they are enabled.
   */

  $('div:not(:first-child) > button.color-cool-gray').prop('disabled', condition);
  $('#percent').prop('disabled', condition);
  $('#negate').prop('disabled', condition);
  $('#decimal').prop('disabled', condition);
}; // Toggle accessibility of the selected buttons based on the calculation result.

const renderHistory = (item = '') => {
  $('#initial-history').remove();
  $('ul').prepend(`<li class="m-3">${item}</li>`);
  $('ul ~ form').css('visibility', 'visible');
}; // Render the calculation history to the history section.

const toggleHistory = e => {
  /*
   * The history section's state will toggle between hiding and showing.
   * When in a hiding state, the history section is invisible.
   * The history section will be available to view when the visibility toggle to showing state.
   */

  e.preventDefault();
  $('main > div:last-child').toggle(display);
  $('#history').blur();
}; // Toggle visibility of the history when the user clicks the button.

const toggleDisplay = () => {
  /*
   * When the window orientation is landscape, the display value is flex.
   * Its value will be none at the start and will toggle between flex and none according to the toggleHistory event when the window orientation is portrait.
   */

  const history = $('main > div:last-child');
  $(window).width() < $(window).height() ? history.css('display', 'none') : history.css('display', 'flex');
}; // Change the display of the history when the user resizes the window.

export { finishClick, toggleButton, renderHistory, toggleHistory, toggleDisplay };