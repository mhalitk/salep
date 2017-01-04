var skipTestResult = require('./skiptest');
var failTestResult = require('./failtest');
var eventTestResult = require('./eventtest');

if (skipTestResult.success && failTestResult.success && 
    eventTestResult.success) {
  process.exit(0);
} else {
  process.exit(1);
}