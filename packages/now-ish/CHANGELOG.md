# @ver0/now-ish

## 1.1.1

### Patch Changes

- ec6b92e: Correct the README: the custom adapter example threw `units must not be empty`, and the Grafana note did not name the
  unit names that differ.
- 5517380: Reject an offset amount that is not a safe integer. `now-99999999999999999999d` throws a `ParseError` of kind
  `invalid-value` at position `offset`.

## 1.1.0

### Minor Changes

- a0f44e2: Publish the built files. Version 1.0.0 shipped without `dist`, and the adapters declared their peer dependency on
  `@ver0/now-ish` with the `workspace:` protocol, which npm cannot install.

## 1.0.0

### Major Changes

- Initial release
