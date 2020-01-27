let startingRow
let endingRow
let disp
let prevCellBorder = [0,1,0,0]  //0 - walled , 1 - open
let prevRow
let prevCol = -1
let firstMove = true
let walls=[]
let randomizedWalls=[]
let disjointSet = new DisjointSet()
let cellsKruskal = new Array()


generateNewMapBtn = document.querySelector('.NewMap-btn');
let endScreen = document.querySelector(".overlay");
let winText = document.querySelector(".win-text");
let lossText = document.querySelector(".loss-text");

generateNewMapBtn.addEventListener('click', function(event) {
	firstMove = true
  prevCol = -1
  winText.classList.remove("show-text");
  lossText.classList.remove("show-text");
  endScreen.classList.remove("show");
	generateMap()
})

function newMaze(cols, rows) {
  /* 	
    Randomized Kruskal's algorithm
    1. Create a list of all walls, and create a set for each cell, each containing just that one cell.
    2. For each wall, in some random order:
      1. If the cells divided by this wall belong to distinct sets:
        1. Remove the current wall.
        2. Join the sets of the formerly divided cells. 
  */

  // Create a list of all walls, and create a set for each cell, each containing just that one cell.
    walls = []
    let numberOfHorizontalWalls = (rows - 1)*(cols    )
    let numberOfVerticalWalls   = (rows    )*(cols - 1) 

    for(row=1;row<=rows;row++){
      for(col=1;col<=cols;col++){
        if(col<=cols-1){
          walls.push({
            direction: "right",
            col: col,
            row: row
          })
        }
        if(row<=rows-1){
          walls.push({
            direction: "bottom",
            col: col,
            row: row
          })
        }
      }
    }

    for(row=1;row<=rows;row++){
      for(col=1;col<=cols;col++){
        cellNumber= cols * (row - 1) + col
        disjointSet.makeSet(cellNumber)
      }
    }

  // For each wall, in some random order: 
    randomizedWalls = shuffleArray(walls);

    for (var i = 0; i < rows; i++) {
      cellsKruskal[i] = new Array();
      for (var j = 0; j < cols; j++) {
          cellsKruskal[i][j] = [0,0,0,0];  //[top, right, bottom, left]
      }
    }

    randomizedWalls.forEach(function(wall) {
      // If the cells divided by this wall belong to distinct sets:
      let {direction, row, col } = wall
      let y = row - 1;
      let x = col - 1;
      let cell1, cell2
      if (direction==="right"){
        cell1=cols * (row - 1)+ col
        cell2=cols * (row - 1)+ (col + 1)
      } else if(direction==="bottom"){
        cell1=cols * (row - 1)+ col;
        cell2=cols * ((row + 1 ) - 1)+ col;
      } 
    

      if(!disjointSet.inSameSet(cell1,cell2)){
        // Remove the current wall.
        if(direction==="right"){
          cellsKruskal[y][x][1] = 1
          cellsKruskal[y][x+1][3] = 1 
        } else if (direction==="bottom"){
          cellsKruskal[y][x][2] = 1
          cellsKruskal[y+1][x][0] = 1
        } 

        // Join the sets of the formerly divided cells. 
        disjointSet.union(cell1,cell2)
      } 

    });

    let finalCellsKruskal = generateRandomStartAndFinish(cellsKruskal, rows, cols);

    return finalCellsKruskal;
}

function shuffleArray(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function generateRandomStartAndFinish(cells, numberOfRows, numberOfCols){
	startingRow = Math.floor(Math.random()*numberOfRows)
	prevRow = startingRow
	endingRow = Math.floor(Math.random()*numberOfRows)

	positionTextbox(".start-textbox", startingRow, numberOfRows)
	positionTextbox(".finish-textbox", endingRow, numberOfRows)

	cells[startingRow][0][3] = 1
	cells[endingRow][numberOfCols - 1][1] = 1
	return cells
}

function positionTextbox (classname, row, maxRows){
	let marginTop = row*30 - 18;
	
	if(row == 0) marginTop = -1;
	if(row == maxRows-1) marginTop = row*30 - 35;

	document.querySelector(classname).style.marginTop = `${marginTop}px`;
}

function generateMap() {
	let rows = 25
  let cols = 25
  console.log("Randomized Kruskal's Algorithm")
	disp = newMaze(rows,cols);
	var tbdy = document.querySelector('#maze tbody');
	tbdy.innerHTML = ""
	for (var i = 0; i < disp.length; i++) {
		var tr = document.createElement('tr');
			for (var j = 0; j < disp[i].length; j++) {
				var selector = i+"-"+j;
				td = document.createElement('td');
				td.setAttribute("id", selector);
				borderStyles = ""
				if (disp[i][j][0] == 0) { borderStyles += "border-top: 2px solid black; " }  // 0 - walled, 1 - open
				if (disp[i][j][1] == 0) { borderStyles += "border-right: 2px solid black; "}
				if (disp[i][j][2] == 0) { borderStyles += "border-bottom: 2px solid black; " }
				if (disp[i][j][3] == 0) { borderStyles += "border-left: 2px solid black; " }
				td.setAttribute("style", borderStyles);
				tr.appendChild(td)
			}
		tbdy.appendChild(tr)
	} 
  detectValidMouseMove()
  detectMazeCompletion()
}	
generateMap()

function detectValidMouseMove(){
  let cells = document.querySelectorAll('td');
  
  for (const cell of cells) {
    cell.addEventListener('mouseover', function(event) {
      cellID = event.target.id
      const myRe = /(\d{1,2})-(\d{1,2})/g;
      const cellPositionArray = myRe.exec(cellID);
      const row = cellPositionArray[1];
      const col = cellPositionArray[2];
      const activeCellBorder = disp[row][col];
      let moved = ''
      let validMove

      if (row<prevRow) moved = 'up'
      if (col>prevCol) moved = 'right'
      if (row>prevRow) moved = 'down' 
      if (col<prevCol) moved = 'left'

      console.log(moved)
      switch(moved){
        case 'up':
          validMove = (prevCellBorder[0] == 1) ? true: false
          break;
        case 'right':
          validMove = (prevCellBorder[1] == 1) ? true: false
          break;
        case 'down':
          validMove = (prevCellBorder[2] == 1) ? true: false
          break;
        case 'left':
          validMove = (prevCellBorder[3] == 1) ? true: false
          break;
        case 'default':
          console.log('default case')
      }

      if (firstMove){
        validMove = (row == prevRow && col == 0)? true: false
        firstMove=false
      }

      if(!validMove){
        lossText.classList.add("show-text");
        endScreen.classList.add("show");
      }

      console.log('row:', row, ' col:', col)
      console.log('Active Cell Border: ', activeCellBorder)
      console.log('prevRow:', prevRow, ' prevCol:', prevCol)
      console.log('Previous Cell Border: ', prevCellBorder)
      console.log('Valid Move: ', validMove)

      prevCellBorder = activeCellBorder
      prevCol = col
      prevRow = row
    })
  }
}

function detectMazeCompletion(){
	document.querySelector(".finish-textbox").addEventListener('mouseover',function(event){
		if(!firstMove){
      winText.classList.add("show-text");
      endScreen.classList.add("show");
    }
	})
}