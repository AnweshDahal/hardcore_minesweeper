
document.addEventListener('DOMContentLoaded', () => {
  /**
   * [0][0][0][*][0]
   * [0][0][0][0][0]
   * [0][*][*][0][0]
   * [0][0][0][0][*]
   * [0][*][0][0][*]
   */



  // shuffle array function using Fisher-Yates Algorithm
  function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue = 0;
    let randomIndex = 0;

    // while there remains elements to shuffle
    while (currentIndex) {

      // pick the remaining element
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // swap it with current element
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue
    }
    return array;
  }

  // variables
  var width = 10; // number of columns of the board
  var gameSeed = []; // layout of mines
  var mineNumber = 30; // total number of mines in the game
  var opeaned = 0;
  var gameOver = false;
  var gameWon = false;


  // generate game seed
  function createGameSeed() {
    let mines = Array(mineNumber).fill("mine"); // Array of mines
    let safe = Array((width ** 2) - mineNumber).fill("safe"); // Array of safe cells
    let tempSeed = safe.concat(mines); // temporary seed of mines and safe cells
    // shuffling the array
    tempSeed = shuffle(tempSeed);

    let index = 0; // tracker for index of tempSeed
    // converting the array to a 2-dimensional array
    for (let i = 0; i < width; i++) {
      let row = [];
      for (let j = 0; j < width; j++) {
        row.push(tempSeed[index++]);
      }
      gameSeed.push(row);
    }
  }

  // create board
  function createBoard() {
    createGameSeed();
    console.log(gameSeed);
    let board = document.createElement("div");
    board.setAttribute("class", "board");
    for (let i = 0; i < width; i++) {
      let row = document.createElement("div");
      row.setAttribute("class", "row");
      for (let j = 0; j < width; j++) {
        let cell = document.createElement("button");
        cell.setAttribute("class", "cell");
        cell.setAttribute("id", `${i}-${j}`);
        cell.addEventListener("click", function (e) {
          if (e.target.classList.contains("flag")) {
            e.target.classList.remove("flag");
          }
          reveal(e.target);
        });
        cell.addEventListener("contextmenu", function (e) {
          e.preventDefault();
          if (!e.target.classList.contains("flag")) {
            e.target.innerHTML = "🚩";
            e.target.classList.add("flag");
          } else {
            e.target.classList.remove("flag");
            e.target.innerHTML = "";
          }

        })
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
    document.querySelector("#app").appendChild(board);
  }
  // reveal
  function reveal(cell) {
    cell.innerHTML = "";
    let currCellID = cell.id.split("-");
    let row = parseInt(currCellID[0]);
    let column = parseInt(currCellID[1]);
    if (gameSeed[row][column].includes("mine")) {
      cell.appendChild(document.createTextNode('💥'));
      cell.classList.add("mine");
      let allCells = document.querySelectorAll('.cell');
      for (let i = 0; i < allCells.length; i++) {
        allCells[i].disabled = true;
      }
      for (let i = 0; i < width; i++) {
        for (let j = 0; j < width; j++) {
          if (gameSeed[i][j] == "mine") {
            document.getElementById(`${i}-${j}`).innerHTML = "💥";
          }
        }
      }
      cell.disabled = true;
      gameOver = true;
    } else {
      let minesAround = check(row, column);
      if (minesAround == 0) {
        floodFill(row, column);
      }
      cell.appendChild(document.createTextNode(minesAround));
      cell.disabled = true;
      opeaned++;
      console.error(((width * width) - mineNumber) + " = " + opeaned)
      if (opeaned == 1) {
        timer();
      } else if (opeaned == ((width * width) - mineNumber)) {
        gameWon = true;
      }
    }
  }

  // fill
  function floodFill(x, y) {
    // NW: [x-1, y-1]
    if (x > 0 && y > 0) {
      let row = x - 1;
      let col = y - 1;
      let currCheck = check(row, col)
      let currGS = gameSeed[row][col];
      if (currCheck != 0 && currGS != "mine") {
        document.getElementById(`${row}-${col}`).innerHTML = currCheck;
      } else {
        document.getElementById(`${row}-${col}`).innerHTML = '0';
      }
    }

    // N: [x-1, y]
    if (x > 0) {
      let row = x - 1;
      let col = y
      let currCheck = check(row, col)
      let currGS = gameSeed[row][col];
      if (currCheck != 0 && currGS != "mine") {
        document.getElementById(`${row}-${col}`).innerHTML = currCheck;
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      } else {
        document.getElementById(`${row}-${col}`).innerHTML = '0';
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      }
    }

    // NE: [x-1, y+1]
    if (x > 0 && (y < (width - 1))) {
      let row = x - 1;
      let col = y + 1;
      let currCheck = check(row, col)
      let currGS = gameSeed[row][col];
      if (currCheck != 0 && currGS != "mine") {
        document.getElementById(`${row}-${col}`).innerHTML = currCheck;
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      } else {
        document.getElementById(`${row}-${col}`).innerHTML = '0';
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      }
    }
    // W: [x, y-1]
    if (y > 0) {
      let row = x;
      let col = y - 1;
      let currCheck = check(row, col)
      let currGS = gameSeed[row][col];
      if (currCheck != 0 && currGS != "mine") {
        document.getElementById(`${row}-${col}`).innerHTML = currCheck;
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      } else {
        document.getElementById(`${row}-${col}`).innerHTML = '0';
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      }
    }
    // E: [x, y+1]
    if (y < (width - 1)) {
      let row = x;
      let col = y + 1;
      let currCheck = check(row, col)
      let currGS = gameSeed[row][col];
      if (currCheck != 0 && currGS != "mine") {
        document.getElementById(`${row}-${col}`).innerHTML = currCheck;
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      } else {
        document.getElementById(`${row}-${col}`).innerHTML = '0';
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      }
    }

    // SW: [x+1, y-1]
    if (x < (width - 1) && y > 0) {
      let row = x + 1;
      let col = y - 1;
      let currCheck = check(row, col)
      let currGS = gameSeed[row][col];
      if (currCheck != 0 && currGS != "mine") {
        document.getElementById(`${row}-${col}`).innerHTML = currCheck;
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      } else {
        document.getElementById(`${row}-${col}`).innerHTML = '0';
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      }
    }

    // S: [x+1, y]
    if (x < (width - 1)) {
      let row = x + 1;
      let col = y;
      let currCheck = check(row, col)
      let currGS = gameSeed[row][col];
      if (currCheck != 0 && currGS != "mine") {
        document.getElementById(`${row}-${col}`).innerHTML = currCheck;
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      } else {
        document.getElementById(`${row}-${col}`).innerHTML = '0';
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      }
    }

    //SE: [x+1, y+1]
    if (x < (width - 1) && y < (width - 1)) {
      let row = x + 1;
      let col = y + 1;
      let currCheck = check(row, col)
      let currGS = gameSeed[row][col];
      if (currCheck != 0 && currGS != "mine") {
        document.getElementById(`${row}-${col}`).innerHTML = currCheck;
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      } else {
        document.getElementById(`${row}-${col}`).innerHTML = '0';
        document.getElementById(`${row}-${col}`).disabled = true;
        opeaned++;
      }
    }

  }
  // check
  function check(x, y) {
    /**
     * (NW)(N)(NE)
     * (W)(O)(E)
     * (SW)(S)(SE)
     * ---------------------
     * [x-1, y-1][x-1, y][x-1, y+1]
     * [x, y-1][x, y][x, y+1]
     * [x+1, y-1][x+1, y][x+1, y+1]
     */
    let totalMine = 0;

    // NW: [x-1, y-1]
    if (x > 0 && y > 0) {
      if (gameSeed[x - 1][y - 1] == "mine") totalMine++;
    }

    // N: [x-1, y]
    if (x > 0) {
      if (gameSeed[x - 1][y] == "mine") totalMine++;
    }
    // NE: [x-1, y+1]
    if (x > 0 && (y < (width - 1))) {
      if (gameSeed[x - 1][y + 1] == "mine") totalMine++;
    }
    // W: [x, y-1]
    if (y > 0) {
      if (gameSeed[x][y - 1] == "mine") totalMine++;
    }
    // E: [x, y+1]
    if (y < (width - 1)) {
      if (gameSeed[x][y + 1] == "mine") totalMine++;
    }
    // SW: [x+1, y-1]
    if (x < (width - 1) && y > 0) {
      if (gameSeed[x + 1][y - 1] == "mine") totalMine++;
    }
    // S: [x+1, y]
    if (x < (width - 1)) {
      if (gameSeed[x + 1][y] == "mine") totalMine++;
    }
    //SE: [x+1, y+1]
    if (x < (width - 1) && y < (width - 1)) {
      if (gameSeed[x + 1][y + 1] == "mine") totalMine++;
    }
    return totalMine;
  }

  createBoard();

  var time = 1;

  function timer() {

    let myTimer = setInterval(gameTimer, 1000);

    function gameTimer() {
      time++;
      let displayTime = time < 10 ? "0" + time : time;
      document.querySelector("#time").innerHTML = displayTime;

      if (gameOver) {
        document.querySelector("#goScreen").style.display = "flex";
        document.querySelector("#message").innerHTML = "GAME OVER"
        clearInterval(myTimer);
      }

      if (gameWon) {
        document.querySelector("#goScreen").style.display = "flex";
        document.querySelector("#message").innerHTML = "YOU WON"
        clearInterval(myTimer);
      }
    }
  }

});

