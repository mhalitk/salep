/** globals salep */
var testResult = true;

require("../src/index.js");

salep.test("A test", function() {
  var testValue = -1;

  this.beforeEach(function() {
    testValue = 0;
  });

  this.case("Case 1", function() {
    if (testValue !== 0) {
      testResult = false;
    }
    testValue = 1;
  });

  this.case("Case 2", function() {
    if (testValue !== 0) {
      testResult = false;
    }
    testValue = 2;
    throw "Exception";
  });

  salep.skipNext();
  this.case("Case 3", function() {
    testResult = false;
  });
});

salep.test("Negative test", function() {
    this.beforeEach();
    this.case("Case 1", function() {
      // Go for success!
    });

    this.beforeEach(null);
    this.case("Case 2", function() {
      // Go for success!
    });

    this.beforeEach({});
    this.case("Case 3", function() {
      // Go for success!
    });

    this.beforeEach([]);
    this.case("Case 4", function() {
      // Go for success!
    });

    this.beforeEach(1);
    this.case("Case 5", function() {
      // Go for success!
    });
});

if (salep.getResults().fail > 0) {
  testResult = false;
}

exports.success = testResult;