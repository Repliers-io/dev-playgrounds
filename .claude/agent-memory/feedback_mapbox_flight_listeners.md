---
name: mapbox-flight-listeners
description: Code that waits for its own flyTo to land must tag the flight, remove any stale listener on the next click, and clean up on unmount — a bare once('moveend') before flyTo catches whatever move was already running
type: feedback
---

Implementer-side rule for the mechanics recorded in
[[mapbox-moveend-fires-on-interrupt]]: `flyTo()`/`easeTo()` call `stop()` first, which
fires `moveend` synchronously for any in-flight animation (previous flight, drag inertia,
the location centre button). A listener registered just before `flyTo` therefore runs at
the *old* position, and if the component is tab-mounted it keeps running after unmount.

**Why:** MapLocationsPresets (22d3996) used `map.once('moveend', apply)` then `flyTo`.
Two clicks mid-flight applied both presets midway and sent a stale request, and switching
tabs mid-flight wrote `center`/`source` into the shared form from a dead component.

**How to apply:** keep the pending handler in a ref; on every click `off()` the old one;
pass `{ presetFlight: tag }` as `flyTo`'s eventData and have the handler return unless
`e.presetFlight === tag`; add `useEffect(() => cancel, [])`. If the map is already at the
target, apply directly, since a zero-length flight may not fire `moveend`.
