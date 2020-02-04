var PrimModifiedCells = function(cols, rows){
  let cellsPrimModified = new Array()
  let neighboringCellsSet = new Set()
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

  return cellsPrimModified;
}