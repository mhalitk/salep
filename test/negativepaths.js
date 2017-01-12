require("../src/index.js");
salep.on("report", function(text) {
  console.log(text);
});

// Shouldn't crash with these cases
salep.case();
salep.case("");
salep.case("test");
salep.case("test", "case");

var result = salep.getResults();

exports.success = true;