(function(){
  /**
   * @namespace
   * @desc
   * salep is a singleton object that manages all tests and cases.
   * This object exposed to global scope as 'salep'.
   */
  const salep = {
    tests: [],
    cases: [],
    isRunning: true,

    /**
     * @method on
     * @memberof salep
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
     * @method off
     * @memberof salep
     *
     * @desc
     * This function allows removing callbacks from events. Every callback
     * added with 'on' function can be removed with this function.
     *
     * @param {String}    eventName         Event name to remove callback from
     * @param {Function}  callbackToRemove  Callback to remove
     *
     * @example
     * function myCallback(test) {
     *   // do some stuff
     * }
     * salep.on('testStart', myCallback);
     * ...
     * salep.off('testStart', myCallback);
     */
    off: function(eventName, callbackToRemove) {
      if (callbacks[eventName]) {
        for (var i = 0; i < callbacks[eventName].length; i++) {
          if (callbacks[eventName][i] === callbackToRemove) {
            callbacks[eventName].splice(i, 1);
            break
          }
        }
      }
    },

    /**
     * @method run
     * @memberof salep
     *
     * @desc
     * Enables salep testing. All the tests and cases before salep.run method
     * executed will be counted and recorded as skipped.
     * 
     * @deprecated
     * Since 0.2.0, salep starts in running mode as default. You don't need to
     * use run function unless you used stop function. 
     */
    run: function() {
      salep.isRunning = true;
    },

    /**
     * @method stop
     * @memberof salep
     *
     * @desc
     * Disables salep testing and returns all the collected information starting
     * from last stop function invoked or the beginning of program (if stop function
     * not invoked ever). After stop function invoked all following tests and cases 
     * will be counted and recorded as skipped.
     * 
     * @returns {Result} Result object containing test results
     * 
     * @deprecated 
     * Since 0.2.0, when used it will cause salep skip tests and cases,
     * this behaviour will continue until run function called.
     */
    stop: function() {
      salep.isRunning = false;
      var result = new Result({
        success: successCount,
        fail: failCount,
        skip: skipCount,
        total: totalCount,
        tests: salep.tests,
        cases: salep.cases
      });
      successCount = failCount = totalCount = skipCount = 0;
      return result;
    },

    /**
     * @method getResults
     * @memberof salep
     * 
     * @desc
     * This method will return results of tests and cases from
     * the beginning. If salep.stop is called at some point return value
     * will just have the results after that call.
     * 
     * @return {Result} Result object containing test results
     */
    getResults: function() {
      return new Result({
        success: successCount,
        fail: failCount,
        skip: skipCount,
        total: totalCount,
        tests: salep.tests,
        cases: salep.cases
      });
    },

    /**
     * @method test
     * @memberof salep
     * 
     * @desc
     * This function creates a new test inside salep scope with given name
     * and test function. Tests doesn't have success or fail status, they have
     * cases. All the cases written inside test function is belong to named test.
     * 
     * @param {String}    name  Name of the test
     * @param {Function}  func  Test function
     * 
     * @fires salep#testStart
     * @fires salep#skip
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

      if (salep.isRunning && !skipNextEnabled) {
        testStart(_test);
        func.call(_test);
        _test.cases.forEach(function(_case) {
          if (_case.skipped) {
            skip(_case);
            return;
          } else {
            caseStart(_case);
            try {
              _test.beforeEachCb && _test.beforeEachCb();
              _case.caseFunction && _case.caseFunction();
              _test.afterEachCb && _test.afterEachCb();

              _case.success = true;
              success(_case);
            } catch (e) {
              _case.success = false;
              _case.reason = e;
              fail(_case);
            }
          }
        });
      } else {
        _test.skipped = true;
        skipNextEnabled = false;
        skip(_test);
      }

      level--;
    },

    /**
     * @method skipNext
     * @memberof salep
     * 
     * @desc
     * This function helps skipping tests/cases. If you want to skip a case or
     * test, run this function right before test or case definition.
     * 
     * @example
     * salep.skipNext();
     * salep.case("salep will skip this case", function() {
     *   if (!someFunction()) {
     *     throw "Exception";
     *   }
     * });
     */
    skipNext: function() {
      skipNextEnabled = true;
    },

    /**
     * @method case
     * @memberof salep
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
     * @fires salep#caseStart
     * @fires salep#success
     * @fires salep#fail
     * @fires salep#skip
     * 
     * @deprecated
     * since v0.2.2
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
      salep.cases.push(_case);

      if (salep.isRunning && !skipNextEnabled) {
        caseStart(_case);
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
        skipNextEnabled = false;
        skip(_case);
      }
    }
  };

  if (typeof global !== 'undefined') {
    global.salep = salep;
  }
  if (typeof window !== 'undefined') {
    window.salep = salep;
  }

  // Privates
  var skipNextEnabled = false;

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
     * @event salep#testStart
     * @type {Test}
     */
    emit("testStart", test);
  }

  function caseStart(testCase) {
    totalCount++;
    /**
     * This event fires before starting a test case function.
     * 
     * @event salep#caseStart
     * @type {Case}
     */
    emit("caseStart", testCase);
  }

  function fail(testCase) {
    failCount++;
    /**
     * This event fires when a test case fails.
     * 
     * @event salep#fail
     * @type {Case}
     */
    emit("fail", testCase);
  }

  function success(testCase) {
    successCount++;
    /**
     * This event fires when a test case succeeds.
     * 
     * @event salep#success
     * @type {Case}
     */
    emit("success", testCase);
  }

  function skip(testOrCase) {
    if (testOrCase instanceof Case) {
      skipCount++;    
      totalCount++;
    }
    /**
     * This event fires when a test or case has skipped.
     * 
     * @event salep#skip
     * @type {Test|Case}
     */
    emit("skip", testOrCase);
  }

  // Testing functionalities
  var level = 0;

  /**
   * @class
   * 
   * This class represents a test which has a name and function.
   * Test function runs in a Test object scope created with given name.
   * So when you use 'this' inside test funcion it doesn't represents
   * global object instead it points to test object. This provides you
   * to add properties to test inside test cases and access them when you
   * get results. 
   * 
   * @example
   * salep.test("A test", function() {
   *    salep.case("object creation with string", function() {
   *      test.serverStatus = getServerStatus();
   *      // Continue to case
   *    });
   * });
   * 
   * ...
   * 
   * var result = salep.getResults();
   * result.tests.forEach(function(test) {
   *   if (test.name === "A test") {
   *     console.log("Server status was '" + test.serverStatus + "' when test ran");
   *   }
   * });
   */
  function Test(params) {
    /**
     * Name of the test.
     * 
     * @property {string} name
     */
    this.name = "";

    /**
     * @desc
     * Indicates if test skipped or not. If a test is skipped all cases inside
     * test will not be counted in anywhere.
     * 
     * @type {boolean}
     */
    this.skipped = false;

    /**
     * @desc
     * Indicates nesting level of test. A test can have tests too, every nested
     * case will have +1 level of its parent test. Root tests, created using
     * salep.test, have level of 0.
     * 
     * @type {number}
     */
    this.level = level;

    /**
     * @desc
     * This property is cases array which hold all cases defined in test.
     * 
     * @type {Case[]}
     */
    this.cases = [];

    /**
     * @desc
     * This property holds all nested tests defined in current test. 
     * All nested tests will have +1 level of current test.
     * 
     * @type {Test[]}
     */
    this.tests = [];

    /**
     * @method
     * 
     * @desc
     * This function creates a new test inside current test scope with given name
     * and test function.
     * 
     * @param {String}    name  Name of the test
     * @param {Function}  func  Test function
     * 
     * @fires salep#testStart
     * @fires salep#skip
     * 
     * @example
     * salep.test('A test', function() {
     *   this.test('An inner test', function() {
     *     this.case('This case belongs to inner test', function() {
     *       // Case 
     *     });
     *   });
     * });
     * 
     */
    this.test = salep.test.bind(this);

    this.beforeEachCb = null;
    this.afterEachCb = null;

    if (params) for (var param in params) {
      if (this.hasOwnProperty(param)) {
        this[param] = params[param];
      }
    }
  }

  /**
   * @method
   * 
   * @desc
   * This function allows setting a callback that runs before each
   * case. With this functionality you can set up environment you
   * will use in cases. If before each callback fails (throws 
   * exception), it causes all cases to be counted as failed too.
   * Before each callback should be set before all case definitions.
   * 
   * @example
   * salep.test("A test", function() {
   *   var instance = null;
   *   this.beforeEach(function() {
   *     instance = new ClassToTest();
   *   });
   *   
   *   this.case("foo case", function() {
   *     // This instance created before case runs
   *     instance.foo();
   *   });
   * 
   *   this.case("bar case", function() {
   *     // This instance isn't the same instance with foo case's instance
   *     instance.bar();
   *   });
   * });
   * 
   */
  Test.prototype.beforeEach = function(beforeEachCb) {
    if (beforeEachCb instanceof Function) {
      this.beforeEachCb = beforeEachCb;
    }
  };

  /**
   * @method
   * 
   * @desc
   * This function allows setting a callback that runs after each case.
   * If after each callback fails (throws exception), it causes all cases
   * to be counted as failed too. After each callback should be set 
   * before all case definitons.
   * 
   * @example
   * salep.test("File test", function() {
   *   var filePath = "path/to/file";
   * 
   *   // After each case remove file
   *   this.afterEach(function() {
   *     removeFile(filePath);
   *   });
   *   
   *   this.case("write to file case", function() {
   *     // Assume below function creates file in filePath
   *     writeToFile(filePath, "Text");
   *   });
   * });
   * 
   */
  Test.prototype.afterEach = function(afterEachCb) {
    if (afterEachCb instanceof Function) {
      this.afterEachCb = afterEachCb;
    }
  }

  /**
   * @method
   * 
   * @desc
   * This function creates a new case inside current test scope with given name
   * and case function.
   * 
   * @param {String}    name  Name of the case
   * @param {Function}  func  Case function
   * 
   * @fires salep#caseStart
   * @fires salep#success
   * @fires salep#fail
   * @fires salep#skip
   * 
   * @example
   * salep.test('A test', function() {
   *   this.case('Should succeed', function() {
   *     // Case code
   *   });
   * });
   */
  Test.prototype.case = function(name, func) {
    var _case = new Case({
      name: name,
      parent: this,
      caseFunction: func
    });
    this.cases.push(_case);

    if (!salep.isRunning || skipNextEnabled) {
      _case.skipped = true;
      _case.success = false;
      skipNextEnabled = false;
    }
  }

  /**
   * @class
   * 
   * @desc
   * This class represents case written inside tests and salep scope.
   * For every case ran or skipped in salep, there is a case object created and
   * stored. Those case objects are accessible from results.
   * 
   * @example
   * salep.test("A test", function() {
   *   salep.case("Case 1", function() {
   *     // Continue to case
   *   });
   * });
   * 
   * ...
   * 
   * var result = salep.getResults();
   * result.tests.forEach(function(test) {
   *   test.cases.forEach(function(case) {
   *     if (case.success === false) {
   *       console.log("Case [" + case.name + "] failed, reason: " + case.reason);
   *     }
   *   });
   * });
   * 
   */
  function Case(params) {
    /**
     * @desc
     * Name of the case
     * 
     * @type {string}
     */
    this.name = "";

    /**
     * @desc
     * Success status of case, true if case succeeded false otherwise
     * 
     * @type {boolean}
     */
    this.success = false;

    /**
     * @desc
     * Indicates if case skipped or not.
     * 
     * @type {boolean}
     */
    this.skipped = false;

    this.level = level;

    /**
     * @desc
     * Declares the reason of failure if case is failed. If case is
     * succeded or skipped this property equals to empty string
     * 
     * @type {string}
     */
    this.reason = "";

    /**
     * @desc
     * Indicates the parent test of case.
     * 
     * @type {Test}
     */
    this.parent = null;

    this.caseFunction = null;

    if (params) for (var param in params) {
      if (this.hasOwnProperty(param)) {
        this[param] = params[param];
      }
    }
  }

  /**
   * @class
   * 
   * @desc
   * This class represents results of salep tests. It helps you
   * see summary of tests with fail, success, skip and total counts.
   * Result also has all tests and their case objects, so if it is
   * needed you can iterate on them and see which test have which
   * cases, which case failed and why, etc.
   */
  function Result(params) {
    /**
     * @desc
     * Indicates number of successful cases
     * 
     * @type {number}
     */
    this.success = 0;
    /**
     * @desc
     * Indicates number of failed cases
     * 
     * @type {number}
     */
    this.fail = 0;
    /**
     * @desc
     * Indicates number of skipped cases
     * 
     * @type {number}
     */
    this.skip = 0;
    /**
     * @desc
     * Indicates number of total cases
     * 
     * @type {number}
     */
    this.total = 0;
    /**
     * @desc
     * This property holds all tests written in salep scope.
     * Nested tests written inside tests will be nested. Just salep.test's
     * are listed here. 
     * 
     * @type {Test[]}
     */
    this.tests = null;
    /**
     * @desc
     * This property holds all test cases written in salep scope. Cases
     * inside tests is not listed inside this property. Just salep.case's
     * are listed here.
     * 
     * @type {Case[]}
     */
    this.cases = null;

    if (params) for (var param in params) {
      if (this.hasOwnProperty(param)) {
        this[param] = params[param];
      }
    }
  }
})();