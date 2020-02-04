var KruskalCells = function(cols, rows) {
  let walls=[]
  let randomizedWalls=[]
  let disjointSet = new DisjointSet()
  let cellsKruskal = new Array()
  /* 	
    Randomized Kruskal's algorithm
    1. Create a list of all walls, and create a set for each cell, each containing just that one cell.
    2. For each wall, in some random order:
      1. If the cells divided by this wall belong to distinct sets:
        1. Remove the current wall.
        2. Join the sets of the formerly divided cells. 
  */

  // Create a list of all walls, and create a set for each cell, each containing just that one cell.
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

    return cellsKruskal;
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