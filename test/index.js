var skipTestResult = require('./skipTest');

if (skipTestResult.success) {
    process.exit(0);
} else {
    process.exit(1);
}