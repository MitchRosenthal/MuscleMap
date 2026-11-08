"""Build a static copy of MuscleMap for GitHub Pages.

Renders every page reachable from the home page with Flask's test client and
writes it to build/. Leaf pages are saved as `<path>.html` (e.g.
/muscle/chest/page/2 becomes muscle/chest/page/2.html), which GitHub Pages serves
at the original extensionless URL, so links and the progress tracker work
unchanged. A page that also has pages below it (e.g. /muscle) is saved as
`<path>/index.html` instead.

Usage:
    python freeze.py                    # site served from the domain root
    BASE_PATH=/MuscleMap python freeze.py   # site served from a subpath
"""

import os
import re
import shutil
from pathlib import Path

from server import app

BASE_PATH = os.environ.get("BASE_PATH", "").rstrip("/")
OUT = Path("build")
# Pages that exist but aren't linked from the navigation.
EXTRA_PAGES = ["/quiz"]
LINK_RE = re.compile(r'(?:href|src|xlink:href|data-href)="([^"#?]+)"')


def output_path(url_path: str, all_urls: set[str]) -> Path:
    rel = url_path[len(BASE_PATH):].strip("/")
    if not rel:
        return OUT / "index.html"
    has_children = any(u.startswith(f"{BASE_PATH}/{rel}/") for u in all_urls)
    return OUT / rel / "index.html" if has_children else OUT / f"{rel}.html"


def main() -> None:
    shutil.rmtree(OUT, ignore_errors=True)
    shutil.copytree("static", OUT / "static", ignore=shutil.ignore_patterns("__pycache__"))

    client = app.test_client()
    environ = {"SCRIPT_NAME": BASE_PATH}
    static_prefix = f"{BASE_PATH}/static/"
    queue, pages = [f"{BASE_PATH}/"], {}
    for path in EXTRA_PAGES:
        if client.get(path).status_code == 200:
            queue.append(f"{BASE_PATH}{path}")
        else:
            print(f"Skipping {path} (not available)")

    while queue:
        url = queue.pop()
        if url in pages:
            continue

        resp = client.get(url[len(BASE_PATH):] or "/", environ_overrides=environ)
        if resp.status_code != 200:
            raise SystemExit(f"{url} returned {resp.status_code}")

        html = pages[url] = resp.get_data(as_text=True)
        for link in LINK_RE.findall(html):
            if link.startswith(f"{BASE_PATH}/") and not link.startswith(static_prefix):
                queue.append(link)

    for url, html in pages.items():
        dest = output_path(url, set(pages))
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(html, encoding="utf-8")
        print(f"{url} -> {dest}")

    (OUT / ".nojekyll").touch()
    shutil.copy(OUT / "index.html", OUT / "404.html")
    print(f"Built {len(pages)} pages into {OUT}/")


if __name__ == "__main__":
    main()
