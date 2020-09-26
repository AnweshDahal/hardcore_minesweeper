document.addEventListener("DOMContentLoaded", () => {
  /**
 * | 0 0 0 * 0 |
 * | 0 0 0 0 0 |
 * | 0 * * 0 0 |
 * | 0 0 0 0 * |
 * | 0 * 0 0 * |
 */

  // variables
  var width = 10; // number of columns
  var gameSeed = [] // layout of the game
  var mineNumber = 30; // numbers of mines

  // generate game seed
  function createGameSeed() {
    let mines = Array(mineNumber).fill("mine")
    let safe = Array((width * width) - mineNumber).fill("safe")
    let tempSeed = safe.concat(mines);
    tempSeed = tempSeed.sort(() => Math.random() - 0.5);
    let index = 0;
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
          reveal(e.target);
        });
        cell.addEventListener('contextmenu', function (e) {
          e.preventDefault();
          e.target.innerHTML = "";
          e.target.appendChild(document.createTextNode("🚩"));
        })
        row.appendChild(cell);
      }
      board.appendChild(row);
    }
    document.querySelector("#app").appendChild(board);
  }

  function reveal(cell) {
    cell.innerHTML = "";
    let currCellID = cell.id.split("-");
    let row = parseInt(currCellID[0]);
    let column = parseInt(currCellID[1]);
    if (gameSeed[row][column] == "mine") {
      cell.appendChild(document.createTextNode('💥'));
      cell.classList.add("mine");
      cell.disabled = true;
    } else {
      let minesAround = checkMine(row, column);
      cell.appendChild(document.createTextNode(minesAround));
      cell.disabled = true;
    }
  }

  function checkMine(x, y) {
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
  createGameSeed();
  createBoard();
});