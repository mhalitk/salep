# CHANGELOG

## v0.2.3 / 12.01.2017

### Fixed

- Fix browser support
- Fix skipNext behavior. skipNext was causing all following
  cases to be skipped when it's used

## v0.2.2 / 12.01.2017

### Fixed

- Fix beforeEach and afterEach usages after case definitions.
  There was restriction about their places, they should have
  been before case definitions in order to use them.

## v0.2.1 / 10.01.2017

### Added

- afterEach callback that runs after each case in a Test
- beforeEach callback that runs before each case in a Test

### Fixed

- Fix skipped cases effect to total count (Issue #5)
- Fix case's parent is null issue

### Other

- Document Result, Test and Case classes

## v0.2.0 / 04.01.2017

### Added

- skipNext functionality to skip a single test or case
- getResults function to check results anytime
- off function to remove callback from event
- Result object (returned from getResults) is documented

### Deprecated

- run is deprecated, salep starts on running mode
- stop is deprecated, if you want to skip test/case use skipNext functionality

## v0.1.1 / 01.01.2017

### Added

- reason property to failed test cases
- Documentation with JSDoc

## v0.1.0 / 30.12.2016

### Added

- run and stop functions which enables skipping tests/cases
- Give JSON output when stopped
- Support nested tests