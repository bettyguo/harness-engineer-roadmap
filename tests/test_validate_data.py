"""Regression tests for tools/validate_data.py.

These focus on the validator's structural rules (schema, edge resolution,
cycle detection, the strict-mode resource check) and on D1/D2 from the
audit: the link-pattern guarantee and the area-color uniqueness check.

Each test writes a minimal area YAML to a tmp_path and points the
validator at it. No real network, no real roadmap-data.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path
from textwrap import dedent

import pytest

import validate_data as vd  # type: ignore[import-not-found]


SCHEMA_PATH = Path(__file__).resolve().parent.parent / "roadmap-data" / "_schema.json"


def _seed(tmp_path: Path, files: dict[str, str]) -> Path:
    """Write a fake roadmap-data directory and return its path."""
    data_dir = tmp_path / "roadmap-data"
    data_dir.mkdir(exist_ok=True)
    (data_dir / "_schema.json").write_text(
        SCHEMA_PATH.read_text(encoding="utf-8"), encoding="utf-8"
    )
    for name, content in files.items():
        (data_dir / name).write_text(dedent(content).lstrip(), encoding="utf-8")
    return data_dir


def _good_area(area_id: str, *, color: str = "violet", extra_node_lines: str = "") -> str:
    """A minimal valid area file with one node."""
    return f"""\
        area:
          id: {area_id}
          label: {area_id.title()}
          color: {color}
          order: 1
          blurb: blurb
        nodes:
          - id: {area_id}.a
            label: A
            tier: core
            summary: s
            competent_means: c
            depends_on: []
            related: []
            aliases: []
            resources:
              - title: t
                author: a
                year: 2024
                type: post
                link: "https://example.com/"
                why: why
                difficulty: intermediate
                cost: free
                durability: durable
                verified: "yes"
        {extra_node_lines}
    """


def _run(tmp_path: Path, files: dict[str, str], *, strict: bool = False) -> tuple[int, str]:
    """Invoke validate_data.main() against an isolated roadmap-data dir."""
    data_dir = _seed(tmp_path, files)
    # vd looks at module-level ROOT / DATA_DIR / SCHEMA_PATH.
    orig_root, orig_data, orig_schema = vd.ROOT, vd.DATA_DIR, vd.SCHEMA_PATH
    vd.ROOT = tmp_path
    vd.DATA_DIR = data_dir
    vd.SCHEMA_PATH = data_dir / "_schema.json"
    argv_save = sys.argv[:]
    sys.argv = ["validate_data.py"] + (["--strict"] if strict else [])
    try:
        from io import StringIO

        buf_out, buf_err = StringIO(), StringIO()
        # capture both streams
        import contextlib

        with contextlib.redirect_stdout(buf_out), contextlib.redirect_stderr(buf_err):
            rc = vd.main()
        return rc, buf_out.getvalue() + buf_err.getvalue()
    finally:
        vd.ROOT, vd.DATA_DIR, vd.SCHEMA_PATH = orig_root, orig_data, orig_schema
        sys.argv = argv_save


# ---------- D1: link must start with http(s):// ----------


def test_link_must_start_with_http_or_https(tmp_path: Path) -> None:
    """The schema's `pattern: ^https?://` is what enforces URL shape.
    `format: uri` is informational only (no format-checker registered).
    This test locks in that pattern as the real guard."""
    bad = _good_area("x").replace('"https://example.com/"', '"ftp://example.com/"')
    rc, out = _run(tmp_path, {"x.yml": bad})
    assert rc != 0
    assert "pattern" in out.lower() or "does not match" in out.lower()


def test_link_with_https_passes(tmp_path: Path) -> None:
    rc, _ = _run(tmp_path, {"x.yml": _good_area("x")})
    assert rc == 0


def test_link_with_http_passes(tmp_path: Path) -> None:
    rc, _ = _run(
        tmp_path,
        {"x.yml": _good_area("x").replace('"https://example.com/"', '"http://example.com/"')},
    )
    assert rc == 0


# ---------- D2: area color uniqueness ----------


def test_duplicate_area_colors_are_rejected(tmp_path: Path) -> None:
    """Two areas sharing the same color would render as one cluster in
    the diagram — silently. The validator should reject."""
    rc, out = _run(
        tmp_path,
        {
            "a.yml": _good_area("a", color="violet"),
            "b.yml": _good_area("b", color="violet"),
        },
    )
    assert rc != 0
    assert "color" in out.lower()


def test_distinct_area_colors_pass(tmp_path: Path) -> None:
    rc, _ = _run(
        tmp_path,
        {
            "a.yml": _good_area("a", color="violet"),
            "b.yml": _good_area("b", color="teal"),
        },
    )
    assert rc == 0


# ---------- pre-existing structural rules — locked in ----------


def test_unknown_depends_on_rejected(tmp_path: Path) -> None:
    yml = _good_area("x").replace("depends_on: []", "depends_on: [x.nonexistent]")
    rc, out = _run(tmp_path, {"x.yml": yml})
    assert rc != 0
    assert "unknown" in out.lower()


def test_strict_mode_requires_verified_yes(tmp_path: Path) -> None:
    yml = _good_area("x").replace('verified: "yes"', 'verified: "pending"')
    rc, _ = _run(tmp_path, {"x.yml": yml}, strict=False)
    assert rc == 0
    rc_strict, _ = _run(tmp_path, {"x.yml": yml}, strict=True)
    assert rc_strict != 0


def test_area_id_must_match_filename_stem(tmp_path: Path) -> None:
    rc, out = _run(tmp_path, {"foo.yml": _good_area("bar")})
    assert rc != 0
    assert "stem" in out.lower() or "must match" in out.lower()
