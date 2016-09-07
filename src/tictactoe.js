// Global variables
var gameInProgress = false;
// userToken represents whether the user has chosen X or O.
var userToken = "";
var cpuToken = "";
var boardArray = [[NaN, NaN, NaN], [NaN, NaN, NaN], [NaN, NaN, NaN]];
// 0 if CPU's turn, 1 if player's turn
var turn = 0

$(window).load(function() {
  $('#tokenSelection').modal('show');
  $('#chooseO').on('click', function() {setToken('O')});
  $('#chooseX').on('click', function() {setToken('X')});
  $(".cell").on('click', placeToken);
});

// This function sets whether the user will place x's or o's
function setToken(token) {
  userToken = token;
  token === 'X' ? cpuToken = 'O' : cpuToken = 'X';
  switch (token) {
    case 'X':
    cpuToken = 'O';
    break;
    case 'O':
    cpuToken = 'X';
    break;
    default:
    throw new Error("token must be x or o");
  }
}

// This function places a token onto the board and checks whether the game ended
// It simulates a full turn of the game
function placeToken() {
  if (userToken === 'X' || userToken === 'O') {
    var coordinates = this.id;
    var x = parseInt(coordinates.charAt(0));
    var y = parseInt(coordinates.charAt(1));
    if (placeAtCoordinates(x, y, boardArray, userToken)) {
      if (!checkWinner("You")) {
        cpuPlaceToken();
        checkWinner("CPU")
      }
    }
  } else {
    throw new Error("token must be x or o");
  }
}

// Places a token at the specified coordinates
// Returns true if the token was placed, false if space was already taken and token could not
// be placed
function placeAtCoordinates(x, y, array, token) {
  if (array[x][y] === 'X' || array[x][y] === 'O') {
    return false;
  } else {
    // place token on array board
    array[x][y] = token;
    // place token on DOM board
    var id = "" + x + y;
    document.getElementById(id).textContent = token;
    return true;
  }
}

// Places a token on behalf of the cpu
function cpuPlaceToken() {
  var x = random(boardArray.length);
  var y = random(boardArray.length);
  while (!placeAtCoordinates(x, y, boardArray, cpuToken)) {
    x = random(boardArray.length);
    y = random(boardArray.length);
  }
}

// Returns an integer between 0 and max
function random(max) {
  return Math.floor(Math.random() * max);
}

// Checks whether the game has ended. Alerts whether a player has won and clears the boardArray
// If game has not ended, nothing is done
// Doesn't need to check which player won because only the player who made the last move can win
function checkWinner(player) {
  if (checkDiagonals(boardArray) || checkRows(boardArray)) {
    alert(player + " won");
    clearBoard();
    return true;
  } else {
    var transposed = transpose(boardArray);
    if (checkRows(transposed)) {
      alert(player + " won");
      clearBoard();
      return true;
    } else if (boardFull(boardArray)) {
      alert("Tie");
      clearBoard();
      return true;
    } else {
      return false;
    }
  }
}

// Returns whether the diagonal from the top left to bottom right contains a three-in-a-row
function checkDiagonals(array) {
  if (array[0][2] === array[1][1] && array[1][1] === array[2][0]) {
    return true;
  } else if (array[0][0] === array[1][1] && array[1][1] === array[2][2]) {
    return true;
  }
  return false;
}

// Returns whether any of the rows of boardArray contains a three-in-a-row
function checkRows(array) {
  for (var i = 0; i < array.length; i++) {
    var currentRow = array[i];
    if (currentRow[0] === currentRow[1] && currentRow[1] === currentRow[2]) {
      return true;
    }
  }
  return false;
}

// Transposes boardArray to make the rows into columns
function transpose(array) {
  return array[0].map(function(col, i) {
    return array.map(function(row) {
      return row[i]
    })
  });
}

// Returns whether every square in the board is full
function boardFull(array) {
  for (var i = 0; i < array.length; i++) {
    for (var j = 0; j < array.length; j++) {
      if (array[i][j] !== 'X' && array[i][j] !== 'O') {
        return false;
      }
    }
  }
  return true;
}

// Clears all tokens and resets the boardArray
function clearBoard() {
  // clear boardArray
  for(var i = 0; i < boardArray.length; i++) {
    for (var j = 0; j < boardArray[i].length; j++) {
      boardArray[i][j] = NaN;
    }
  }
  // clear DOM board
  var cells = document.getElementsByClassName("cell");
  for (var i = 0; i < cells.length; i++) {
    cells[i].textContent = ""
  }
}
