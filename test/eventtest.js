var testResult = true;

require("../src/index.js");

var caseStartEventCount = 0;
var shouldCaseStartEventCount = 0;
var failEventCount = 0;
var shouldFailEventCount = 0;
var skipEventCount = 0;
var shouldSkipEventCount = 0;
var successEventCount = 0;
var shouldSuccessEventCount = 0;
var testStartEventCount = 0;
var shouldTestStartEventCount = 0;

var disabledCallbackCount = 0;
var shouldDisabledCallbackCount = 0;

salep.on("caseStart", function() {
  caseStartEventCount++;
});
salep.on("fail", function() {
  failEventCount++;
});
salep.on("skip", function() {
  skipEventCount++;
});
salep.on("success", function() {
  successEventCount++;
});
salep.on("testStart", function() {
  testStartEventCount++;
});

function disableThisCb() {
  disabledCallbackCount++;
}
salep.on("caseStart", disableThisCb);
salep.off("caseStart", disableThisCb);
salep.on("fail", disableThisCb);
salep.off("fail", disableThisCb);
salep.on("skip", disableThisCb);
salep.off("skip", disableThisCb);
salep.on("success", disableThisCb);
salep.off("success", disableThisCb);
salep.on("testStart", disableThisCb);
salep.off("testStart", disableThisCb);

salep.stop();
salep.test("Will skip this test", function() {
  this.case("Shouldn't increment skip count since this case inside a skipped test", function() {

  });
});
shouldSkipEventCount++;
salep.run();

salep.skipNext();
salep.case("Will skip this case", function() {
  
});
shouldSkipEventCount++;

salep.test("Test with inner test", function() {
  this.test("Inner tests will cause testStart event too", function() {
    this.case("Case of inner test", function() {

    });
    shouldCaseStartEventCount++;
    shouldSuccessEventCount++;
  });

  this.case("Fail test", function() {
    throw "Fail me!";
  });
  shouldCaseStartEventCount++;
  shouldFailEventCount++;

  shouldTestStartEventCount++;
});
shouldTestStartEventCount++;

var result = salep.stop();

if (caseStartEventCount !== shouldCaseStartEventCount ||
    failEventCount !== shouldFailEventCount ||
    skipEventCount !== shouldSkipEventCount ||
    successEventCount !== shouldSuccessEventCount ||
    testStartEventCount !== shouldTestStartEventCount ||
    disabledCallbackCount !== shouldDisabledCallbackCount) {
  testResult = false;
}

exports.success = testResult;