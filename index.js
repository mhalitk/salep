function Salep() {}

// Event mechanism
var callbacks = {};
Salep.on = function(eventName, callback) {
  if (!callbacks[eventName]) {
    callbacks[eventName] = [];
  }
  callbacks[eventName].push(callback);
};

function emit(eventName, data) {
  if (callbacks[eventName]) {
    callbacks[eventName].forEach(function(callback) {
      callback(data);
    });
  }
}

// Run mechanism
Salep.isRunning = false;
Salep.run = function() {
  Salep.isRunning = true;
}
Salep.stop = function() {
  Salep.isRunning = false;
  var result =  {
    success: successCount,
    fail: failCount,
    skip: skipCount,
    total: totalCount,
    tests: Salep.tests,
    cases: Salep.cases
  };
  successCount = failCount = totalCount = skipCount = 0;
  return result;
}

// Informing logs
var successCount = 0;
var failCount = 0;
var skipCount = 0;
var totalCount = 0;

function testStart(data) {
  emit("testStart", data);
}

function caseStart(data) {
  totalCount++;
  emit("caseStart", data);
}

function fail(data) {
  failCount++;
  emit("fail", data);
}

function success(data) {
  successCount++;
  emit("success", data);
}

function skip(data) {
  skipCount++;
  emit("skip", data);
}

// Testing functionalities
var level = 0;
Salep.tests = [];
Salep.cases = [];

Salep.test = function(name, func) {
  var _test = new Test({
    name: name,
    level: level++
  });
  
  if (this instanceof Test) {
    this.tests.push(_test);
  } else {
    Salep.tests.push(_test);
  }

  testStart(_test);
  if (Salep.isRunning) {
    var a = 5;
    func.call(_test);
  } else {
    _test.skipped = true;
    skip(_test);
  }

  level--;
};

Salep.case = function(name, func) {
  var _case = new Case({
    name: name
  });

  if (this instanceof Test) {
    this.cases.push(_case);
  } else {
    Salep.cases.push(_case);
  }

  caseStart(_case);
  if (Salep.isRunning) {
    try {
      func();
      _case.success = true;
      success(_case);
    } catch (e) {
      _case.success = false;
      fail(_case);
    }
  } else {
    _case.skipped = true;
    _case.success = false;
    skip(_case);
  }
};

// Helper classes
function Test(params) {
  this.name = "";
  this.skipped = false;
  this.level = level;
  this.cases = [];
  this.tests = [];

  Object.defineProperty(this, 'test', {
    value: Salep.test.bind(this),
    enumerable: false,
    configurable: false
  });

  Object.defineProperty(this, 'case', {
    value: Salep.case.bind(this),
    enumerable: false,
    configurable: false
  });

  if (params) for (param in params) {
    if (this.hasOwnProperty(param)) {
      this[param] = params[param];
    }
  }
}

function Case(params) {
  this.name = "";
  this.success = false;
  this.skipped = false;
  this.level = level;

  if (params) for (param in params) {
    if (this.hasOwnProperty(param)) {
      this[param] = params[param];
    }
  }
}

global.salep = Salep;