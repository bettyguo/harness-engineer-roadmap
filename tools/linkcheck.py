#!/usr/bin/env python3
"""Check every resource link in roadmap-data/.

Polite by design: 4 concurrent requests, ~1s jitter between bursts, fakes a
real User-Agent. Treats 200/301/302/303/307/308 as OK; 405/403 trigger a GET
retry; other 4xx/5xx are broken; timeout is a warning.

Output: human-readable summary to stdout, machine-readable JSON report to
.linkcheck-report.json. Non-zero exit code on any broken link unless --soft.

Usage:
  python tools/linkcheck.py
  python tools/linkcheck.py --paths roadmap-data/loop.yml
  python tools/linkcheck.py --soft        # warn but exit 0
"""
from __future__ import annotations

import argparse
import json
import random
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

import requests
import yaml

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "roadmap-data"
REPORT_PATH = ROOT / ".linkcheck-report.json"
PARTIAL_REPORT_PATH = ROOT / ".linkcheck-report.partial.json"
IGNORE_PATH = ROOT / ".linkcheck-ignore"


def pick_report_path(partial: bool) -> Path:
    """Pick the output path for the JSON report.

    A partial run (only some files via --paths) must NOT overwrite the
    canonical report, because the nightly stale-link workflow trusts it
    to be the latest *full* picture. Partial runs go to a separate file.
    """
    return (
        ROOT / PARTIAL_REPORT_PATH.name
        if partial
        else ROOT / REPORT_PATH.name
    )

UA = (
    "Mozilla/5.0 (compatible; harness-engineer-roadmap-linkcheck/1.0; "
    "+https://github.com/bettyguo/harness-engineer-roadmap)"
)
TIMEOUT = 20
OK_STATUS = {200, 201, 203, 204, 301, 302, 303, 307, 308}


def load_ignore() -> set[str]:
    if not IGNORE_PATH.exists():
        return set()
    return {
        line.strip()
        for line in IGNORE_PATH.read_text(encoding="utf-8").splitlines()
        if line.strip() and not line.startswith("#")
    }


def collect_links(paths: list[Path]) -> list[tuple[str, str, str]]:
    """Return list of (link, node_id, title) tuples."""
    out: list[tuple[str, str, str]] = []
    for path in paths:
        data = yaml.safe_load(path.read_text(encoding="utf-8"))
        if not data:
            continue
        for node in data.get("nodes", []):
            for r in node.get("resources", []):
                out.append((r["link"], node["id"], r.get("title", "")))
    return out


def check_one(link: str, ignore: set[str]) -> tuple[str, str, int | None]:
    """Returns (status_string, link, http_code). status_string in {OK, BROKEN, WARN}."""
    if any(dom in link for dom in ignore):
        return "OK", link, None
    headers = {"User-Agent": UA, "Accept": "*/*"}
    try:
        # HEAD first, follow redirects
        r = requests.head(link, headers=headers, timeout=TIMEOUT, allow_redirects=True)
        code = r.status_code
        if code in OK_STATUS:
            return "OK", link, code
        if code in (403, 405, 501):
            # Some hosts don't like HEAD; retry GET (range-limit to be polite)
            r = requests.get(
                link,
                headers={**headers, "Range": "bytes=0-2047"},
                timeout=TIMEOUT,
                allow_redirects=True,
                stream=True,
            )
            r.close()
            code = r.status_code
        if code in OK_STATUS or code == 206:
            return "OK", link, code
        return "BROKEN", link, code
    except requests.Timeout:
        return "WARN", link, None
    except requests.RequestException:
        return "BROKEN", link, None


def main() -> int:
    ap = argparse.ArgumentParser(description="Link-check roadmap-data/ resources")
    ap.add_argument(
        "--paths",
        nargs="*",
        default=None,
        help="Specific YAML files to check (default: all of roadmap-data/*.yml)",
    )
    ap.add_argument("--soft", action="store_true", help="Always exit 0")
    ap.add_argument(
        "--max-workers", type=int, default=4, help="Concurrent requests (default 4)"
    )
    args = ap.parse_args()

    if args.paths:
        files = [Path(p) for p in args.paths]
        partial = True
    else:
        files = sorted(p for p in DATA_DIR.glob("*.yml") if not p.name.startswith("_"))
        partial = False
    report_path = pick_report_path(partial=partial)

    links = collect_links(files)
    if not links:
        print("no links found; nothing to check")
        return 0

    # Dedup but keep first-seen node_id/title for reporting
    seen: dict[str, tuple[str, str]] = {}
    for link, node_id, title in links:
        seen.setdefault(link, (node_id, title))
    unique_links = list(seen.keys())

    ignore = load_ignore()

    print(
        f"checking {len(unique_links)} unique link(s) "
        f"across {len(files)} file(s), max_workers={args.max_workers}..."
    )

    results: list[dict] = []
    broken_n = 0
    warn_n = 0
    ok_n = 0

    # Batches with jitter for politeness
    with ThreadPoolExecutor(max_workers=args.max_workers) as pool:
        futures = {pool.submit(check_one, lk, ignore): lk for lk in unique_links}
        completed = 0
        for fut in as_completed(futures):
            status, link, code = fut.result()
            node_id, title = seen[link]
            results.append(
                {
                    "link": link,
                    "node": node_id,
                    "title": title,
                    "status": status,
                    "http_code": code,
                }
            )
            if status == "OK":
                ok_n += 1
            elif status == "WARN":
                warn_n += 1
                print(f"  WARN  ({code or 'timeout'})  {link}  [{node_id}]")
            else:
                broken_n += 1
                print(f"  BROKEN({code or 'error'})  {link}  [{node_id}]")
            completed += 1
            if completed % args.max_workers == 0:
                time.sleep(0.8 + random.random() * 0.4)

    report_path.write_text(
        json.dumps({"results": results}, indent=2),
        encoding="utf-8",
    )

    print(f"\nresults: {ok_n} OK · {warn_n} WARN · {broken_n} BROKEN")
    print(f"report: {report_path.relative_to(ROOT)}")

    if broken_n and not args.soft:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
