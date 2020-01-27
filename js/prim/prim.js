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
let cellsPrim = new Array()
let wallList = []

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
    Randomized Prim's algorithm
    1. Start with a grid full of walls.
    2. Pick a cell, mark it as part of the maze. Add the walls of the cell to the wall list.
    3. While there are walls in the list:
      1. Pick a random wall from the list. If only one of the two cells that the wall divides is visited, then:
        1. Make the wall a passage and mark the unvisited cell as part of the maze.
        2. Add the neighboring walls of the cell to the wall list.
      2. Remove the wall from the list.
  */

  // Start with a grid full of walls.
  var unvis = new Array();

  for (var i = 0; i < rows; i++) {
    cellsPrim[i] = new Array();
    unvis[i] = new Array();
    for (var j = 0; j < cols; j++) {
        cellsPrim[i][j] = [0,0,0,0];  //[top, right, bottom, left]
        unvis[i][j] = true;
    }
  }

  // Pick a cell, mark it as part of the maze. Add the walls of the cell to the wall list.
  var randomStartingCell = [Math.floor(Math.random()*rows), Math.floor(Math.random()*cols)];
  unvis[randomStartingCell[0]][randomStartingCell[1]] = false

  if(randomStartingCell[0]>0) wallList.push([randomStartingCell[0],randomStartingCell[1],0]) 
  if(randomStartingCell[1]<cols-1) wallList.push([randomStartingCell[0],randomStartingCell[1],1])
  if(randomStartingCell[0]<rows-1) wallList.push([randomStartingCell[0],randomStartingCell[1],2])
  if(randomStartingCell[1]>0) wallList.push([randomStartingCell[0],randomStartingCell[1],3])

  // While there are walls in the list:
  while (wallList.length>0){
    // Pick a random wall from the list. If only one of the two cells that the wall divides is visited, then:
    let randomWallIndex=Math.floor(Math.random()*wallList.length)
    let wall = wallList[randomWallIndex];
    
    let y=wall[0]
    let x=wall[1]
    let z=wall[2]
    let currentCell = [y,x,z]
    let neighboringCell = []

    if(currentCell[2]==0) neighboringCell = [y-1,x,2]
    if(currentCell[2]==1) neighboringCell = [y,x+1,3]
    if(currentCell[2]==2) neighboringCell = [y+1,x,0]
    if(currentCell[2]==3) neighboringCell = [y,x-1,1]
    
    if(unvis[neighboringCell[0]][neighboringCell[1]]){
      // Make the wall a passage and mark the unvisited cell as part of the maze.
      cellsPrim[currentCell[0]][currentCell[1]][currentCell[2]] = 1 
      cellsPrim[neighboringCell[0]][neighboringCell[1]][neighboringCell[2]] = 1 
      unvis[neighboringCell[0]][neighboringCell[1]] = false
      // Add the neighboring walls of the cell to the wall list.
      if(neighboringCell[2] !== 0 && neighboringCell[0]>0 ) wallList.push([neighboringCell[0],neighboringCell[1],0]) 
      if(neighboringCell[2] !== 1 && neighboringCell[1]<cols-1) wallList.push([neighboringCell[0],neighboringCell[1],1])
      if(neighboringCell[2] !== 2 && neighboringCell[0]<rows-1) wallList.push([neighboringCell[0],neighboringCell[1],2])
      if(neighboringCell[2] !== 3 && neighboringCell[1]>0) wallList.push([neighboringCell[0],neighboringCell[1],3])

    }
    // Remove the wall from the list.
    wallList.splice(randomWallIndex, 1)  
  }

  let finalCellsPrim = generateRandomStartAndFinish(cellsPrim, rows, cols);

  return finalCellsPrim;
    
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
  console.log("Randomized Prim's Algorithm")
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