# Agent memory index

- [Read the component tree before reaching for visual tools](feedback_read_markup_before_visual_tools.md) — layout answers live in the `sx` constants, not in pixel measurements
- [Browser tests only through the isolated Edge MCP server](feedback_no_dev_server_or_browser.md) — use `playwright-edge`, never the playwright plugin tools
- [ParamsSelect empty string guard](feedback_params_select_empty_string.md) — cleared value is `""`, guard with a truthy check
