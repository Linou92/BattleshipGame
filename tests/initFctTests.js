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

  QUnit.test('seconds are decremented correctly', function(assert) {
    // Set the timer to 2 minutes and 30 seconds
    minutes = 2
    seconds = 30
    // Call the updateTimer function
    updateTimer()
    // Assert that the seconds have been decremented by 1
    assert.equal(seconds, 29, 'seconds are decremented correctly')
  })

  QUnit.test('minutes are decremented and seconds are reset to 59 when seconds reach 0', function(assert) {
    // Set the timer to 1 minute and 0 seconds
    minutes = 1
    seconds = 0
    // Call the updateTimer function
    updateTimer()
    // Assert that the minutes have been decremented by 1 and the seconds have been reset to 59
    assert.equal(minutes, 0, 'minutes are decremented correctly')
    assert.equal(seconds, 59, 'seconds are reset to 59')
  })
})
  