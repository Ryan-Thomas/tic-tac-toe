// @flow

// const ui = require('../build/ui.js').ui;
const numberOfSquares = 9;

// Represents a state in the game
// @param old [State]: Old state to initialize the new state
function State(old: any) { // eslint-disable-line
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
    const len = old.board.length;
    this.board = new Array(len);
    for (let i = 0; i < len; i++) {
      this.board[i] = old.board[i];
    }

    this.oMovesCount = old.oMovesCount;
    this.result = old.result;
    this.turn = old.turn;
  }
  // End Object Construction

  // Public: advances the turn in the state
  this.advanceTurn = () => {
    this.turn = this.turn === 'X' ? 'O' : 'X';
  };

  // public function that enumberates the empty cells in state
  // @return [Array] indices of all empty cells"
  this.emptyCells = (): Array<number> => {
    const indexes = [];
    for (let i = 0; i < numberOfSquares; i++) {
      if (this.board[i] === 'E') {
        indexes.push(i);
      }
    }
    return indexes;
  };

  // public function that checks if the state is a terminal state or not
  // The state result is updated to reflect the result of the game
  // @returns [Boolean]: True if it's terminal, false otherwise
  this.isTerminal = (): boolean => {
    const B = this.board;

    // check rows
    for (let i = 0; i <= 6; i += 3) {
      if (B[i] !== 'E' && B[i] === B[i + 1] && B[i + 1] === B[i + 2]) {
        this.result = `${B[i]}-won`;
        return true;
      }
    }

    // check columns
    for (let i = 0; i <= 2; i++) {
      if (B[i] !== 'E' && B[i] === B[i + 3] && B[i + 3] === B[i + 6]) {
        this.result = `${B[i]}-won`; // update the state result
        return true;
      }
    }

    // check diagonals
    for (let i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
      if (B[i] !== 'E' && B[i] === B[i + j] && B[i + j] === B[i + 2 * j]) {
        this.result = `${B[i]}-won`; // update the state result
        return true;
      }
    }

    const available = this.emptyCells();
    if (available.length === 0) {
      // the game is draw
      this.result = 'draw'; // update the state result
      return true;
    }
    return false;
  };
}

// Constructs a game object to be played
// @param autoPlayer [AIPlayer]: The ai player for the game
function Game(autoPlayer: any) { // eslint-disable-line
  // public: initialize the ai player for this game
  this.ai = autoPlayer;

  // public: initialize an empty board state
  this.currentState = new State();

  // 'E' stands for an empty board cell
  this.currentState.board = ['E', 'E', 'E',
                             'E', 'E', 'E',
                             'E', 'E', 'E'];

  this.currentState.turn = 'X'; // X playes first

  // Sets game status to beginning
  this.status = 'beginning';

  // Public function that advances the game to a new state
  // @param _state [State]: The new state to advance the game to
  this.advanceTo = function(_state) { // eslint-disable-line
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
  this.start = () => {
    if (this.status === 'beginning') {
      // call advanceTo with initial state
      this.advanceTo(this.currentState);
      this.status = 'running';
    }
  };
}

Game.score = function(_state) { // eslint-disable-line
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
