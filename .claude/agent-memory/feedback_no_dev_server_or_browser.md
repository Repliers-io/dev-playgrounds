---
name: Browser tests only through the isolated Edge MCP server
description: Never use the bundled playwright plugin MCP (it drives the user's own browser) — use the `playwright-edge` server, and clean up dev servers by PID afterwards
type: feedback
---

For any browser-driven check, use the **`playwright-edge`** MCP server (`npx @playwright/mcp@latest --browser msedge --isolated`, user-scoped in `~/.claude.json`). Never use the `plugin:playwright:playwright` tools (`mcp__plugin_playwright_playwright__*`) — that server runs with no flags and lands in the user's own everyday browser.

**Why:** The user works in that browser. Tabs appearing in their live session mid-task is disruptive. A separate Edge with an isolated profile gives the same verification without touching anything of theirs. Launching a dev server for such a check is fine, but it must not be left running.

**How to apply:** Drive the browser only through `playwright-edge`. After a run, stop the dev server and confirm the port is actually free — `TaskStop` kills only the npm wrapper, the vite child survives, so check `netstat -ano | grep LISTENING | grep :<port>` and `taskkill //PID <pid> //F`. Delete the `.playwright-mcp/` artifact folder it drops in the repo root; it is not gitignored. See [[feedback_params_select_empty_string]].
