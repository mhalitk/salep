var skipTestResult = require('./skiptest');
delete require.cache[require.resolve('../src/index.js')];
var failTestResult = require('./failtest');
delete require.cache[require.resolve('../src/index.js')];
var eventTestResult = require('./eventtest');
delete require.cache[require.resolve('../src/index.js')];
var negativePathsResult = require('./negativepaths');
delete require.cache[require.resolve('../src/index.js')];

if (skipTestResult.success && failTestResult.success && 
    eventTestResult.success && negativePathsResult.success) {
  process.exit(0);
} else {
  process.exit(1);
}