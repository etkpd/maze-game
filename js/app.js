let startingRow
let endingRow
let disp
let prevCellBorder = [0,1,0,0]  //0 - walled , 1 - open
let prevRow
let prevCol = -1
let firstMove = true

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
  let cellsMap
  let selectedAlgorithm = document.querySelector('.algorithm-options').selectedOptions[0].value
  switch(selectedAlgorithm){
    case 'kruskal':
      cellsMap = KruskalCells(cols, rows)
      break
    case 'prim':
      cellsMap = PrimCells(cols, rows)
      break
    case 'prim-modified':
      cellsMap = PrimModifiedCells(cols, rows)
      break
    case 'wilson':
      cellsMap = WilsonCells(cols, rows)
      break
    default:
      cellsMap = KruskalCells(cols, rows)
  }
  
  let finalCellsMap = generateRandomStartAndFinish(cellsMap, rows, cols);

  return finalCellsMap; 
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