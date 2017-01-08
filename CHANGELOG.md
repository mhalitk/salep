# CHANGELOG

## Unreleased

### Fixed

- Fix skipped cases effect to total count (Issue #5)

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