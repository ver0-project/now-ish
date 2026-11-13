# @ver0/now-ish_temporal

## 2.0.0

### Major Changes

- 5051ee2: Return the `Temporal` objects of the runtime. The adapter returned `@js-temporal/polyfill` objects on every runtime, so
  on a runtime with `Temporal` a result failed `instanceof Temporal.ZonedDateTime` and could not be passed to the
  methods of a native object.

  - On a runtime with `Temporal`, `parse` and `now` return native objects. On a runtime without it, they return the
    objects of the polyfill, as before.
  - The exported `Time` and `Timezone` types are the standard `Temporal` types, which need TypeScript 6.0 or later with
    the `esnext` lib. A function that is typed with `@js-temporal/polyfill` does not accept a result: on a runtime
    without `Temporal`, add a type assertion; on a runtime with `Temporal`, use the native API in that code.

### Patch Changes

- 8214567: Require `@ver0/now-ish` 1.1.0 or later as the peer dependency. The 1.0.0 release of the core package was published
  without its build output, and the `^1.0.0` range accepted it.

## 1.1.0

### Minor Changes

- a0f44e2: Publish the built files. Version 1.0.0 shipped without `dist`, and the adapters declared their peer dependency on
  `@ver0/now-ish` with the `workspace:` protocol, which npm cannot install.

## 1.0.0

### Major Changes

- Initial release
