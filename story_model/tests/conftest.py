"""A tiny two-scene story that passes every rule. Tests break one thing at a time."""

from __future__ import annotations

from dataclasses import replace

import pytest

from story_model import (
    Action,
    Artifact,
    Character,
    Ending,
    Event,
    Fact,
    Modality,
    Scene,
    Story,
    Want,
    WantKind,
)

fs = frozenset


def clean_story(**overrides) -> Story:
    """A ghost (Eleanor) hid a ledger and died. Participants are asked to find it, find it,
    learn why. Every field needed to satisfy the checker is present."""
    base = dict(
        title="clean",
        characters=[
            Character("eleanor", "Eleanor", died_at="eleanor_dies"),
            Character("cousin", "The cousin"),
        ],
        facts=[
            Fact("ledger_hidden", "Eleanor hid the ledger in the wall."),
            Fact("fraud", "The cousin committed fraud.", requires=fs({"ledger_hidden"})),
            Fact("eleanor_dead", "Eleanor died."),
        ],
        events=[
            Event(
                "hides",
                1,
                "Eleanor hides the ledger.",
                fs({"eleanor"}),
                learns={"eleanor": fs({"ledger_hidden", "fraud"})},
            ),
            Event(
                "eleanor_dies",
                2,
                "Eleanor dies.",
                fs({"eleanor"}),
                causes=fs({"hides"}),
                learns={"eleanor": fs({"eleanor_dead"})},
            ),
        ],
        artifacts=[
            Artifact(
                "voice",
                "Eleanor speaks through the medium.",
                Modality.TESTIMONY,
                testimony_of="eleanor",
                reveals=fs({"ledger_hidden"}),
            ),
            Artifact(
                "ledger",
                "The ledger, in the wall.",
                Modality.DOCUMENT,
                origin="hides",
                belongs_to="eleanor",
                reveals=fs({"fraud"}),
                salience="loose stone",
            ),
        ],
        wants=[
            Want("find_ledger", "Find what Eleanor hid.", WantKind.FIND),
            Want("why", "Learn why she hid it.", WantKind.UNDERSTAND),
        ],
        scenes=[
            Scene("s1", "Contact", artifacts=("voice",), contact=("eleanor",), instills=("find_ledger", "why")),
            Scene(
                "s2",
                "The wall",
                actions=(
                    Action("search the wall", serves="find_ledger", needs_belief=fs({"ledger_hidden"}), worked=True),
                ),
                artifacts=("ledger",),
                resolves=("find_ledger", "why"),
            ),
        ],
        ending=Ending("The fraud is known.", needs=fs({"fraud"})),
    )
    base.update(overrides)
    return Story.build(**base)


@pytest.fixture
def clean() -> Story:
    return clean_story()


def with_scene(story: Story, index: int, **changes) -> Story:
    """Return a copy of ``story`` with scene ``index`` replaced by ``replace(scene, **changes)``."""
    scenes = list(story.scenes)
    scenes[index] = replace(scenes[index], **changes)
    return replace(story, scenes=tuple(scenes))
