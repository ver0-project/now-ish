---
'@ver0/now-ish_temporal': major
---

Return the `Temporal` objects of the runtime. The adapter returned `@js-temporal/polyfill` objects on every runtime, so
on a runtime with `Temporal` a result failed `instanceof Temporal.ZonedDateTime` and could not be passed to the
methods of a native object.

- On a runtime with `Temporal`, `parse` and `now` return native objects. On a runtime without it, they return the
  objects of the polyfill, as before.
- The exported `Time` and `Timezone` types are the standard `Temporal` types, which need TypeScript 6.0 or later with
  the `esnext` lib. A function that is typed with `@js-temporal/polyfill` does not accept a result: on a runtime
  without `Temporal`, add a type assertion; on a runtime with `Temporal`, use the native API in that code.
