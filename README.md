# salep

[![Build Status](https://travis-ci.org/mhalitk/salep.svg?branch=master)](https://travis-ci.org/mhalitk/salep) [![codecov](https://codecov.io/gh/mhalitk/salep/branch/master/graph/badge.svg)](https://codecov.io/gh/mhalitk/salep) [![dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)](https://github.com/mhalitk/salep) [![GitHub version](https://badge.fury.io/gh/mhalitk%2Fsalep.svg)](https://github.com/mhalitk/salep/releases) [![license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/mhalitk/salep/blob/master/LICENSE)

salep is platform independent Javascript testing framework. It basically puts itself into global scope and runs while your code is running. It gives all collected test informations as JS object whenever you requested.

# Install

## Node.js
```
npm install salep
```
## Smartface

If you are developing a Smartface application go to `scripts` folder of your workspace and install `salep`.
```
cd ~/workspace/scripts && npm install salep
```
## Other Platforms

You can get standalone Javascript distribution from [releases](https://github.com/mhalitk/salep/releases) and run on your Javascript system before `salep` test codes.

# Usage

Here is a sample test code using salep, for more information you can check [api documentation](https://mhalitk.github.io/salep/).

```javascript
require('salep');

function add(a, b) {
  return a + b;
}

// This function has bug
function fibonacci(n) {
  if (n <= 2) {
    return 0;
  } else {
    return fibonacci(n - 1) + fibonacci(n - 2);
  }
}

// Set event handlers
salep.on("fail", function(testCase) {
  console.log("Case [" + testCase.name + "] finished with fail: " + testCase.reason);
});

salep.on("success", function(testCase) {
  console.log("Case [" + testCase.name + "] finished with success");
});

// Write tests and cases
salep.test("Add/Fibonacci Functions Test", function() {
  // This will be recorded as success
  this.case("add(3,5) should return 8", function() {
    var result = add(3,5);
    if (result !== 8) {
      throw "add(3,5) returned '" + result + "', expected value was '8'";
    }
  });
  
  // This will be recorded as fail
  this.case("fibonacci(7) should be equal to 13", function() {
    var result = fibonacci(7);
    if (result !== 13) {
      throw "fibonacci(7) returned '" + result + "', expected value was '13'";
    }
  });
});

// Get results
var result = salep.getResults();
console.log(result.fail + " Failed");
console.log(result.success + " Succeeded");
console.log(result.skip + " Skipped");
console.log(result.total + " Total");
```

# License

[MIT](https://github.com/mhalitk/salep/blob/master/LICENSE)
