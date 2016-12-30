# salep
A very simple Javascript unit test tool

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