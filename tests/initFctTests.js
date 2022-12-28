QUnit.module('Small functions tests', function(hooks) {

    // Set up a test that checks the random coordinate when max is 5
    QUnit.test('Random coordinate test (max = 5)', function(assert) {
      // Arrange
      let max = 5
  
      // Act
      let coordinate = getRandomCoordinate(max)
  
      // Assert
      assert.ok(coordinate >= 1 && coordinate <= max, 'Coordinate is between 1 and max')
    })
})
  