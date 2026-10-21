"""Command line: ``python -m story_model [module[:attr]] [--all]``.

Checks a story and prints findings grouped by severity. Exit status is 1 when there
are errors, so CI can gate on it. The default story is the Ashby fixture.
"""

from __future__ import annotations

import argparse
import importlib
import sys
from collections import Counter

from .checker import Finding, Severity, check
from .model import Story


def load_story(spec: str) -> Story:
    """``package.module`` (uses its ``STORY``) or ``package.module:name``."""
    module_name, _, attr = spec.partition(":")
    module = importlib.import_module(module_name)
    story = getattr(module, attr or "STORY")
    if not isinstance(story, Story):
        raise TypeError(f"{spec} is not a Story")
    return story


def render(story: Story, findings: list[Finding], *, show_open: bool) -> str:
    lines = [
        f"{story.title}: {len(story.scenes)} scenes, {len(story.facts)} facts, "
        f"{len(story.artifacts)} artifacts, {len(story.wants)} wants"
    ]
    counts = Counter(f.severity for f in findings)
    order = [Severity.ERROR, Severity.WARNING] + ([Severity.OPEN] if show_open else [])
    for sev in order:
        group = [f for f in findings if f.severity is sev]
        if not group:
            continue
        lines.append("")
        lines.append(f"{sev.upper()} ({len(group)})")
        lines += [f"  {f.where:<22} {f.rule:<13} {f.message}" for f in group]
    lines.append("")
    lines.append(", ".join(f"{counts[s]} {s}" for s in Severity) or "clean")
    return "\n".join(lines)


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="story_model", description=__doc__)
    parser.add_argument(
        "story",
        nargs="?",
        default="story_model.fixtures.ashby",
        help="module or module:attr holding a Story (default: the Ashby fixture)",
    )
    parser.add_argument("--all", action="store_true", help="also list the design's Open items")
    args = parser.parse_args(argv)
    story = load_story(args.story)
    findings = check(story)
    print(render(story, findings, show_open=args.all))
    return 1 if any(f.severity is Severity.ERROR for f in findings) else 0


if __name__ == "__main__":
    sys.exit(main())
