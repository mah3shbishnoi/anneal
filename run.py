import subprocess
import sys
import os
import webbrowser
import time

def check_requirements():
    try:
        import fastapi
        import uvicorn
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def main():
    check_requirements()

    import uvicorn

    port = int(os.environ.get("ANNEAL_PORT", 8000))
    host = os.environ.get("ANNEAL_HOST", "127.0.0.1")

    def open_browser():
        time.sleep(1.2)
        webbrowser.open(f"http://{host}:{port}")

    import threading
    threading.Thread(target=open_browser, daemon=True).start()

    uvicorn.run(
        "backend.main:app",
        host=host,
        port=port,
        reload=True,
        log_level="info",
    )

if __name__ == "__main__":
    main()