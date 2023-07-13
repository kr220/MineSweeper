let board = [];
let rows = 8;
let cols = 8;
let mines_count = 7;
let mines_location = [];

let tiles_clicked = 0; //ans
let flag = false;       //To enable flag
let game_over = false;  //When clicked on mine turn it true

window.onload = function () {
    start();
}

// __________Pushes mines locations into mine_locations array___________
function setMines(){
    // mines_location.push("2-2");
    // mines_location.push("2-3");
    // mines_location.push("5-6");
    // mines_location.push("3-4");
    // mines_location.push("1-1");
    
    count = mines_count;

    while(count>0){
        let row = Math.floor(Math.random()*rows);   //[0 to rows-1]
        let col = Math.floor(Math.random()*cols);
        let id = row.toString()+"-"+col.toString();

        if(!mines_location.includes(id)){
            mines_location.push(id);
            count -= 1;
        }
    }
}


function start() {
    setMines();

    document.getElementById("mines-count").innerText = mines_count;

    // Make tiles and assign them with id (row,col) and also add eventlisteners
    for (i = 0; i < rows; i++) {
        let row = []
        for (j = 0; j < cols; j++) {
            let tile = document.createElement("div");
            tile.id = i.toString() + '-' + j.toString();
            tile.addEventListener("click", click_tile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);            //2D array declared above
    }
    // console.log(board)


    flag_button = document.getElementById("flag");
    flag_button.addEventListener("click", setflag);
}


//____________Flag Enabler/Disabler___________________
function setflag() {
    if (flag === true) {
        flag = false;
        flag_button = document.getElementById("flag");
        flag_button.style.backgroundColor = "lightgray";
    }

    else if (flag === false) {
        flag = true;
        flag_button = document.getElementById("flag");
        flag_button.style.backgroundColor = "gray";
    }
}

// ____________Reveals The mines Once game is over_____________
function revealMines(){
    for(i=0; i<rows; i++){
        for(j=0; j<cols; j++){
            let tile = board[i][j];
            if(mines_location.includes(tile.id)){
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}


// ______________Reveals number of neighbouring Mines____________________
function noOfMines(row, col){
    if(row<0 || row>=rows || col<0 || col>=cols)
        return;

    if(board[row][col].classList.contains("tile-clicked")){  //visited -> BC
        return
    }

    board[row][col].classList.add("tile-clicked");      // mark visited
    tiles_clicked += 1;

    let mines = 0;

    for(i=-1; i<=1; i++){
        for(j=-1; j<=1; j++){
            mines += checktile(row+i, col+j);
        }
    }
        // mines += checktile(row-1, col-1);
        // mines += checktile(row-1, col);
        // mines += checktile(row-1, col+1);

        // mines += checktile(row, col-1);
        // mines += checktile(row, col+1);
        
        // mines += checktile(row+1, col-1);
        // mines += checktile(row+1, col);
        // mines += checktile(row+1, col+1);
    
    // If mines found print the number of mines
    if(mines > 0){
        tile = board[row][col]
        tile.innerText = mines;
        tile.classList.add("x"+mines.toString());
    }
    //Otherwise check for all empty nbrs 
    else{
        // for(i=-1; i<=1; i++){
        //     for(j=-1; j<=1; j++){
        //             noOfMines(row+i, col+j);
        //     }
        // }
// <-------RECCURSIVE CALLS--------?
        noOfMines(row-1, col-1);
        noOfMines(row-1, col);
        noOfMines(row-1, col+1);

        noOfMines(row, col-1);
        noOfMines(row, col+1);

        noOfMines(row+1, col-1);
        noOfMines(row+1, col);
        noOfMines(row+1, col+1);
    }
    console.log(mines);
    if(tiles_clicked == rows*cols-mines_count){//all tiles except mines has been revealed
        console.log(mines);
        document.getElementById("mines-count").innerText = "Great!!! All Mines Cleared!";
        game_over = true;
        revealMines();
    }
}

//Checks whether valid tile and if valid do it contain mine
function checktile(row, col){
    if(row<0 || row>=rows || col<0 || col>=cols)
        return 0;

    if(mines_location.includes(row.toString()+"-"+col.toString())){
        return 1;
    }

    return 0;
}

// ____________Tile Event Listener____________________
function click_tile() {
    if(game_over || this.classList.contains("tile-clicked")){
        return;
    }
    let tile = this;
    // Check flag Enabled or Disabled, then mark or unmark flags only and return
    if (flag) {
        if (tile.innerText === "") {
            tile.innerText = "🚩";
        }
        else if (tile.innerText === "🚩") {
            tile.innerText = "";
        }
        return;
    }

    //Otherwise Check If tile conatins mine (id(tile) lies in mines_location)
    if(mines_location.includes(tile.id)){
        alert("Game Over !!");
        game_over = true;
        revealMines();
        return;
    } 

    // Else print #nbr mines
    let cordinates = tile.id.split("-");
    let row = parseInt(cordinates[0]);
    let col = parseInt(cordinates[1]);

    noOfMines(row, col);
}