const $ = require('../js/jquery.min').$;

// ui object encloses all UI related methods and attributes
const ui = {};

// holds the state of the intial controls visibility
ui.intialControlsVisible = true;

// holds the setInterval handle for the robot flickering
ui.robotFlickeringHandle = 0;

// holds the current visible view
ui.currentView = '';

// starts the flickering effect of the robot image
ui.startRobotFlickering = () => {
  ui.robotFlickeringHandle = setInterval(() => {
    $('#robot').toggleClass('robot');
  }, 500);
};

/*
* stops the flickering effect on the robot image
*/
ui.stopRobotFlickering = () => {
  clearInterval(ui.robotFlickeringHandle);
};

/*
* switchs the view on the UI depending on who's turn it switchs
* @param turn [String]: the player to switch the view to
*/
ui.switchViewTo = (turn) => {
  // helper function for async calling
  function _switch(_turn) { // eslint-disable-line
    ui.currentView = `#${_turn}`;
    $(ui.currentView).fadeIn('fast');

    if (_turn === 'ai') {
      ui.startRobotFlickering();
    }
  }

  if (ui.intialControlsVisible) {
    // if the game is just starting
    ui.intialControlsVisible = false;

    $('.intial').fadeOut({
      duration: 'slow',
      done: () => {
        _switch(turn);
      },
    });
  } else {
    // if the game is in an intermediate state
    $(ui.currentView).fadeOut({
      duration: 'fast',
      done: () => {
        _switch(turn);
      },
    });
  }
};

/*
* places X or O in the specifed place in the board
* @param i [Number] : row number (0-indexed)
* @param j [Number] : column number (0-indexed)
* @param symbol [String]: X or O
*/
ui.insertAt = (indx, symbol) => {
  const board = $('.cell');
  const targetCell = $(board[indx]);

  if (!targetCell.hasClass('occupied')) {
    targetCell.html(symbol);
    targetCell.css({
      color: symbol === 'X' ? 'green' : 'red',
    });
    targetCell.addClass('occupied');
  }
};
