/* initialize the game's variables */
const player1GameBoard = $("#player1-game-board")
const player2GameBoard = $("#player2-game-board")
let isOpponent = false
let gridSize
let opponentShipsPositions = {} // stores positions where we already have ships
let attackedShips = {} // stores positions that opponent has already attacked
let gameOver = false
let timerChoice, timer
let minutes = 5
let seconds = 0
let playerFirstAttack = true

let shipsTemplate = {
    'carrier': {
    'number': 1,
    'length': 5,
    'img': "carrier.png"
    },
    'battleship': {
    'number': 1,
    'length': 4,
    'img': "battleship.png"
    },
    'cruiser': {
    'number': 1,
    'length': 3,
    'img': "cruiser.png"
    },
    'submarine': {
    'size': 1,
    'length': 3,
    'img': "submarine.png"
    },
    'destroyer': {
    'number': 1,
    'length': 2,
    'img': "destroyer.png"
    }
}

let playerShips = JSON.parse(JSON.stringify(shipsTemplate))
let opponentShips = JSON.parse(JSON.stringify(shipsTemplate))
const initialValue = 0

/* Total number of possibles moves */
const totalMoves = Object.values(shipsTemplate).reduce(
    (accumulator, currentValue) => accumulator + currentValue["length"],
    initialValue)

let playerScore = 0
let opponentScore = 0

/* Creates cells and rows depending on the size to initialize the players board
** if it's the player, then class player1 is added other it's player2 and the player
** can't click on the computer's cells yet */
let initializeGrid = (size, playerBoard, isOpponent) => {
    for(let i=0; i<size; i++){
        let row = $("<tr></tr>")
        for(let j=0; j<size; j++){
            let cell = $("<td></td>")
            cell.text("+")
            cell.addClass("game-cell")
            if(!isOpponent){
                cell.addClass("player1")
            }
            else{
                cell.addClass("player2")
                cell.css("pointer-events", "none")
            }
            row.append(cell)
        }
        playerBoard.append(row)
    }
}

/* Creates vertical and horizontal headers for the given playerboard from 1 to size */
let createHeaders = (size, playerBoard) => {
    let headerRow = $("<tr></tr>")
    playerBoard.prepend(headerRow)
    headerRow.append($("<td></td>"))
    for(let i=0; i<size; i++){
        let cell = $("<td></td>")
        cell.addClass("header-cell")
        cell.text(i + 1)
        headerRow.append(cell)
        let row = playerBoard.find("tr:nth-child(" + (i + 2) + ")")
        row.prepend($("<td></td>").addClass("header-cell").text(i + 1))
    }
}

/* Updates the table with the right content 
** loop through the cells that are not headers, if it's the opponent and ships are placed, hide them
** otherwise show the ships or content */
let updateGrid = (table, isOpponent) => {
    for(let i=0; i<table.find("tr").length; i++){
        for(let j=0; j<table.find("tr:nth-child(" + (i + 1) + ") td").length; j++){
            let cell = table.find("tr:nth-child(" + (i + 1) + ") td:nth-child(" + (j + 1) + ")")
            if (isOpponent && cell.text() == "S") {
                cell.text("+")
            } 
            else {
                cell.text(cell.text())
            }
        }
    }
}

/* User places his ships by choosing its type and clicking on a cell to place it
** each ship is represented by an image and when a ship is placed, it's desactivated
** from the selection so it can't be placed twice 
** while ships are still available, the user keeps placing them, a ship class is then added 
to the cell, the number of left ships is displayed to the user and when all ships have been 
** placed, the player can't click on his cells anymore and he can't click on the opponent's
cells (=attack) unless all his ships have been placed */
let clickPlaceShips = () => {
    const playerCells = $(".player1")
    const opponentCells = $(".player2")
    let clickCounter = 1
    let shipsNb = $(".shipsNb")
    playerCells.click(function() {
        if (clickCounter <= Object.keys(playerShips).length) {
            let shipType = $("#ship-type-select").val()
            if(shipType === null){
                alert("Please select a ship type before placing a ship.")
                return
            }
            let shipImg = playerShips[shipType]["img"]
            const selectedOption = $("#ship-type-select option:selected")
            selectedOption.prop("disabled", true)
            $(this).addClass("ship " + shipType)
            $(this).html('<img src="resources/images/'+shipImg+'" alt="ship cartoon" heigth=40 width=30>')
            clickCounter++
            let remainingShips = Object.keys(playerShips).length - clickCounter +1
            shipsNb.children(".text").text(remainingShips + " out of " + Object.keys(playerShips).length)
            if((clickCounter-1) === Object.keys(playerShips).length) opponentCells.css("pointer-events", "auto")
        } 
        else {
            $(this).css("pointer-events", "none")
            shipsNb.children(".text").text("You don't have any more ships to place !")
        }
    })
}

