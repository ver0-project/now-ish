---
'@ver0/now-ish_date-fns': patch
---

Throw a `RangeError` for an unknown timezone and for a result outside the range that a `Date` can hold. `parse` returned
an Invalid Date in both cases.
