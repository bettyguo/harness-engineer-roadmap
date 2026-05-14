"""Regression tests for tools/linkcheck.py.

No network: these exercise the pure functions (`load_ignore`,
`collect_links`, and the report-path-selection logic). The HTTP path
is exercised via patching `requests.head/get` where needed; today we
focus on the report-write path and the ignore-list semantics.
"""
from __future__ import annotations

import json
from pathlib import Path

import pytest

import linkcheck  # type: ignore[import-not-found]


# ---------- C2: partial-run report safety ----------


def test_pick_report_path_full_run_returns_canonical(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    """A full run (paths=None) writes to .linkcheck-report.json."""
    monkeypatch.setattr(linkcheck, "ROOT", tmp_path)
    monkeypatch.setattr(linkcheck, "REPORT_PATH", tmp_path / ".linkcheck-report.json")
    out = linkcheck.pick_report_path(partial=False)
    assert out == tmp_path / ".linkcheck-report.json"


def test_pick_report_path_partial_run_returns_partial_filename(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """A partial run (--paths) MUST NOT overwrite the canonical report.
    It writes to .linkcheck-report.partial.json instead so the nightly
    stale-link workflow keeps reading the last full report."""
    monkeypatch.setattr(linkcheck, "ROOT", tmp_path)
    monkeypatch.setattr(linkcheck, "REPORT_PATH", tmp_path / ".linkcheck-report.json")
    out = linkcheck.pick_report_path(partial=True)
    assert out != tmp_path / ".linkcheck-report.json"
    assert out.name == ".linkcheck-report.partial.json"


def test_partial_run_does_not_overwrite_full_report(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    """End-to-end: a full report exists from a prior run; a partial run
    happens; the full report must be untouched."""
    monkeypatch.setattr(linkcheck, "ROOT", tmp_path)
    monkeypatch.setattr(linkcheck, "REPORT_PATH", tmp_path / ".linkcheck-report.json")

    # Pretend a full run already happened and wrote 3 broken links.
    canonical = tmp_path / ".linkcheck-report.json"
    full = {"results": [{"link": f"https://a/{i}", "status": "BROKEN"} for i in range(3)]}
    canonical.write_text(json.dumps(full), encoding="utf-8")
    canonical_before = canonical.read_text(encoding="utf-8")

    # A partial run writes its (empty) report to the partial path.
    partial_path = linkcheck.pick_report_path(partial=True)
    partial_path.write_text(json.dumps({"results": []}), encoding="utf-8")

    # The canonical file is untouched.
    assert canonical.read_text(encoding="utf-8") == canonical_before


# ---------- ignore-list semantics (existing behavior; not S1 fix) ----------


def test_load_ignore_strips_comments_and_blanks(tmp_path: Path, monkeypatch: pytest.MonkeyPatch) -> None:
    p = tmp_path / ".linkcheck-ignore"
    p.write_text(
        "# a comment\n\nexample.com\n  \nbar.example.org\n",
        encoding="utf-8",
    )
    monkeypatch.setattr(linkcheck, "IGNORE_PATH", p)
    out = linkcheck.load_ignore()
    assert out == {"example.com", "bar.example.org"}


def test_load_ignore_returns_empty_when_file_missing(
    tmp_path: Path, monkeypatch: pytest.MonkeyPatch
) -> None:
    monkeypatch.setattr(linkcheck, "IGNORE_PATH", tmp_path / "nope")
    assert linkcheck.load_ignore() == set()


# ---------- S1: hostname-aware ignore match ----------


def test_should_ignore_exact_hostname() -> None:
    """A registered domain matches its own URLs exactly."""
    assert linkcheck.should_ignore(
        "https://example.com/a/b?c=d", {"example.com"}
    ) is True


def test_should_ignore_subdomain_of_registered() -> None:
    """Registering example.com matches docs.example.com — covers the
    common 'ignore the whole org's domain' contributor intent."""
    assert linkcheck.should_ignore(
        "https://docs.example.com/path", {"example.com"}
    ) is True


def test_should_ignore_refuses_substring_attack() -> None:
    """The pre-fix bug: 'cookbook.openai.com' in the ignore-list also
    matched 'evil-cookbook.openai.com.attacker.com' via substring. The
    hostname-aware check must reject that."""
    assert linkcheck.should_ignore(
        "https://evil-cookbook.openai.com.attacker.com/x",
        {"cookbook.openai.com"},
    ) is False


def test_should_ignore_refuses_unrelated_host() -> None:
    assert linkcheck.should_ignore(
        "https://attacker.com/example.com", {"example.com"}
    ) is False


def test_should_ignore_handles_url_without_scheme() -> None:
    """If a malformed URL slips in, we don't crash; we just don't ignore."""
    assert linkcheck.should_ignore("not a url", {"example.com"}) is False


def test_should_ignore_empty_ignore_set() -> None:
    assert linkcheck.should_ignore("https://example.com/", set()) is False
