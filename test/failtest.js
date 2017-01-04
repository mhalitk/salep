require("../src/index.js");

var shouldFailCount = 0;
var shouldSkipCount = 0;
var shouldSuccessCount = 0;

salep.run();

salep.test("A test without any case", function() {

});

salep.test("A test with failing cases", function() {
  this.case("Fail case 1", function() {
    throw "Fail 1";
  });
  shouldFailCount++;

  this.case("Fail case 2", function() {
    throw "Fail 2";
  });
  shouldFailCount++;

  this.case("Success cases shouldn't increment fail count", function() {
    // empty means success
  });
  shouldSuccessCount++;
});

salep.case("A salep case to fail", function() {
  throw "Fail 3";
});
shouldFailCount++;

salep.case("A successful salep case", function() {
  // empty
});
shouldSuccessCount++;

var result = salep.stop();

if (result.skip === 0 &&
  result.fail === shouldFailCount &&
  result.success === shouldSuccessCount) {
  exports.success = true;
} else {
  exports.success = false;
}