require("../src/index.js");

// Shouldn't crash with these cases
salep.case();
salep.case("");
salep.case("test");
salep.case("test", "case");

var result = salep.getResults();

exports.success = true;