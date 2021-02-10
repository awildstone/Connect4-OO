/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */
 class Game {
   constructor(height, width, player1, player2) {
     this.height = height;
     this.width = width;
     this.players = [player1, player2];
     this.currPlayer = player1;
     this.board = [];
     this.gameInPlay = true;
     this.makeBoard();
     this.makeHtmlBoard();
   }
   /* makeBoard: create in-JS board structure: board = array of rows, 
   each row is array of cells  (board[y][x]) */
  makeBoard() {
    for (let y = 0; y < this.height; y++) {
      this.board.push(Array.from({ length: this.width }));
    }
  }
  /* makeBoard: create in-JS board structure:
  board = array of rows, each row is array of cells  (board[y][x]) */
  makeHtmlBoard() {
    const htmlBoard = document.getElementById('board');
  
    // Create the top row of our board which will act as the game controller for the players. Top row contains a control-row id and a click event listener.
    const controlRow = document.createElement('tr');
    controlRow.setAttribute('id', 'control-row');
    controlRow.addEventListener('click', this.handleClick.bind(this));
  
    for (let x = 0; x < this.width; x++) {
      const controlCell = document.createElement('td');
      controlCell.setAttribute('id', x);
      controlRow.append(controlCell);
    }
    htmlBoard.append(controlRow);
  
    // make main part of board
    for (let y = 0; y < this.height; y++) {
      const gameRow = document.createElement('tr');
      for (let x = 0; x < this.width; x++) {
        const gameCell = document.createElement('td');
        gameCell.setAttribute('id', `${y}-${x}`);
        gameRow.append(gameCell);
      }
      htmlBoard.append(gameRow);
    }
  }
  /** findSpotForCol: given column x, return top empty y (null if filled) */
  findSpotForCol(x) {
     // Starting at the bottom of our memory board, find the first location that returns null (falsey).
    for (let y = this.height - 1; y >= 0; y--) {
      if (!this.board[y][x]) {
        return y;
      }
    }
    // if all cells are played, change the control cell bg color  
    this.allPlayed(x);
    return null;
  }
  /* Changes the color of the player control for the provided control row if all cells have been played */
  allPlayed(x) {
    const xCol = document.getElementById(`${x}`);
    xCol.style.background = '#333333';
  }
  /* placeInTable: update DOM to place piece into HTML table of board */
  placeInTable(y, x) {
    const piece = document.createElement('div');
    piece.setAttribute('class', `piece ${this.currPlayer.name}`);
    piece.style.backgroundColor = `${this.currPlayer.color}`;
    // piece.style.top = -50 * (y + 2);
    const spot = document.getElementById(`${y}-${x}`);
    spot.append(piece);
  }
  /** endGame: announce game end */
  endGame(msg) {
    this.gameInPlay = false;
    setTimeout(function() {alert(msg);}, 350);
    // update score if not a draw
    if (msg !== 'Player1 and Player2 tie!') {
      updateScore(this.currPlayer);
    }
    updatePlayButton();
    updatePlayerColorSelector();
  }
  /* handleClick: handle click of column top to play piece */
  handleClick(evt) {
    // get x from ID of clicked cell
    const x = +evt.target.id;

    //if the game is over prevent further play
    if (!this.gameInPlay) return;

    // get next spot in column (if none, ignore click)
    const y = this.findSpotForCol(x);
    if (y === null) {
      return;
    }
    // place piece in board and add to HTML table
    this.board[y][x] = this.currPlayer;
    this.placeInTable(y, x);

     // check for tie
     if (this.board.every(row => row.every(cell => cell))) {
      return this.endGame('Player1 and Player2 tie!');
    }
    // check for win
    if (this.checkForWin(y, x)) {
      return this.endGame(`${this.currPlayer.name} won!`);
    }

    // switch players
    this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
  }
  /* checkForWin: check for win in all possible directions from the current play */
  checkForWin(y, x) {
    // _win is true if every cell is a valid coordinate played by currPlayer
    const _win = cells =>
      cells.every(
        ([y, x]) =>
          y >= 0 &&
          y < this.height &&
          x >= 0 &&
          x < this.width &&
          this.board[y][x] === this.currPlayer
      );
    // to check if there is a win, we iterate over the entire board to check if there is any win combination for horizonal, vertical, upper-right diagonal, or upper-left diagonal.
    for (let y = this.height - 1; y >= 0; y--) {
      for (let x = this.width - 1; x >= 0; x--) {
        //select 3 squares to the left of this current coordinate
        let horiz = [[y, x], [y, x - 1], [y, x - 2], [y, x - 3]];
        //select 3 squares above this current coordinate
        let vert = [[y, x], [y - 1, x], [y - 2, x], [y - 3, x]];
        //select 3 squares diagonally-right above this current coordinate
        let diagUR = [[y, x], [y - 1, x + 1], [y - 2, x + 2], [y - 3, x + 3]];
        //select 3 squares diagonally-left above this current coordinate
        let diagUL = [[y, x], [y - 1, x - 1], [y - 2, x - 2], [y - 3, x - 3]];

        // pass each group of coordindates to _win to confirm if they meet win criteria
        if (_win(horiz) || _win(vert) || _win(diagUR) || _win(diagUL)) {
          return true;
        }
      }
    }
  }
}

