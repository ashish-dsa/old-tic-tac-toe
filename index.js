/**
 * This program is a boilerplate code for the standard tic tac toe game
 * Here the “box” represents one placeholder for either a “X” or a “0”
 * We have a 2D array to represent the arrangement of X or O is a grid
 * 0 -> empty box
 * 1 -> box with X
 * 2 -> box with O
 *
 * Below are the tasks which needs to be completed:
 * Imagine you are playing with the computer so every alternate move should be done by the computer
 * X -> player
 * O -> Computer
 *
 * Winner needs to be decided and has to be flashed
 *
 * Extra points will be given for approaching the problem more creatively
 *
 */

var grid = [];
var GRID_LENGTH = 3;
var difficultyLevel = 0;
var flag = false;
var playerName = "";
const humanPlayer = 1;
const computerPlayer = 2;
const loadingEffect = 500; //Make this 0 if you want to disable loader
function initializeGrid() {
  grid = [];
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    const tempArray = [];
    for (let rowidx = 0; rowidx < GRID_LENGTH; rowidx++) {
      tempArray.push(0);
    }
    grid.push(tempArray);
  }
}

function getRowBoxes(colIdx) {
  let rowDivs = "";

  for (let rowIdx = 0; rowIdx < GRID_LENGTH; rowIdx++) {
    let additionalClass = "darkBackground";
    let content = "";
    const sum = colIdx + rowIdx;
    if (sum % 2 === 0) {
      additionalClass = "lightBackground";
    }
    const gridValue = grid[colIdx][rowIdx];
    if (gridValue === 1) {
      content = '<span class="cross">X</span>';
    } else if (gridValue === 2) {
      content = '<span class="cross">O</span>';
    }
    rowDivs =
      rowDivs +
      '<div colIdx="' +
      colIdx +
      '" rowIdx="' +
      rowIdx +
      '" class="box ' +
      additionalClass +
      '">' +
      content +
      "</div>";
  }
  return rowDivs;
}

function getColumns() {
  let columnDivs = "";
  for (let colIdx = 0; colIdx < GRID_LENGTH; colIdx++) {
    let coldiv = getRowBoxes(colIdx);
    coldiv = '<div class="rowStyle">' + coldiv + "</div>";
    columnDivs = columnDivs + coldiv;
  }
  return columnDivs;
}

function renderMainGrid() {
  const parent = document.getElementById("grid");
  const columnDivs = getColumns();
  parent.innerHTML = '<div class="columnsStyle">' + columnDivs + "</div>";
}

//CODE_DEBT: Will reduce size if I get time
function onBoxClick() {
  let rowIdx = this.getAttribute("rowIdx");
  let colIdx = this.getAttribute("colIdx");
  if (grid[colIdx][rowIdx] == 0) {
    disableScreen();
    let result = false;
    let newValue;
    let winner = "";
    if (flag == false) {
      newValue = humanPlayer;
      if (grid[colIdx][rowIdx] == 0) {
        grid[colIdx][rowIdx] = newValue;
        result = checkWinner(grid, colIdx, rowIdx, grid[colIdx][rowIdx]);
        if (result) {
          newValue == humanPlayer ? (winner = "Player") : (winner = "Computer");
        }
      }
      if (result || noMovesLeft(grid)) {
        showGameModal(winner);
      }
    }
    newValue = computerPlayer;
    let availableSquares = getAvailableSquares(grid);
    let compMove = computeNextMove(availableSquares);
    if (compMove) {
      colIdx = compMove.x;
      rowIdx = compMove.y;
      if (colIdx != undefined && rowIdx != undefined)
        if (grid[colIdx][rowIdx] == 0) {
          grid[colIdx][rowIdx] = newValue;
          result = checkWinner(grid, colIdx, rowIdx, grid[colIdx][rowIdx]);
          if (result) {
            newValue == humanPlayer
              ? (winner = "Player")
              : (winner = "Computer");
          }
        }
      if (result || noMovesLeft(grid)) {
        showGameModal(winner);
      }
    }
    renderMainGrid();
    addClickHandlers();
    enableScreen();
  }
}

