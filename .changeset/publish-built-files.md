---
'@ver0/now-ish': patch
'@ver0/now-ish_date-fns': patch
'@ver0/now-ish_temporal': patch
---

Publish the built files. Version 1.0.0 shipped without `dist`, and the adapters declared their peer dependency on
`@ver0/now-ish` with the `workspace:` protocol, which npm cannot install.
