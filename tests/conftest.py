"""pytest configuration for tests under ./tests.

Adds the repo root to sys.path so `import tools.<module>` works without
having to install the package. Tools are scripts, not a packaged library.
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
TOOLS = ROOT / "tools"

# Make `from tools import build` etc. work from anywhere pytest runs.
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
if str(TOOLS) not in sys.path:
    sys.path.insert(0, str(TOOLS))
