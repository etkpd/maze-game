var PrimCells = function(cols, rows){
  let cellsPrim = new Array()
  let wallList = []
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

  return cellsPrim;
}