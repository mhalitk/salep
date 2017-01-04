require("../src/index.js");

var shouldSkipCount = 0;
var shouldFailCount = 0;
var shouldSuccessCount = 0;
var totalCount = 0;

// Skipping salep tests
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

// Skipping salep cases
salep.case("should skip this case and count it as skipped", function() {
  throw "This exception shouldn't affect skip status";
});
shouldSkipCount++;

salep.run();
var result = salep.stop();

if (result.skip === shouldSkipCount &&
  result.fail === shouldFailCount &&
  result.success === shouldSuccessCount) {
  exports.success = true;
} else {
  exports.success = false;
}