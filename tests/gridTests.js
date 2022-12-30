QUnit.module('Game grid initialization tests', function(hooks) {

  // Set up a test that checks the initial state of the grid
  QUnit.test('Initial grid state test player1', function(assert) {
    // Arrange
    let size = 5
    let playerBoard = $('<table></table>')
    let isOpponent = false
    // Act
    initializeGrid(size, playerBoard, isOpponent)
    // Assert
    let rows = playerBoard.find('tr')
    assert.equal(rows.length, size, 'Correct number of rows')
    rows.each(function(i, row) {
      let cells = $(row).find('td')
      assert.equal(cells.length, size, 'Correct number of cells in row ' + i)
      cells.each(function(j, cell) {
        assert.ok($(cell).hasClass('game-cell'), 'Cell has game-cell class')
        assert.ok($(cell).hasClass('player1'), 'Cell has player1 class')
        assert.equal($(cell).text(), '+', 'Cell has correct text')
      })
    })
  })
  
  QUnit.test('Initial grid state test player2', function(assert) {
    // Arrange
    let size = 3
    let playerBoard = $('<table></table>')
    let isOpponent = true
    // Act
    initializeGrid(size, playerBoard, isOpponent)
    // Assert
    let rows = playerBoard.find('tr')
    assert.equal(rows.length, size, 'Correct number of rows')
    rows.each(function(i, row) {
      let cells = $(row).find('td')
      assert.equal(cells.length, size, 'Correct number of cells in row ' + i)
      cells.each(function(j, cell) {
        assert.ok($(cell).hasClass('game-cell'), 'Cell has game-cell class')
        assert.ok($(cell).hasClass('player2'), 'Cell has player2 class')
        assert.equal($(cell).text(), '+', 'Cell has correct text')
      })
    })
  })

  QUnit.test('Invalid grid size test', function(assert) {
    // Arrange
    let size = -5
    let playerBoard = $('<table></table>')
    let isOpponent = false
    // Act
    initializeGrid(size, playerBoard, isOpponent)
    // Assert
    let rows = playerBoard.find('tr')
    assert.equal(rows.length, 0, 'No rows created')
  })   
  
  // Set up a test that checks the initial state of the grid
  QUnit.test('Initial grid update test', function(assert) {
    // Arrange
    let table = $('<table><tr><td>S</td><td>+</td></tr><tr><td>+</td><td>+</td></tr></table>')
    let isOpponent = false
    // Act
    updateGrid(table, isOpponent)
    // Assert
    let cells = table.find('td')
    assert.equal(cells.length, 4, 'Correct number of cells')
    cells.each(function(i, cell) {
      if(i == 0){
        assert.equal($(cell).text(), 'S', 'Cell has correct text')
      } 
      else{
        assert.equal($(cell).text(), '+', 'Cell has correct text')
      }
    })
  })

  // Set up a test that checks the updated state of the grid
  QUnit.test('Updated grid update test', function(assert) {
    // Arrange
    let table = $('<table><tr><td>S</td><td>+</td></tr><tr><td>+</td><td>+</td></tr></table>')
    let isOpponent = true
    // Act
    updateGrid(table, isOpponent)
    // Assert
    let cells = table.find('td')
    assert.equal(cells.length, 4, 'Correct number of cells')
    cells.each(function(i, cell) {
      assert.equal($(cell).text(), '+', 'Cell has correct text')
    })
  })
})