function computeNextMove(availableSquares) {
  let randomValue = (Math.random() * (3 - difficultyLevel + 1)) << 0;
  let compMove = {};
  if (randomValue == 0) {
    compMove = nextMove();
  } else {
    let randomSquare =
      availableSquares[(Math.random() * availableSquares.length) >> 0];
    if (randomSquare[0] != undefined && randomSquare[1] != undefined) {
      compMove.x = randomSquare[0];
      compMove.y = randomSquare[1];
    }
  }
  return compMove;
}

function showGameModal(winner) {
  let winnerModal = document.getElementsByClassName("winnerModal")[0];
  let winnerModalContent =
    document.getElementsByClassName("winnerModalContent")[0];
  if (winner == "Player") {
    winner = playerName;
    winnerModalContent.innerHTML = (winner ? winner : "Player") + " " + "Wins";
    winnerModal.style.display = "block";
  } else if (winner == "Computer") {
    winnerModalContent.innerHTML = "Computer" + " " + "Wins";
    winnerModal.style.display = "block";
  } else {
    winnerModalContent.innerHTML = "It's a Draw";
    winnerModal.style.display = "block";
  }
  setTimeout(() => {
    winnerModal.style.display = "none";
    document.getElementsByClassName("gameEventModal")[0].style.display =
      "block";
    var currentGrid = (document.getElementById("grid").innerHTML = "");
  }, 1500);
}

function addClickHandlers() {
  var boxes = document.getElementsByClassName("box");
  for (var idx = 0; idx < boxes.length; idx++) {
    boxes[idx].addEventListener("click", onBoxClick, false);
  }
}

function checkWinner(currentGrid, row, column, value) {
  let newGrid = currentGrid.slice();
  //left
  if (patternRow(newGrid, row, value)) return true;
  //right
  else if (patternColumn(newGrid, column, value)) return true;
  //diagonalRight
  else if (patternDiagonalRight(newGrid, value)) return true;
  //diagonalLeft
  else if (patternDiagonalLeft(newGrid, value)) return true;
  else return false;
}

function callMe() {
  let buttonTag = document.getElementById("playButton");
  document.getElementsByClassName("gameEventModal")[0].style.display = "none";
  let gridSize = document.getElementById("gridSize").value;
  playerName = document.getElementById("playerName").value;
  setGridSize(gridSize);
  startGame();
  document.getElementsByClassName("loader")[0].style.display = "block";
}

function changeName() {
  let buttonTag = document.getElementById("playButton");
  if (buttonTag.innerHTML != "Play") buttonTag.innerHTML = "Play";
}
function setDifficulty(difficulty) {
  this.difficultyLevel = difficulty;
}

function startGame() {
  initializeGrid();
  renderMainGrid();
  addClickHandlers();
  flag = false;
}

function patternRow(newGrid, row, value) {
  let counter = 0;
  for (let i = 0; i < GRID_LENGTH; i++) {
    if (newGrid[row][i] == value) counter++;
  }
  if (counter == GRID_LENGTH) return true;
  else return false;
}

function patternColumn(newGrid, column, value) {
  let counter = 0;
  for (let i = 0; i < GRID_LENGTH; i++) {
    if (newGrid[i][column] == value) counter++;
  }
  if (counter == GRID_LENGTH) return true;
  else return false;
}

function patternDiagonalLeft(newGrid, value) {
  let counter = 0;
  for (let i = 0; i < GRID_LENGTH; i++) {
    if (newGrid[i][i] == value) counter++;
  }
  if (counter == GRID_LENGTH) return true;
  else return false;
}

