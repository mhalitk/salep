/** globals salep */
require("../src/index.js");

var shouldFailCount = 0;
var shouldSkipCount = 0;
var shouldSuccessCount = 0;
var shouldTotalCount = 0;

var testResult = true;

salep.test("A test without any case", function() {

});

salep.test("A test with failing cases", function() {
  this.case("Fail case 1", function() {
    throw "Fail 1";
  });
  shouldFailCount++;
  shouldTotalCount++;

  this.case("Fail case 2", function() {
    throw "Fail 2";
  });
  shouldFailCount++;
  shouldTotalCount++;

  this.case("Success cases shouldn't increment fail count", function() {
    // empty means success
  });
  shouldSuccessCount++;
  shouldTotalCount++;
});

salep.case("A salep case to fail", function() {
  throw "Fail 3";
});
shouldFailCount++;
shouldTotalCount++;

salep.case("A successful salep case", function() {
  // empty
});
shouldSuccessCount++;
shouldTotalCount++;

var result = salep.stop();

result.tests.forEach(function(test) {
  test.cases.forEach(function(_case) {
    if (_case.parent !== test) {
      testResult = false;
    }
  });
});

if (result.skip     === shouldSkipCount     &&
    result.fail     === shouldFailCount     &&
    result.success  === shouldSuccessCount  &&
    result.total    === shouldTotalCount    &&
    testResult      === true) {
  exports.success = true;
} else {
  exports.success = false;
}