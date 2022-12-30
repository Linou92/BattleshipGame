QUnit.module('Game functions tests', function(hooks) {

    QUnit.test('function returns true when ship has been sunk', function(assert) {
        // Set up the test data
        let shipType = 'cruiser'
        let isOpponent = false
        playerShips[shipType] = []
        // Call the isSunk function
        let result = isSunk(shipType, isOpponent)
        // Assert that the function returns true
        assert.ok(result, 'function returns true')
    })
    
    QUnit.test('function returns false when ship has not been sunk', function(assert) {
        // Set up the test data
        let shipType = 'cruiser'
        let isOpponent = false
        playerShips[shipType] = ['battleship', 'carrier', 'destroyer']
        // Call the isSunk function
        let result = isSunk(shipType, isOpponent)
        // Assert that the function returns false
        assert.ok(!result, 'function returns false')
    })
    
    QUni.test('function returns correct value for opponent ship', function(assert) {
        // Set up the test data
        let shipType = 'cruiser'
        let isOpponent = true
        opponentShips[shipType] = ['battleship', 'carrier', 'destroyer']
        // Call the isSunk function
        let result = isSunk(shipType, isOpponent)
        // Assert that the function returns false
        assert.ok(!result, 'function returns false')
    })
      
})
    