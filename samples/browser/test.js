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