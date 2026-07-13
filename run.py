import argparse
import subprocess
import sys
import os
import webbrowser
import time
import threading

def check_requirements():
    try:
        import fastapi
        import uvicorn
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])

def main():
    check_requirements()

    parser = argparse.ArgumentParser(description="Anneal application runner")
    parser.add_argument("--host", default=os.environ.get("ANNEAL_HOST", "127.0.0.1"), help="Host address")
    parser.add_argument("--port", type=int, default=int(os.environ.get("ANNEAL_PORT", 8000)), help="Port number")
    parser.add_argument("--no-browser", action="store_true", help="Do not open browser automatically")
    args = parser.parse_args()

    import uvicorn

    if not args.no_browser:
        def open_browser():
            time.sleep(1.2)
            webbrowser.open_new_tab(f"http://{args.host}:{args.port}")

        threading.Thread(target=open_browser, daemon=True).start()

    uvicorn.run(
        "backend.main:app",
        host=args.host,
        port=args.port,
        reload=True,
        log_level="info",
    )

if __name__ == "__main__":
    main()