/* Returns a integer between 1 and max included 
** used for the opponent to randomly place and attack ships */
let getRandomCoordinate = (max) => {
    return Math.floor(Math.random()*Math.floor(max))+1
}

/* Randomly places opponent's ships in his grid 
** have an array of all the ship types, while this array is not empty, take a random
** ship and place it in a random place if this place is not already taken and
** remove the type of the ship from the array to avoid placing the same ship twice */
let placeOpponentShips = (char, grid) => {
    let shipTypes = Object.keys(opponentShips)
    while(shipTypes != 0){
        let shipType = shipTypes[Math.floor(Math.random() * shipTypes.length)]
        let x = getRandomCoordinate(gridSize)
        let y = getRandomCoordinate(gridSize)
        if(!opponentShipsPositions[`${x}-${y}`]){
            $(grid).find("tr").eq(x).find("td").eq(y).text(char)
            $(grid).find("tr").eq(x).find("td").eq(y).addClass("ship " + shipType)
            opponentShipsPositions[`${x}-${y}`] = true
            shipTypes.splice(shipTypes.indexOf(shipType), 1)
        }
    }
}   

/* The computer attacks a random cell in the player's grid if it hasn't already been
** a miss or sunk. If it's a hit, a hit ship is displayed, a hit class is added and the ship's
** length is dicreased. Then we check if the ship should be sunk, if so, the proper image is
** displayed, class sunk is added and scores are updated. If it's a miss, a sign is shown and
** class miss is added. We then check if the game is over and don't allow click on cells that
** have missed or sunk ship */
let opponentAttack = () => {
    let x = getRandomCoordinate(gridSize)
    let y = getRandomCoordinate(gridSize)
    let player2Cells = $(".player2")
    let player1Cell = $(player1GameBoard).find("tr").eq(x).find("td").eq(y)
    let opponentTotalScore = $(".player2Score").children(".text")
    // Keep generating new coordinates until we find a position that has not been missed or sunk 
    while (attackedShips[`${x}-${y}`] && (player1Cell.hasClass("miss") || player1Cell.hasClass("sunk"))){
        x = getRandomCoordinate(gridSize)
        y = getRandomCoordinate(gridSize)
        player1Cell = $(player1GameBoard).find("tr").eq(x).find("td").eq(y)
    }    
    if(player1Cell.hasClass("ship")){
        let player1CellType = player1Cell[0].classList[3]
        player1Cell.addClass("hit")
        player1Cell.html('<img src="resources/images/brokenShip.png" alt="ship cartoon" heigth=40 width=40>')
        playerShips[player1CellType]['length']--
        if(isSunk(player1CellType, false)){
            alert("The opponent sunk your " + player1CellType + " !")
            opponentScore++
            opponentTotalScore.text(opponentScore)
            player1Cell.addClass("sunk")
            player1Cell.html('<img src="resources/images/rip.png" alt="ship cartoon" heigth=40 width=40>')
        }
    }
    else{
        player1Cell.addClass("miss")
        player1Cell.text("X")
    }
    attackedShips[`${x}-${y}`] = true
    checkWin()
    player2Cells.each(function(){
        if($(this).hasClass("sunk") || $(this).hasClass("miss")){
            $(this).css("pointer-events", 'none')
        }
        else if($(this).hasClass("ship") || $(this).hasClass("hit")){
            $(this).css("pointer-events", 'auto')
        }
        else{
            $(this).css("pointer-events", 'auto')
        }
    })
}

