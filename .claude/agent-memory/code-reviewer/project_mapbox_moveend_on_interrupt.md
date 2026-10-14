---
name: mapbox-moveend-fires-on-interrupt
description: mapbox-gl 3.x flyTo/easeTo call stop() first, which synchronously fires `moveend` for any in-flight animation — `map.once('moveend')` registered before flyTo catches the wrong move
metadata:
  type: project
---

In mapbox-gl 3.32 (`dist/mapbox-gl-dev.js`), `flyTo()` begins with `this.stop()`; `_stop()` calls the
pending `_onEaseEnd` -> `_afterEase(eventData)` which fires `moveend` synchronously, carrying the
*interrupted* animation's eventData. A user drag also stops the camera the same way.

**Why:** found reviewing MapLocationsPresets (feat/locations-apn, 2026-10-14), which registers
`map.once('moveend', apply)` then calls `flyTo` — any in-flight camera move (previous preset,
location center button, drag inertia) consumes the listener immediately at the old position.

**How to apply:** when reviewing code that waits for "the end of my flight", require either a
tagged eventData check (`flyTo(opts, { tag })` + `e.tag === tag`) plus `off()` of a stale pending
listener, and an unmount cleanup — the presets component is conditionally mounted per tab.
Related: [[unit-tests-runner]].
