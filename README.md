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
const expect = require('chai').expect;
const salep = require('salep');

salep.test("FunctionToTest", function() {
  salep.case("Case1", function() {
    expect("Hello World!").to.be.a("string");
  });
  
  // This will fail and throw exception
  salep.case("FailCase", function() {
    expect(false).to.be.a("string");
  });
});
```