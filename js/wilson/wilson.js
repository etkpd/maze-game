var WilsonCells = function (cols, rows){
  let cellsWilson = new Array()
  /* 	
    Wilson's algorithm
    1. Initialize maze by chosen one cell arbitrarily.
    2. Then select another cell arbitrarily and perform a random walk until either a cell is reached that is already part of the maze or a cell is reached at is part of random walk's own path.
      1. If maze reached - add to maze, then start another random walk selecting starting point arbitrarily from remaining cells
      2. If cell from created path(loop) is reached - delete the loop and continue random walk
  */
  
  // Start with a grid full of walls. Also, add cell to unvisited set.
  const unvis = new Set();
  
  for (var i = 0; i < rows; i++) {
    cellsWilson[i] = new Array();
    for (var j = 0; j < cols; j++) {
        cellsWilson[i][j] = [0,0,0,0];  //[top, right, bottom, left]
        unvis.add((i)*cols + (j+1))
    }
  }
  // Pick a cell, mark it as part of the maze.
  var randomStartingCell = [Math.floor(Math.random()*rows), Math.ceil(Math.random()*cols)];
  unvis.delete(randomStartingCell[0]*cols + randomStartingCell[1])
  //console.log('random starting cell #1', randomStartingCell[0]*cols + randomStartingCell[1])

  //initialize stack. push initial cell
  let stack = []
  let pathSet = new Set()
  let unvisitedCellsArray = Array.from(unvis)
  let randomCellChosen = Math.floor(Math.random() * unvisitedCellsArray.length)
  stack.push(unvisitedCellsArray[randomCellChosen])
  pathSet.add(stack[stack.length-1])    
  
  //Start randon walks stop once all cells have been visited
  while(unvis.size>0){
    //Add path cells to stack
    let topOfStack = stack[stack.length-1]
    //console.log('while loop')
    //console.log('the stack', ...stack)
    let rowOfCurrentCellIndex = Math.ceil(topOfStack/cols) - 1
    let colOfCurrentCellIndex = topOfStack%cols !== 0 ? topOfStack%cols - 1  : cols - 1

    //console.log(topOfStack, rowOfCurrentCellIndex, colOfCurrentCellIndex)

    //Add potential path cells. One to be selected at random.
    let neighboringCellsRaffle = []
    //top neighbor
    if(rowOfCurrentCellIndex-1>=0 && stack[stack.length-2] !== ((rowOfCurrentCellIndex-1))*cols + (colOfCurrentCellIndex)+1){
      neighboringCellsRaffle.push(((rowOfCurrentCellIndex-1))*cols + (colOfCurrentCellIndex)+1)
    }
    //right neighbor
    if(colOfCurrentCellIndex+1<cols && stack[stack.length-2] !== ((rowOfCurrentCellIndex))*cols + (colOfCurrentCellIndex+1)+1){
      neighboringCellsRaffle.push(((rowOfCurrentCellIndex))*cols + (colOfCurrentCellIndex+1)+1)
    }
    //bottom neighbor
    if(rowOfCurrentCellIndex+1<rows && stack[stack.length-2] !== ((rowOfCurrentCellIndex+1))*cols + (colOfCurrentCellIndex)+1){
      neighboringCellsRaffle.push(((rowOfCurrentCellIndex+1))*cols + (colOfCurrentCellIndex)+1)
    }
    //left neighbor
    if(colOfCurrentCellIndex-1>=0 && stack[stack.length-2] !== ((rowOfCurrentCellIndex))*cols + (colOfCurrentCellIndex-1)+1){
      neighboringCellsRaffle.push(((rowOfCurrentCellIndex))*cols + (colOfCurrentCellIndex-1)+1)
    }
   
    //console.log(neighboringCellsRaffle, 'nieghboringCellsRaffle')

    //add random neighbor to stack 
    stack.push(neighboringCellsRaffle[Math.floor(Math.random()* neighboringCellsRaffle.length)])
    let addedCell = stack[stack.length-1]
    //console.log(addedCell, 'addedCell')

    //IF part of maze reached, then go through path stack and remove walls between neighboring cells. Finally, select arbitrary cell and start new random walk
     if(!unvis.has(stack[stack.length-1])){
      //console.log('<--ADDING TO MAZE-->')

      //Clear stack. As you clear the stack create a passage between neighboring cells
      while(stack.length>1){
        let TopTopStackCell = stack[stack.length-1];
        let NeigthboringCell = stack[stack.length-2];

        let currentCellWallIndentifier = [Math.ceil(TopTopStackCell/cols) - 1, TopTopStackCell%cols !== 0 ? TopTopStackCell%cols - 1  : cols - 1, 11]
        let neighboringCellWallIndentifier = [Math.ceil(NeigthboringCell/cols) - 1, NeigthboringCell%cols !== 0 ? NeigthboringCell%cols - 1  : cols - 1, 11]
        //if cell on the top of the stack is above the previous cell placed on stack
        if(TopTopStackCell === NeigthboringCell - cols){
          currentCellWallIndentifier[2] = 2
          neighboringCellWallIndentifier[2] = 0
        }
        //if to the right
        if(TopTopStackCell === NeigthboringCell + 1){
          currentCellWallIndentifier[2] = 3
          neighboringCellWallIndentifier[2] = 1
        }
        //if to the bottom
        if(TopTopStackCell === NeigthboringCell + cols){
          currentCellWallIndentifier[2] = 0
          neighboringCellWallIndentifier[2] = 2
        }
        //if to the left
        if(TopTopStackCell === NeigthboringCell - 1){
          currentCellWallIndentifier[2] = 1
          neighboringCellWallIndentifier[2] = 3
        }
        
        // Make the wall a passage and mark the unvisited cell as part of the maze.
        cellsWilson[currentCellWallIndentifier[0]][currentCellWallIndentifier[1]][currentCellWallIndentifier[2]] = 1 
        cellsWilson[neighboringCellWallIndentifier[0]][neighboringCellWallIndentifier[1]][neighboringCellWallIndentifier[2]] = 1 
 
        unvis.delete(TopTopStackCell)
        stack.pop()
      }
      
      unvis.delete(stack[stack.length-1])
      stack.pop()
      pathSet.clear()


      //Finally, select an arbitrary unvisited cell and add to stack
      let MunvisitedCellsArray = Array.from(unvis)
      let MrandomCellChosen = Math.floor(Math.random() * MunvisitedCellsArray.length)
      stack.push(MunvisitedCellsArray[MrandomCellChosen])
    }
    
    // IF part of path reached, then pop cells from stack until loop creating cell is reached. Continue random walk
    if(pathSet.has(stack[stack.length-1])){
      //console.log('<--CLEARING LOOP-->')
      stack.pop()
      while(stack[stack.length-1] !== addedCell ){
        //console.log('top of stack while clearing loop', stack[stack.length-1])
        pathSet.delete(stack[stack.length-1])
        stack.pop()
      }
    } 
    else{
      pathSet.add(stack[stack.length-1])    
    } 

  }

  return cellsWilson
}