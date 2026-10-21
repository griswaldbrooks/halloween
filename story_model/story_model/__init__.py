"""story_model: a typed world model for story-driven escape rooms, with a checker.

Build a :class:`Story` (fabula, evidence, scenes), run :func:`check`, read the findings.
"""

from .checker import Finding, Severity, check, errors
from .model import (
    Action,
    AntagonistAct,
    Artifact,
    Character,
    Ending,
    Event,
    Fact,
    Modality,
    Scene,
    Status,
    Story,
    Twist,
    Want,
    WantKind,
)

__all__ = [
    "Action",
    "AntagonistAct",
    "Artifact",
    "Character",
    "Ending",
    "Event",
    "Fact",
    "Finding",
    "Modality",
    "Scene",
    "Severity",
    "Status",
    "Story",
    "Twist",
    "Want",
    "WantKind",
    "check",
    "errors",
]
