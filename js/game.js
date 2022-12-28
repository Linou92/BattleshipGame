/* initialize the game's variables */
const player1GameBoard = $("#player1-game-board")
const player2GameBoard = $("#player2-game-board")
let isOpponent = false
let gridSize
let opponentShipsPositions = {} // stores positions where we already have ships
let attackedShips = {} // stores positions that opponent has already attacked
let gameOver = false

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

/* total number of possibles moves */
const totalMoves = Object.values(shipsTemplate).reduce(
    (accumulator, currentValue) => accumulator + currentValue["length"],
    initialValue)

let playerScore = 0
let opponentScore = 0

/* creates 2D array */
let initializeGrid = (size, playerBoard, isOpponent) => {
    for(let i=0; i<size; i++){
        let row = $("<tr></tr>")
        for(let j=0; j<size; j++){
            let cell = $("<td></td>")
            cell.text("+")
            cell.addClass("game-cell")
            if(isOpponent == false){
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

/* creates headers for the grid */
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

/* updates the grid with the right content */
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

/* user places his ships */
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

/* returns a integer between 1 and max included */
let getRandomCoordinate = (max) => {
    return Math.floor(Math.random()*Math.floor(max))+1
}

/* randomly places opponent's ships in his grid */
let placeOpponentShips = (char, grid) => {
    // TRY TO AVOID COPY
    let counter = 0
    let shipTypes = Object.keys(opponentShips)
    let shipTypesCopy = shipTypes.slice()
    while(counter < shipTypesCopy.length){
        let shipType = shipTypes[Math.floor(Math.random() * shipTypes.length)]
        let x = getRandomCoordinate(gridSize)
        let y = getRandomCoordinate(gridSize)
        if(!opponentShipsPositions[`${x}-${y}`]){
            $(grid).find("tr").eq(x).find("td").eq(y).text(char)
            $(grid).find("tr").eq(x).find("td").eq(y).addClass("ship " + shipType)
            opponentShipsPositions[`${x}-${y}`] = true
            shipTypes.splice(shipTypes.indexOf(shipType), 1) // not place the same ship twice
            counter++
        }
    }
}   

/* computer's attack */
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

/* player's attack */
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
            checkWin()
            if(checkWin() === 0 || checkWin() === 1 || checkWin() === 2) return
            opponentAttack()
        })
    })
}

/* check if ship is sunk */
let isSunk = (shipType, isOpponent) => {
    if(isOpponent){
        return opponentShips[shipType].length === 0
    }
    else{
        return playerShips[shipType].length === 0
    }
}

/* check winner */
let checkWin = () => {
    let message = $(".message")
    if(!gameOver){
        if(Object.values(playerShips).every(ship => ship.length === 0)){
            gameOver = true
            message.text("Sorry, you lost. Better luck next time !")
            return 0
        }
        else if(Object.values(opponentShips).every(ship => ship.length === 0)){
            gameOver = true
            message.text("Congrats you won !")
            return 1
        }
        else if(attackedShips.length === Math.pow(gridSize, 2)+totalMoves){
            gameOver = true
            message.text("No more available moves !")
            return 2
        }
    }
}

/* play again button */
let playAgain = () => {
    $(".playAgainBtn").click(function(event){
        location.reload()
    })
}

/* quit button */
let quit = () => {
    $(".quitBtn").click(function(event){
        window.close()
    })
}

/* get data from modal */
let getUserInfo = () => {
    let form = document.querySelector('#userData')
    $("#submitBtn").click(function(event) {
        event.preventDefault()
        let formData = new FormData(form)
        let name = formData.get('name')
        let size = formData.get('size')
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

/* game setup */
let setupGame = () => {
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
playAgain()
quit()



