---
'@ver0/now-ish': patch
---

Reject an offset amount that is not a safe integer. `now-99999999999999999999d` throws a `ParseError` of kind
`invalid-value` at position `offset`.
