// Constructs an action that the ai player could make
// @param pos [Number]: The cell position the ai would make its action in
const AIAction = (pos: number) => {
  // public: THe position on the board that hte action would put the letter on
  this.movePosition = pos;

  // public: the minimax value of the state that the action leads to when applied
  this.minimaxVal = 0;

  // public: applies the action to a state to get the next state
  // @param state [State]: the state to apply the action to
  // @return [State]: the next state
  this.applyTo = (state) => {
    const next = new State(state);

    // put the letter on the board
    next.board[this.movePosition] = state.turn;

    if (state.turn === 'O') {
      next.oMovesCount++;
    }

    next.advanceTurn();

    return next;
  };
};


// public static function that defines a rule for sorting AIActions in ascending manner
// @param firstAction [AIAction] : the first action in a pairwise sort
// @param secondAction [AIAction]: the second action in a pairwise sort
// @return [Number]: -1, 1, or 0
AIAction.ASCENDING = (firstAction: Object, secondAction: Object) => {
  if (firstAction.minimaxVal < secondAction.minimaxVal) {
    return -1; // indicates that firstAction goes before secondAction
  } else if (firstAction.minimaxVal > secondAction.minimaxVal) {
    return 1; // indicates that secondAction goes before firstAction
  }
  return 0; // indicates a tie
};

// public static function that defines a rule for sorting AIActions in descending manner
// @param firstAction [AIAction] : the first action in a pairwise sort
// @param secondAction [AIAction]: the second action in a pairwise sort
// @return [Number]: -1, 1, or 0
AIAction.DESCENDING = (firstAction, secondAction) => {
  if (firstAction.minimaxVal > secondAction.minimaxVal) {
    return -1; // indicates that firstAction goes before secondAction
  } else if (firstAction.minimaxVal < secondAction.minimaxVal) {
    return 1; // indicates that secondAction goes before firstAction
  }
  return 0; // indicates a tie
};


/*
* Constructs an AI player with a specific level of intelligence
* @param level [String]: the desired level of intelligence
*/
const AI = (level: string) => {
  // private attribute: level of intelligence the player has
  const levelOfIntelligence = level;

  // private attribute: the game the player is playing
  let game = {};

  /*
  * private recursive function that computes the minimax value of a game state
  * @param state [State] : the state to calculate its minimax value
  * @returns [Number]: the minimax value of the state
  */
  function minimaxValue(state) {
    if (state.isTerminal()) {
      // a terminal game state is the base case
      return Game.score(state);
    }
    let stateScore; // this stores the minimax value we'll compute

    if (state.turn === 'X') {
      // X wants to maximize --> initialize to a value smaller than any possible score
      stateScore = -1000;
    } else {
      // O wants to minimize --> initialize to a value larger than any possible score
      stateScore = 1000;
    }

    const availablePositions = state.emptyCells();

    // enumerate next available states using the info form available positions
    const availableNextStates = availablePositions.map((pos) => {
      const action = new AIAction(pos);

      const nextState = action.applyTo(state);

      return nextState;
    });

    /* calculate the minimax value for all available next states
    * and evaluate the current state's value */
    availableNextStates.forEach((nextState) => {
      const nextScore = minimaxValue(nextState);
      if (state.turn === 'X') {
        // X wants to maximize --> update stateScore iff nextScore is larger
        if (nextScore > stateScore) {
          stateScore = nextScore;
        }
      } else {
        // O wants to minimize --> update stateScore iff nextScore is smaller
        if (nextScore < stateScore) {
          stateScore = nextScore;
        }
      }
    });
    return stateScore;
  }

  /*
  * private function: make the ai player take a blind move
  * that is: choose the cell to place its symbol randomly
  * @param turn [String]: the player to play, either X or O
  */
  function takeABlindMove(turn) {
    const available = game.currentState.emptyCells();
    const randomCell = available[Math.floor(Math.random() * available.length)];
    const action = new AIAction(randomCell);

    const next = action.applyTo(game.currentState);

    ui.insertAt(randomCell, turn);

    game.advanceTo(next);
  }

  /*
  * private function: make the ai player take a novice move,
  * that is: mix between choosing the optimal and suboptimal minimax decisions
  * @param turn [String]: the player to play, either X or O
  */
  function takeANoviceMove(turn) {
    const available = game.currentState.emptyCells();

    // enumerate and calculate the score for each available actions to the ai player
    const availableActions = available.map((pos) => {
      const action = new AIAction(pos); // create the action object
      const nextState = action.applyTo(game.currentState); // get next state by applying the action

      action.minimaxVal = minimaxValue(nextState); // calculate and set the action's minimax value

      return action;
    });

    // sort the enumerated actions list by score
    if (turn === 'X') {
      // X maximizes --> sort the actions in a descending manner to have the action with maximum
      // minimax at first
      availableActions.sort(AIAction.DESCENDING);
    } else {
      // O minimizes --> sort the actions in an ascending manner to have the action with minimum
      // minimax at first
      availableActions.sort(AIAction.ASCENDING);
    }

    // take the optimal action 40% of the time, and take the 1st suboptimal action 60% of the time
    let chosenAction;
    if (Math.random() * 100 <= 40) {
      chosenAction = availableActions[0];
    } else {
      if (availableActions.length >= 2) {
        // if there is two or more available actions, choose the 1st suboptimal
        chosenAction = availableActions[1];
      } else {
        // choose the only available actions
        chosenAction = availableActions[0];
      }
    }
    const next = chosenAction.applyTo(game.currentState);

    ui.insertAt(chosenAction.movePosition, turn);

    game.advanceTo(next);
  }

  // private function: make the ai player take a master move,
  // that is: choose the optimal minimax decision
  // @param turn [String]: the player to play, either X or O
  function takeAMasterMove(turn) {
    const available = game.currentState.emptyCells();

    // enumerate and calculate the score for each avaialable actions to the ai player
    const availableActions = available.map((pos) => {
      const action = new AIAction(pos); // create the action object
      const next = action.applyTo(game.currentState); // get next state by applying the action

      action.minimaxVal = minimaxValue(next); // calculate and set the action's minmax value

      return action;
    });

    // sort the enumerated actions list by score
    if (turn === 'X') {
      // X maximizes --> sort the actions in a descending manner to have the action with maximum
      // minimax at first
      availableActions.sort(AIAction.DESCENDING);
    } else {
      // O minimizes --> sort the actions in an ascending manner to have the action with minimum
      // minimax at first
      availableActions.sort(AIAction.ASCENDING);
    }


    // take the first action as it's the optimal
    const chosenAction = availableActions[0];
    const next = chosenAction.applyTo(game.currentState);

    ui.insertAt(chosenAction.movePosition, turn);

    game.advanceTo(next);
  }


  // public method to specify the game the ai player will play
  // @param _game [Game] : the game the ai will play
  this.plays = (_game) => {
    game = _game;
  };

  /*
  * public function: notify the ai player that it's its turn
  * @param turn [String]: the player to play, either X or O
  */
  this.notify = (turn) => {
    switch (levelOfIntelligence) {
      // invoke the desired behavior based on the level chosen
      case 'blind': takeABlindMove(turn); break;
      case 'novice': takeANoviceMove(turn); break;
      case 'master': takeAMasterMove(turn); break;
      default: throw Error(`${levelOfIntelligence} invalid value for Level of Intelligence`);
    }
  };
};
