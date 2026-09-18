---
name: Read the component tree before reaching for visual tools
description: Layout questions in this app are answered by the sx constants in the component source — running the app to measure pixels is the expensive wrong turn
type: feedback
---

When a layout question comes up ("why is this control not visible", "where does this panel sit"), read the component and its `sx` props first. Positioning here is plain absolute geometry with literal constants, so the answer is in the source. Do not start a dev server and measure `getBoundingClientRect` to rediscover a hardcoded number.

**Why:** It is far cheaper and it catches the intent, not just the pixels. Example: `SearchField` uses `top: locationsEndpoint ? -46 : 16` together with `boxShadow: locationsEndpoint ? 0 : 1` — a negative offset plus a dropped shadow reads as "the input is deliberately tucked out of sight, the options list is the visible panel". Measuring in a browser produced the same fact much later, and the measured "input height 46px" turned out to be the very same 46 already sitting in the file: the raised offset lifts the input by exactly its own height.

**How to apply:** Grep the component, read the `sx` blocks and the constants at the top of the file, and reason about the containing block. Reach for a browser only when behaviour depends on runtime data or on a third-party library's own rendering (e.g. a portalled MUI popper), and then through [[feedback_no_dev_server_or_browser]].
