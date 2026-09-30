# VS Code + Playwright

This project has separate commands for the three common workflows:

1. **Run in background (headless)**
   - VS Code Testing ▶ button
   - or `Terminal → Run Task... → Playwright: Run all tests (background)`

2. **Run with browser visible (headed)**
   - `Terminal → Run Task... → Playwright: Run UI tests (browser visible)`

3. **Debug with Playwright Inspector**
   - `Terminal → Run Task... → Playwright: Debug UI tests`
   - or `Run and Debug` → `Playwright: Debug checkout test`

4. **API only**
   - `Terminal → Run Task... → Playwright: Run API tests`

5. **Open report**
   - `Terminal → Run Task... → Playwright: Open HTML report`

The VS Code Playwright extension's normal test button uses the default Playwright configuration, which is intentionally headless. Use the headed task when you want to watch Chromium while the test runs.
