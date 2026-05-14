"""Smoke test confirming the test harness itself works.

Replace / extend in the per-fix regression tests.
"""
from __future__ import annotations


def test_pytest_runs() -> None:
    assert 1 + 1 == 2


def test_tools_importable() -> None:
    """The three tool modules import without side effects."""
    import build  # type: ignore[import-not-found]
    import linkcheck  # type: ignore[import-not-found]
    import validate_data  # type: ignore[import-not-found]

    assert callable(build.main)
    assert callable(linkcheck.main)
    assert callable(validate_data.main)
