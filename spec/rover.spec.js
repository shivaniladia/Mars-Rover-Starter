const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  // 7 tests here!

  it("constructor sets position and default values for mode and generatorWatts", function () {
    let roverTest = new Rover(98382); 
    let expectedValues = [roverTest.mode, roverTest.generatorWatts];
    expect(expectedValues).toEqual(['NORMAL', 110]);
  });

  it("response returned by receiveMessage contains the name of the message", function () {
    let roverTest = new Rover(99999);
    let testCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let testMessage = new Message('ANY TEST MESSAGE', testCommands);
    let testResponse = roverTest.receiveMessage(testMessage);
    expect(testResponse.message).toBe('ANY TEST MESSAGE');
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function () {
    let roverTest = new Rover(88888);
    let testCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('STATUS_CHECK')];
    let testMessage = new Message ('MORE TEST MESSAGE', testCommands);
    let testResponse = roverTest.receiveMessage(testMessage);
    expect(testResponse.results.length).toBe(2);
  });

  it("responds correctly to the status check command", function () {
    let roverTest = new Rover(77777);
    let testCommands = [new Command('STATUS_CHECK')];
    let testMessage = new Message ('ANYMORE TEST MESSAGE', testCommands);
    let testResponse = roverTest.receiveMessage(testMessage);
    let testStatus = testResponse.results[0].roverStatus;
    let testStatusValues = [testStatus.position, testStatus.mode, testStatus.generatorWatts];
    expect(testStatusValues).toEqual([77777, 'NORMAL', 110]);
  });

  it("responds correctly to the mode change command", function () {
    let roverTest = new Rover(66666);
    let testCommands = [new Command('STATUS_CHECK'), new Command('MODE_CHANGE', 'LOW_POWER')];
    let testMessage = new Message ('Status Check and Mode Change Test', testCommands);
    let testResponse = roverTest.receiveMessage(testMessage);
    let testResultStatusValues = [testResponse.results[1].completed, roverTest.mode]
    expect(testResultStatusValues).toEqual([true, 'LOW_POWER']);
  });

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function () {
    let roverTest = new Rover(55555);
    let testCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MOVE', 44444)];
    let testMessage = new Message ('Test Mode Change and Move with Low Power', testCommands);
    let testResponse = roverTest.receiveMessage(testMessage);
    let testResultStatusValues = [testResponse.results[1].completed, roverTest.position]
    expect(testResultStatusValues).toEqual([false, 55555]);
  });
  
  it("responds with the position for the move command", function () {
    let roverTest = new Rover(33333);
    let testCommands = [new Command('MODE_CHANGE', 'LOW_POWER'), new Command('MODE_CHANGE', 'NORMAL'), new Command('MOVE', 22222)];
    let testMessage = new Message ('Test Mode and Move', testCommands);
    let testResponse = roverTest.receiveMessage(testMessage);
    let testResultStatusValues = [testResponse.results[2].completed, roverTest.position]
    expect(testResultStatusValues).toEqual([true, 22222]);
  });

});
