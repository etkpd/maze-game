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
let cellsPrimModified = new Array()
let wallList = []
let neighboringCellsSet = new Set()


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
    Randomized Prim's algorithm, modified version
    1. Start with a grid full of walls.
    2. Pick a cell, mark it as part of the maze. Add adjacent cells of the chosen cell to a set.
    3. While there are cells in the neighboring cells set:
      1. Pick a random cell from the neighboring cells set. If the randomly chosen cell has multiple edges that connect it to the existing maze, select one of these edges at random, then:
        1. Make the bisecting wall a passage and mark the the cell as part of the maze.
        2. Add adjacent cells to neighboring cells set.
      2. Remove the cell from the neighboring cells set.
  */

  // Start with a grid full of walls.
  for (var i = 0; i < rows; i++) {
    cellsPrimModified[i] = new Array();
    for (var j = 0; j < cols; j++) {
        cellsPrimModified[i][j] = [0,0,0,0];  //[top, right, bottom, left]
    }
  }
  let visitedCellsSet = new Set()
  
  // Pick a cell, mark it as part of the maze. Add the adjacent cells of the chosen cell to a set of cells.
  var randomStartingCell = Math.ceil(Math.random()*rows) * Math.ceil(Math.random()*cols);
  visitedCellsSet.add(randomStartingCell)
  if(randomStartingCell>cols)neighboringCellsSet.add(randomStartingCell-cols)
  if(randomStartingCell%cols!=0) neighboringCellsSet.add(randomStartingCell+1)
  if(randomStartingCell<=(rows-1)*cols) neighboringCellsSet.add(randomStartingCell+cols)
  if(randomStartingCell%cols!=1) neighboringCellsSet.add(randomStartingCell-1)  

  // While there are cells in the neighboring cells set:
  while (neighboringCellsSet.size>0){
    // Pick a random cell from the set. If the randomly chosen cell has multiple edges that connect it to the existing maze, select one of these edges at random, then:
    let neighboringCellsArray = [...neighboringCellsSet]
    let randomNeighboringCell = neighboringCellsArray[Math.floor(Math.random() * neighboringCellsArray.length)];
    let connectingCellsArray = new Array()

    if(visitedCellsSet.has(randomNeighboringCell-cols) && randomNeighboringCell>cols) connectingCellsArray.push(randomNeighboringCell-cols)
    if(visitedCellsSet.has(randomNeighboringCell+1) && randomNeighboringCell%cols!=0) connectingCellsArray.push(randomNeighboringCell+1)
    if(visitedCellsSet.has(randomNeighboringCell+cols) && randomNeighboringCell<=(rows-1)*cols) connectingCellsArray.push(randomNeighboringCell+cols)
    if(visitedCellsSet.has(randomNeighboringCell-1) && randomNeighboringCell%cols!=1) connectingCellsArray.push(randomNeighboringCell-1)  
    randomConnectingCell = connectingCellsArray[Math.floor(Math.random() * connectingCellsArray.length)]
    
    let xConnectingCell= (randomConnectingCell%cols !=0)? randomConnectingCell%cols-1 : cols-1 
    let yConnectingCell= Math.ceil(randomConnectingCell/cols) - 1
    let xNeighboringCell= (randomNeighboringCell%cols !=0)? randomNeighboringCell%cols-1 : cols-1 
    let yNeighboringCell= Math.ceil(randomNeighboringCell/cols) - 1
    let zConnectingCell
    let zNeighboringCell


    switch(randomNeighboringCell){
      case randomConnectingCell-cols:
        zConnectingCell = 0
        zNeighboringCell = 2
        break;
      case randomConnectingCell+1:
        zConnectingCell = 1
        zNeighboringCell = 3
        break;
      case randomConnectingCell+cols:
        zConnectingCell = 2
        zNeighboringCell = 0
        break;
      case randomConnectingCell-1:
        zConnectingCell = 3
        zNeighboringCell = 1
        break;
      default:
    }
    
    let connectingCell = [yConnectingCell,xConnectingCell,zConnectingCell]
    let neighboringCell = [yNeighboringCell,xNeighboringCell,zNeighboringCell]
    
    if(!visitedCellsSet.has(randomNeighboringCell)){
      // Make the bisecting wall a passage and mark the unvisited cell as part of the maze.
      cellsPrimModified[connectingCell[0]][connectingCell[1]][connectingCell[2]] = 1 
      cellsPrimModified[neighboringCell[0]][neighboringCell[1]][neighboringCell[2]] = 1 
      visitedCellsSet.add(randomNeighboringCell)
      // Add adjacent cells to neighboring cells set.
      if(!visitedCellsSet.has(randomNeighboringCell-cols) && randomNeighboringCell>cols) neighboringCellsSet.add(randomNeighboringCell-cols)
      if(!visitedCellsSet.has(randomNeighboringCell+1) && randomNeighboringCell%cols!=0) neighboringCellsSet.add(randomNeighboringCell+1)
      if(!visitedCellsSet.has(randomNeighboringCell+cols) && randomNeighboringCell<=(rows-1)*cols) neighboringCellsSet.add(randomNeighboringCell+cols)
      if(!visitedCellsSet.has(randomNeighboringCell-1) && randomNeighboringCell%cols!=1) neighboringCellsSet.add(randomNeighboringCell-1)    

    }
    // Remove the cell from the neighboring cells set.
    neighboringCellsSet.delete(randomNeighboringCell)  
  }

  let finalcellsPrimModified = generateRandomStartAndFinish(cellsPrimModified, rows, cols);

  return finalcellsPrimModified;
    
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
  console.log("Randomized Prim's Algorithm, modified")
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