# Agent memory index

- [Read the component tree before reaching for visual tools](feedback_read_markup_before_visual_tools.md) — layout answers live in the `sx` constants, not in pixel measurements
- [Browser tests only through the isolated Edge MCP server](feedback_no_dev_server_or_browser.md) — use `playwright-edge`, never the playwright plugin tools
- [ParamsSelect empty string guard](feedback_params_select_empty_string.md) — cleared value is `""`, guard with a truthy check
- [Presets reset every scoping field](feedback_presets_reset_every_scoping_field.md) — diff the provider's param list against the preset's setValue calls; restore page size on release
- [Mapbox flight listeners](feedback_mapbox_flight_listeners.md) — tag the flyTo, off() the stale handler per click, clean up on unmount
- [Direct setParams needs validation](feedback_direct_setparams_needs_validation.md) — run `schema.validate` synchronously before bypassing the form submit
- [jest config without vendor paths](feedback_jest_config_no_vendor_paths.md) — prove default resolution fails before mapping dist paths; re-check after bumps
- [CI runtime pins](feedback_ci_runtime_pins.md) — grep workflows before touching .nvmrc/engines; never pin to a release-day Node
