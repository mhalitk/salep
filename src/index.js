/**
 * @module salep
 * @global
 *
 * @desc
 * salep is a singleton object that manages all tests and cases.
 * This object exposed to global scope as 'salep'.
 */
const salep = {
  tests: [],
  cases: [],
  isRunning: false,

  /**
   * @method on
   * 
   * @desc
   * This function enables adding callbacks to events. For one specific
   * event there may be many callbacks.
   * 
   * @param {String}    eventName Event name to add callback
   * @param {Function}  callback  Callback
   * 
   * @example
   * salep.on('fail', function(testCase) {
   *   console.log(testCase.name + ' has failed!');
   * });
   */
  on: function(eventName, callback) {
    if (!callbacks[eventName]) {
      callbacks[eventName] = [];
    }
    callbacks[eventName].push(callback);
  },

  /**
   * @method run
   *
   * @desc
   * Enables salep testing. All the tests and cases before salep.run method
   * executed will be counted and recorded as skipped.
   */
  run: function() {
    salep.isRunning = true;
  },

  /**
   * @method stop
   *
   * @desc
   * Disables salep testing and returns all the collected information starting
   * from last stop function invoked or the beginning of program (if stop function
   * not invoked ever). After stop function invoked all following tests and cases 
   * will be counted and recorded as skipped.
   * 
   * @returns {Object} result         JS object containing test information
   */
  stop: function() {
    salep.isRunning = false;
    var result =  {
      success: successCount,
      fail: failCount,
      skip: skipCount,
      total: totalCount,
      tests: salep.tests,
      cases: salep.cases
    };
    successCount = failCount = totalCount = skipCount = 0;
    return result;
  },

  /**
   * @method test
   * 
   * @desc
   * This function creates a new test inside salep scope with given name
   * and test function. Tests doesn't have success or fail status, they have
   * cases. All the cases written inside test function is belong to named test.
   * 
   * @param {String}    name  Name of the test
   * @param {Function}  func  Test function
   * 
   * @fires module:salep#testStart
   * @fires module:salep#skip
   * 
   * @example
   * salep.test('NewTest', function() {
   *   this.case('NewCase of NewTest', function() {
   *     // Case code goes here
   *   });
   * });
   */
  test: function(name, func) {
    var _test = new Test({
      name: name,
      level: level++
    });
    
    if (this instanceof Test) {
      this.tests.push(_test);
    } else {
      salep.tests.push(_test);
    }

    testStart(_test);
    if (salep.isRunning) {
      func.call(_test);
    } else {
      _test.skipped = true;
      skip(_test);
    }

    level--;
  },

  /**
   * @method case
   * 
   * @desc
   * This function creates a new case inside salep scope with given name
   * and case function. Cases created in salep scope doesn't have parent.
   * When case function invoked if exception is thrown case would marked
   * as failed otherwise case marked as succeded.
   * 
   * @param {String}    name  Name of the case
   * @param {Function}  func  Case function
   * 
   * @fires module:salep#caseStart
   * @fires module:salep#success
   * @fires module:salep#fail
   * @fires module:salep#skip
   * 
   * @example
   * salep.case('NewFailCaseInsalepScope', function() {
   *   throw "Exception goes here";
   * });
   */
  case: function(name, func) {
    var _case = new Case({
      name: name
    });

    if (this instanceof Test) {
      this.cases.push(_case);
    } else {
      salep.cases.push(_case);
    }

    caseStart(_case);
    if (salep.isRunning) {
      try {
        func();
        _case.success = true;
        success(_case);
      } catch (e) {
        _case.success = false;
        _case.reason = e;
        fail(_case);
      }
    } else {
      _case.skipped = true;
      _case.success = false;
      skip(_case);
    }
  }
};

global.salep = salep;

// Event mechanism
var successCount = 0;
var failCount = 0;
var skipCount = 0;
var totalCount = 0;
var callbacks = {};

function emit(eventName, data) {
  if (callbacks[eventName]) {
    callbacks[eventName].forEach(function(callback) {
      callback(data);
    });
  }
}

function testStart(test) {
  /**
   * This event fires before starting a test function.
   *
   * @event module:salep#testStart
   * @type {Test}
   */
  emit("testStart", test);
}

function caseStart(testCase) {
  totalCount++;
  /**
   * This event fires before starting a test case function.
   * 
   * @event module:salep#caseStart
   * @type {Case}
   */
  emit("caseStart", testCase);
}

function fail(testCase) {
  failCount++;
  /**
   * This event fires when a test case fails.
   * 
   * @event module:salep#fail
   * @type {Case}
   */
  emit("fail", testCase);
}

function success(testCase) {
  successCount++;
  /**
   * This event fires when a test case succeeds.
   * 
   * @event module:salep#success
   * @type {Case}
   */
  emit("success", testCase);
}

function skip(testOrCase) {
  skipCount++;
  /**
   * This event fires when a test or case has skipped.
   * 
   * @event module:salep#skip
   * @type {Test|Case}
   */
  emit("skip", testOrCase);
}

// Testing functionalities
var level = 0;

// Helper classes
// @todo Write documentation of Test class
function Test(params) {
  this.name = "";
  this.skipped = false;
  this.level = level;
  this.cases = [];
  this.tests = [];

  Object.defineProperty(this, 'test', {
    value: salep.test.bind(this),
    enumerable: false,
    configurable: false
  });

  Object.defineProperty(this, 'case', {
    value: salep.case.bind(this),
    enumerable: false,
    configurable: false
  });

  if (params) for (var param in params) {
    if (this.hasOwnProperty(param)) {
      this[param] = params[param];
    }
  }
}

// @todo Write documentation of Case class
function Case(params) {
  this.name = "";
  this.success = false;
  this.skipped = false;
  this.level = level;
  this.reason = "";
  this.parent = null;

  if (params) for (var param in params) {
    if (this.hasOwnProperty(param)) {
      this[param] = params[param];
    }
  }
}