---
'@ver0/now-ish_date-fns': patch
---

Fix second, minute, and hour rounding in the hour that a clock change repeats. A time in the second pass of that hour
rounded to the first pass, one hour too early.