function patternDiagonalRight(newGrid, value) {
  let counter = 0;
  let j = GRID_LENGTH - 1;
  for (let i = 0; i < GRID_LENGTH; i++) {
    if (j < 0) break;
    if (newGrid[i][j] == value) counter++;
    j--;
  }
  if (counter == GRID_LENGTH) return true;
  else return false;
}

function setGridSize(gridSize) {
  if (!isNaN(gridSize) && gridSize.trim() != "") GRID_LENGTH = gridSize;
  else GRID_LENGTH = 3;
}

function disableScreen() {
  document.getElementById("loaderId").style.display = "block";
}

function enableScreen() {
  setTimeout(() => {
    document.getElementById("loaderId").style.display = "none";
  }, loadingEffect);
}
function noMovesLeft(newGrid) {
  let counter = 0;
  for (let i = 0; i < GRID_LENGTH; i++) {
    for (let j = 0; j < GRID_LENGTH; j++) {
      if (newGrid[i][j] != 0) counter++;
    }
  }
  if (counter >= GRID_LENGTH * GRID_LENGTH) return true;
  else return false;
}

function nextMove() {
  disableScreen();
  let newGrid = this.grid.slice();
  let nextMove = [-1, -1];
  nextMove = gameTree(0, newGrid, computerPlayer);
  return nextMove;
}

function gameTree(depth, newGrid, player) {
  let availableSquares = getAvailableSquares(newGrid);
  if (findWinner(newGrid, humanPlayer)) {
    return { weight: -10 };
  } else if (findWinner(newGrid, computerPlayer)) {
    return { weight: 10 };
  } else if (availableSquares.length == 0) {
    return { weight: 0 };
  } else if (depth > 5) {
    return { weight: 0 };
  }
  let allMoves = [];
  for (let i = 0; i < availableSquares.length; i++) {
    let currentSquare = {};
    let availableSquare = availableSquares[i];
    if (availableSquare && availableSquare.length > 1) {
      currentSquare.x = availableSquare[0];
      currentSquare.y = availableSquare[1];
      currentSquare.value = newGrid[availableSquare[0]][availableSquare[1]];
      newGrid[availableSquare[0]][availableSquare[1]] = player;
      if (player == computerPlayer) {
        let result = gameTree(depth + 1, newGrid, humanPlayer);
        currentSquare.weight = result.weight;
      } else {
        let result = gameTree(depth + 1, newGrid, computerPlayer);
        currentSquare.weight = result.weight;
      }
      newGrid[availableSquare[0]][availableSquare[1]] = currentSquare.value;
      allMoves.push(currentSquare);
    }
  }
  let optimalMove;
  if (player == computerPlayer) {
    let maxWeight = -999;
    for (let i = 0; i < allMoves.length; i++) {
      if (allMoves[i].weight > maxWeight) {
        maxWeight = allMoves[i].weight;
        optimalMove = i;
      }
    }
  } else {
    let maxWeight = 999;
    for (let i = 0; i < allMoves.length; i++) {
      if (allMoves[i].weight < maxWeight) {
        maxWeight = allMoves[i].weight;
        optimalMove = i;
      }
    }
  }
  return allMoves[optimalMove];
}

function getAvailableSquares(newGrid) {
  let availableSquares = [];
  if (newGrid) {
    for (let i = 0; i < newGrid.length; i++) {
      for (let j = 0; j < newGrid.length; j++) {
        let availableSquare = [];
        if (newGrid[i][j] != undefined) {
          if (newGrid[i][j] == 0) {
            availableSquare.push(i);
            availableSquare.push(j);
            availableSquares.push(availableSquare);
            availableSquare = [];
          }
        }
      }
    }
  }
  return availableSquares;
}

function findWinner(newBoard, value) {
  var ifWinner = false;
  for (let i = 0; i < GRID_LENGTH; i++) {
    ifWinner = checkWinner(newBoard, i, i, value);
    if (ifWinner) {
      return ifWinner;
    }
  }
  return ifWinner;
}

//@Ashish D'sa
