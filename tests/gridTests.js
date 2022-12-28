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
      let rows = playerBoard.find('tr');
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
        let rows = playerBoard.find('tr');
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
        initializeGrid(size, playerBoard, isOpponent);
        // Assert
        let rows = playerBoard.find('tr')
        assert.equal(rows.length, 0, 'No rows created')
    })   
  
  })
  
 /* QUnit.module('Grid header creation tests', function(hooks) {

    // Set up a test that checks the initial state of the grid
    QUnit.test('Initial header creation test', function(assert) {
      // Arrange
      let size = 5;
      let playerBoard = $('<table></table>');
      for (let i = 0; i < size; i++) {
        playerBoard.append($('<tr></tr>'));
      }
  
      // Act
      createHeaders(size, playerBoard);
  
      // Assert
      let headerRow = playerBoard.find('tr:first-child')
      assert.equal(headerRow.length, 1, 'Header row created')
      let cells = headerRow.find('td')
      assert.equal(cells.length, size + 1, 'Correct number of cells in header row')
      cells.each(function(i, cell) {
        assert.ok($(cell).hasClass('header-cell'), 'Cell ' + (i)+ ' has header-cell class')
        if (i > 0) {
          assert.equal($(cell).text(), (i).toString(), 'Cell ' + (i) + ' has correct text')
        }
      })
  
      let rows = playerBoard.find('tr:not(:first-child)')
      rows.each(function(i, row) {
        let cells = $(row).find('td')
        assert.equal(cells.length, size + 1, 'Correct number of cells in row ' + i)
        assert.ok($(cells[0]).hasClass('header-cell'), 'First cell in row has header-cell class')
        assert.equal($(cells[0]).text(), (i + 1).toString(), 'First cell in row has correct text')
      })
    })
  
    // Add additional test cases here as needed
  
  })*/


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
        if (i == 0) {
          assert.equal($(cell).text(), 'S', 'Cell has correct text')
        } else {
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
