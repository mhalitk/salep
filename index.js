var exports = module.exports;

var indentation = 0;

function indent() {
  var result = "";
  for (var i = 0; i < indentation; ++i) result += "  ";
  return result;
}

exports.test = function(name, func) {
  console.log(indent() + "Testing '" + name + "'");
  indentation++;
  func();
  indentation--;
};

exports.case = function(name, func) {
  console.log(indent() + "Case '" + name + "'...");
  try {
    func();
    console.log(indent() + "  Success");
  } catch (e) {
    console.log(indent() + "  Fail: " + e);
    throw e;
  }
};