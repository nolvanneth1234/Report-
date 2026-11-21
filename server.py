"""Serve the portfolio's static files from a minimal production container."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
import os
from pathlib import Path
from urllib.parse import urlsplit

DEFAULT_WEB_ROOT = Path(__file__).resolve().parent / "site"
WEB_ROOT = Path(os.environ.get("WEB_ROOT", str(DEFAULT_WEB_ROOT))).resolve()
HEALTH_PATH = "/_health"


class PortfolioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(WEB_ROOT), **kwargs)

    def _serve_health_check(self) -> bool:
        if urlsplit(self.path).path != HEALTH_PATH:
            return False

        body = b"ok"
        self.send_response(200)
        self.send_header("Content-Type", "text/plain; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)
        return True

    def do_GET(self):
        if not self._serve_health_check():
            super().do_GET()

    def do_HEAD(self):
        if not self._serve_health_check():
            super().do_HEAD()


def main() -> None:
    port = int(os.environ.get("PORT", "3000"))
    if not 1 <= port <= 65535:
        raise ValueError("PORT must be between 1 and 65535")

    server = ThreadingHTTPServer(("0.0.0.0", port), PortfolioHandler)
    server.serve_forever()


if __name__ == "__main__":
    main()