/* The player attacks by clicking on a opponent's cell and as for the computer attack,
** the content of the cell and classes are added accordingly, scores are updated and
** check if the game is over is performed */
let clickAttack = () => {
    let playerScoreText = $(".player1Score").children(".text")
    let hitShips = $(".hitShips").children(".text")
    let missedShots = $(".missedShips").children(".text")
    let hitShipsNb = 0
    let missedShotsNb = 0
    let sunkShips = $(".sunkShips").children(".text")
    let sunkShipsNb = 0
    $(".player2").each(function() {
        $(this).click(function() {
            if(timerChoice === "on" && playerFirstAttack){
                $(".timer").text("5:00")
                timer = setInterval(updateTimer, 1000)
                playerFirstAttack = false
            }
            if ($(this).hasClass("ship")) {
                let player2CellType = $(this)[0].classList[3]
                $(this).addClass("hit")
                $(this).html('<img src="resources/images/brokenShip.png" alt="ship cartoon" heigth=40 width=40>')
                opponentShips[player2CellType]['length']--
                hitShipsNb++
                hitShips.text(hitShipsNb + " out of " + totalMoves + " total hits for all the ships")
                if(isSunk(player2CellType, true)){
                    playerScore++
                    playerScoreText.text(playerScore)
                    sunkShipsNb++
                    sunkShips.text(sunkShipsNb)
                    $(this).addClass("sunk")
                    $(this).html('<img src="resources/images/rip.png" alt="ship cartoon" heigth=40 width=40 >')  
                }
            } 
            else {
                    $(this).addClass("miss")
                    $(this).text("X")
                    missedShotsNb++
                    missedShots.text(missedShotsNb)
            }
            $(".player2").each(function() {
                $(this).css("pointer-events", 'none')
            })
            let winResult = checkWin()
            if(winResult != undefined) return
            opponentAttack()
        })
    })
}

/* Takes a ship type and checks if it's the opponent.
** If it is, the dicrease the length of this specific ship in the opponent's ships
** otherwise do the same but in the player's ships */
let isSunk = (shipType, isOpponent) => {
    if(isOpponent){
        return opponentShips[shipType].length === 0
    }
    else{
        return playerShips[shipType].length === 0
    }
}

/* Checks if game is over by checking if all of the ships have no more lives for 
** each player or if no more moves are available on the boards */
let checkWin = () => {
    if(!gameOver){
        if(Object.values(playerShips).every(ship => ship.length === 0)){
            gameOver = true
            $("#modalContainerLost").modal('show')
            let lost = new Audio('resources/audio//lost.mp3')
            lost.play()
            return 0
        }
        else if(Object.values(opponentShips).every(ship => ship.length === 0)){
            gameOver = true
            $("#modalContainerWin").modal('show')
            let won = new Audio('resources/audio//won.mp3')
            won.play()
            return 1
        }
        else if(attackedShips.length === Math.pow(gridSize, 2)+totalMoves){
            gameOver = true
            $("#modalContainerTie").modal('show')
            let lost = new Audio('resources/audio//lost.mp3')
            lost.play()
            return 2
        }
    }
}

/* set a 5min timer for the game if the player wants to */
let updateTimer = () => {
    seconds -= 1
    // Reset the seconds to 59 when they reach 0
    if (seconds < 0) {
        minutes -= 1
        seconds = 59
    }
    let timerText = `${minutes}:${seconds.toString().padStart(2, "0")}`
    $(".timer").text(timerText)

    // If the timer has reached 0, stop the timer
    if (minutes === 0 && seconds === 0) {
        clearInterval(timer)
        $("#modalContainerGameOver").modal('show')
        let lost = new Audio('resources/audio//lost.mp3')
        lost.play()
        location.reload()
    }
}

/* Gets the user input data from the modal in order to accordingly setup the game */
let getUserInfo = () => {
    let form = document.querySelector('#userData')
    $("#submitBtn").click(function(event) {
        event.preventDefault()
        let formData = new FormData(form)
        let name = formData.get('name')
        let size = formData.get('size')
        timerChoice = formData.get('timerChoice')
        size = parseInt(size)
        if(size<5 || size >10){
            alert("Please enter a size between 5 and 10 !")
        }
        else{
            $("#player1").text(name + "'s Board")
            $("#size").text(size)
            $("#myModal").modal('hide')
            setupGame()
        }
    })
}

/* Set ups the game using the information and prepare the events for the play again and quit button */
let setupGame = () => {
        /* play again button */
        $(".playAgainBtn").click(function(event){
            location.reload()
        })
        /* quit button */
        $(".quitBtn").click(function(event){
            $("#modalContainerBye").modal('show')
            let bye = new Audio('resources/audio//bye.mp3')
            bye.play()
        })
        gridSize = $("#size").text()
        initializeGrid(gridSize, player1GameBoard, false)
        initializeGrid(gridSize, player2GameBoard, true)
        createHeaders(gridSize, player1GameBoard)
        createHeaders(gridSize, player2GameBoard)
        clickPlaceShips()
        placeOpponentShips('S', player2GameBoard)
        updateGrid(player2GameBoard, true)
        updateGrid(player1GameBoard, false)
        clickAttack()
}

getUserInfo()



