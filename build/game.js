'use strict';

// const ui = require('../build/ui.js').ui;
var numberOfSquares = 9;

// Represents a state in the game
// @param old [State]: Old state to initialize the new state
function State(old) {
  var _this = this;

  // eslint-disable-line
  // public: the player whose turn it is
  this.turn = '';

  // public: The number of moves of the AI player
  this.turn = '';

  // public: the number of moves the AI player has made
  this.oMovesCount = 0;

  // public: the result of the game in this state
  this.result = 'still running';

  // public: the board configuration in this state
  this.board = [];

  // Begin Object Construction
  if (typeof old !== 'undefined') {
    // if the state is constructed using a copy of another state
    var len = old.board.length;
    this.board = new Array(len);
    for (var i = 0; i < len; i++) {
      this.board[i] = old.board[i];
    }

    this.oMovesCount = old.oMovesCount;
    this.result = old.result;
    this.turn = old.turn;
  }
  // End Object Construction

  // Public: advances the turn in the state
  this.advanceTurn = function () {
    _this.turn = _this.turn === 'X' ? 'O' : 'X';
  };

  // public function that enumberates the empty cells in state
  // @return [Array] indices of all empty cells"
  this.emptyCells = function () {
    var indexes = [];
    for (var _i = 0; _i < numberOfSquares; _i++) {
      if (_this.board[_i] === 'E') {
        indexes.push(_i);
      }
    }
    return indexes;
  };

  // public function that checks if the state is a terminal state or not
  // The state result is updated to reflect the result of the game
  // @returns [Boolean]: True if it's terminal, false otherwise
  this.isTerminal = function () {
    var B = _this.board;

    // check rows
    for (var _i2 = 0; _i2 <= 6; _i2 += 3) {
      if (B[_i2] !== 'E' && B[_i2] === B[_i2 + 1] && B[_i2 + 1] === B[_i2 + 2]) {
        _this.result = B[_i2] + '-won';
        return true;
      }
    }

    // check columns
    for (var _i3 = 0; _i3 <= 2; _i3++) {
      if (B[_i3] !== 'E' && B[_i3] === B[_i3 + 3] && B[_i3 + 3] === B[_i3 + 6]) {
        _this.result = B[_i3] + '-won'; // update the state result
        return true;
      }
    }

    // check diagonals
    for (var _i4 = 0, j = 4; _i4 <= 2; _i4 = _i4 + 2, j = j - 2) {
      if (B[_i4] !== 'E' && B[_i4] === B[_i4 + j] && B[_i4 + j] === B[_i4 + 2 * j]) {
        _this.result = B[_i4] + '-won'; // update the state result
        return true;
      }
    }

    var available = _this.emptyCells();
    if (available.length === 0) {
      // the game is draw
      _this.result = 'draw'; // update the state result
      return true;
    }
    return false;
  };
}

// Constructs a game object to be played
// @param autoPlayer [AIPlayer]: The ai player for the game
function Game(autoPlayer) {
  var _this2 = this;

  // eslint-disable-line
  // public: initialize the ai player for this game
  this.ai = autoPlayer;

  // public: initialize an empty board state
  this.currentState = new State();

  // 'E' stands for an empty board cell
  this.currentState.board = ['E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];

  this.currentState.turn = 'X'; // X playes first

  // Sets game status to beginning
  this.status = 'beginning';

  // Public function that advances the game to a new state
  // @param _state [State]: The new state to advance the game to
  this.advanceTo = function (_state) {
    // eslint-disable-line
    this.currentState = _state;
    if (_state.isTerminal()) {
      this.status = 'ended';

      if (_state.result === 'X-won') {
        ui.switchViewTo('won');
      } else if (_state.result === 'O-won') {
        ui.switchViewTo('lost');
      } else {
        ui.switchViewTo('draw');
      }
    } else {
      // The games is in progress
      if (this.currentState.turn === 'X') {
        ui.switchViewTo('human');
      } else {
        ui.switchViewTo('robot');

        // Notify the AI that it is its turn
        this.ai.notify('O');
      }
    }
  };

  // Start the game
  this.start = function () {
    if (_this2.status === 'beginning') {
      // call advanceTo with initial state
      _this2.advanceTo(_this2.currentState);
      _this2.status = 'running';
    }
  };
}

Game.score = function (_state) {
  // eslint-disable-line
  if (_state.result === 'X-won') {
    // The x player won
    return 10 - _state.oMovesCount;
  } else if (_state.result === 'O-won') {
    // the x player list-group-item-state
    return -10 + _state.oMovesCount;
  }
  // it's a draw
  return 0;
};