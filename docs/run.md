# run.py — Application Launcher

`run.py` is the single-command entry point for running Anneal locally.

---

## What It Does

1. **Dependency Check (`check_requirements`)**
   - Inspects whether core backend packages (`fastapi`, `uvicorn`) are installed.
   - If missing, automatically installs them from `requirements.txt` via `pip`.

2. **CLI Flags and Environment Variables**
   - `--host`: Host address to bind (defaults to `ANNEAL_HOST` or `127.0.0.1`).
   - `--port`: Port number to listen on (defaults to `ANNEAL_PORT` or `8000`).
   - `--no-browser`: Flag to suppress automatic browser launching.

3. **Browser Auto-Launch (`open_browser`)**
   - If `--no-browser` is not passed, starts a background daemon thread.
   - Waits 1.2 seconds for the server to bind the socket.
   - Opens as a new tab in the active browser window, or launches the default browser.

4. **Uvicorn Server**
   - Starts the ASGI server with `reload=True` for automatic code reloading during development.

---

## Usage Examples

```bash
python run.py --no-browser

# Custom port
python run.py --port 8080
```