/* Player class creates new players with a color and score */
 class Player {
   constructor(name, color, score) {
     this.name = name;
     this.color = color
     this.score = score;
   }
 }

 /* updateScore accepts the winning player, and updates that player's score. When there is a tie no players get points. */
function updateScore(currPlayer){
  // select each player score div
  const player1 = document.getElementById('score1');
  const player2 = document.getElementById('score2');

  if (currPlayer.name === 'Player1') {
    player1.innerText = `Player 1 Score: ${currPlayer.score = currPlayer.score + 1}`;
  } else {
    player2.innerText = `Player 2 Score: ${currPlayer.score = currPlayer.score + 1}`;
  }
}

 const newGame = document.querySelector('#start button');
 newGame.addEventListener('click', startGame);

 /* Gets each player's color before the start of a new game */
 function getPlayerColors() {
     //select player colors
     let p1Color = document.getElementById('player1').value;
     let p2Color = document.getElementById('player2').value;
    //if no selection is made set default colors
     if (p1Color === p2Color) {
       p1Color = '#b300b3';
       p2Color = '#52ab9d';
     }
     updatePlayerColorText(p1Color, p2Color);
     return [p1Color, p2Color];
 }

/* Event handler to start a new game */
 function startGame(e) {
   //remove this event listener to prevent more games starting
   newGame.removeEventListener('click', startGame);
   //get player colors
   const playerColors = getPlayerColors();
   const player1 = new Player('Player1', playerColors[0], 0);
   const player2 = new Player('Player2', playerColors[1], 0);
  return new Game(6, 7, player1, player2);
 }

 /* Update the player color instructions */
 function updatePlayerColorText(p1Color, p2Color) {
   //hide color selectors
   const colorSelector1 = document.querySelector('input#player1');
   const colorSelector2 = document.querySelector('input#player2');
   colorSelector1.style.visibility = 'hidden';
   colorSelector2.style.visibility = 'hidden';
  
  //select player text
   const p1 = document.querySelector('lable#p1');
   const p2 = document.querySelector('lable#p2');
   //update player text style
   p1.innerText = 'Player 1 Color';
   p1.style.color = p1Color;
   p1.style.textShadow = '2px 2px #000000';
   p2.innerText = 'Player 2 Color';
   p2.style.color = p2Color;
   p2.style.textShadow = '2px 2px #000000';
 }

 /* Update the player color selector */
 function updatePlayerColorSelector() {
  //show color selectors
  const colorSelector1 = document.querySelector('input#player1');
  const colorSelector2 = document.querySelector('input#player2');
  colorSelector1.style.visibility = 'visible';
  colorSelector2.style.visibility = 'visible';
  //select and update color selector text and style
  const p1 = document.querySelector('lable#p1');
  const p2 = document.querySelector('lable#p2');
  p1.innerText = 'Player1 Choose your color: ';
  p1.style.color = 'honeydew';
  p1.style.textShadow = '';
  p2.innerText = 'Player2 Choose your color: ';
  p2.style.color = 'honeydew';
  p2.style.textShadow = '';
 }

 /* Update the button to offer players option to play again */
 function updatePlayButton() {
   newGame.innerHTML = 'Play Again?';
   newGame.addEventListener('click', playAgain);
 }

 /* Event handler to clear old hame and start a new game */
 function playAgain(e) {
   //target and remove old html game board
   const oldBoard = document.querySelectorAll('table tr');
   oldBoard.forEach(tr => tr.remove());
   //remove this event listener to prevent more games starting
   newGame.removeEventListener('click', playAgain);
   //get player colors
   const playerColors = getPlayerColors();
   //get current scores
   const p1score = document.getElementById('score1').innerText;
   const p2score = document.getElementById('score2').innerText;;
   const player1 = new Player('Player1', playerColors[0], +p1score.slice(p1score.length - 1));
   const player2 = new Player('Player2', playerColors[1], +p2score.slice(p2score.length -1));
   return new Game(6, 7, player1, player2);
 }

/* Below is all code for the Page Header Animation */
function randomColor() {
  const purple = '#b300b3';
  const darkPurple = '#750075';
  const lightBlue = '#6de8d5';
  const blue = '#52ab9d';
  const green = '#7be099';
  const lightGreen ='#affcae';
  const myColors = [purple, darkPurple, lightBlue, blue, green, lightGreen];
  const randomColor = Math.floor(Math.random() * 6);

  return myColors[randomColor];
}

const letters = document.querySelectorAll('.letter');

const interval = setInterval(function() {
  for (let letter of letters) {
      let color = letter.style.color = randomColor();
      // console.log(`${letter.innerHTML} changed to ${color}`);
  }  
}, 3000);

/* End Page Header Animation Code */
