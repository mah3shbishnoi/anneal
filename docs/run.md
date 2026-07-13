# run.py — Application Launcher

`run.py` is the single-command entry point for running Anneal locally.

---

## What It Does

1. **Dependency Check (`check_requirements`)**
   - Inspects whether core backend packages (`fastapi`, `uvicorn`) are installed.
   - If missing, automatically installs them from `requirements.txt` via `pip`.

2. **Configuration**
   - Reads `ANNEAL_HOST` (default: `127.0.0.1`).
   - Reads `ANNEAL_PORT` (default: `8000`).

3. **Browser Auto-Launch (`open_browser`)**
   - Starts a background daemon thread.
   - Waits 1.2 seconds for the server to bind the socket.
   - Opens as a new tab in the currently active browser window, or launches the default browser.

4. **Uvicorn Server**
   - Starts the ASGI server with `reload=True` for automatic code reloading during development.