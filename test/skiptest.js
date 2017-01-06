/** globals salep */
require("../src/index.js");

var shouldSkipCount = 0;
var shouldFailCount = 0;
var shouldSuccessCount = 0;
var shouldTotalCount = 0;

// Skipping salep 
salep.skipNext();
salep.test("should skip this test", function() {
  this.case("this case shouldn't increment skip count since test fully skipped", function() {
    // empty
  });

  this.case("inner cases shouldn't affect", function() {
    // empty
  });

  salep.case("salep cases inside skipped test shouldn't affect too", function() {
    // empty
  });
});
shouldSkipCount++;
shouldTotalCount++

// Skipping salep cases
salep.skipNext();
salep.case("should skip this case and count it as skipped", function() {
  throw "This exception shouldn't affect skip status";
});
shouldSkipCount++;
shouldTotalCount++;

salep.case("this shouldn't skip", function() {
  // empty
});
shouldSuccessCount++;
shouldTotalCount++;

var result = salep.getResults();

if (result.skip     === shouldSkipCount &&
    result.fail     === shouldFailCount &&
    result.success  === shouldSuccessCount &&
    result.total    === shouldTotalCount) {
  exports.success = true;
} else {
  exports.success = false;
}