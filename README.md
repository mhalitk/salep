# salep

salep is a very simple Javascript testing framework you can use on almost all JS platforms. It basically puts itself into global scope and runs while your code is running. It gives all collected test informations as JS object when you stopped it. That's it.

# Install

Install salep globally:
```
npm install --global salep
```

or install as a dependency to your project
```
npm install --save-dev salep
```

# Usage

```javascript
require('salep');
const expect = require('chai').expect;

// This test will be ignored since salep.run() not called yet
salep.test("FunctionToSkip", function() {
  this.case("SkippedCase", function() {
    throw "This case and test will be ignored";
  });
});

// Start salep
salep.run();

salep.test("FunctionToTest", function() {
  // This will be recorded as success
  this.case("SuccessCase", function() {
    expect("Hello World!").to.be.a("string");
  });
  
  // This will be recorded as fail
  this.case("FailCase", function() {
    expect(false).to.be.a("string");
  });
});

// Get results
var result = salep.stop();
console.log(JSON.stringify(result, null, 2));
```

# Events

salep has some events helping you take actions while test continues running.

```javascript
salep.on('fail', function(testCase) {
  console.log('Case [' + testCase.name + '] finished with fail: ' + testCase.reason);
});

salep.on('success', function(testCase) {
  console.log('Case [' + testCase.name + '] finished with success');
});
```