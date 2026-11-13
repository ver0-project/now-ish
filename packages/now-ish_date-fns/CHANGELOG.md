# @ver0/now-ish_date-fns

## 1.1.1

### Patch Changes

- f14de31: Throw a `RangeError` for an unknown timezone and for a result outside the range that a `Date` can hold. `parse` returned
  an Invalid Date in both cases.
- 8214567: Require `@ver0/now-ish` 1.1.0 or later as the peer dependency. The 1.0.0 release of the core package was published
  without its build output, and the `^1.0.0` range accepted it.
- aa4fc20: Fix second, minute, and hour rounding in the hour that a clock change repeats. A time in the second pass of that hour
  rounded to the first pass, one hour too early.

## 1.1.0

### Minor Changes

- a0f44e2: Publish the built files. Version 1.0.0 shipped without `dist`, and the adapters declared their peer dependency on
  `@ver0/now-ish` with the `workspace:` protocol, which npm cannot install.

## 1.0.0

### Major Changes

- Initial release
