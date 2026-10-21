"""Typed model of a story-driven escape room.

Four layers, in the order a mystery is built:

1. Fabula - what actually happened: characters, timestamped events, and what each
   character learned at each event. This is the history the puzzles sit on top of.
2. Evidence - artifacts in the room (objects, documents, ghost testimony). Each one
   points at the facts it reveals and at the fabula event that explains why it exists.
3. Syuzhet - the scenes in the order participants meet them: which artifacts surface,
   which wants are instilled, which actions the participants take and why.
4. The player as a character - derived by the checker: what they know, what they
   merely believe (surface readings can be false), whom they care about.

Nothing here reasons. The checker does. Where the source design leaves something
Open, say so with ``status=Status.OPEN`` instead of guessing; the checker reports
open items separately from violations.
"""

from __future__ import annotations

from collections.abc import Iterable, Mapping
from dataclasses import dataclass, field
from enum import StrEnum
from typing import Self


class Status(StrEnum):
    """Design status, mirroring the Ashby design record's key."""

    COMMITTED = "committed"
    WORKING = "working"
    PROPOSED = "proposed"
    OPEN = "open"


class Modality(StrEnum):
    """How an artifact reaches the participants."""

    OBJECT = "object"  # a thing they handle
    DOCUMENT = "document"  # a thing they read
    TESTIMONY = "testimony"  # a character's voice (ghost through the medium, recording, actor)
    ENVIRONMENT = "environment"  # the room itself: a stump beside a boulder, a sound


class WantKind(StrEnum):
    """What sort of goal a want is. ``SAVE`` and ``RECONCILE`` target a character
    and need attachment to that character before they can land."""

    UNDERSTAND = "understand"
    FIND = "find"
    ESCAPE = "escape"
    SAVE = "save"
    RECONCILE = "reconcile"


@dataclass(frozen=True, slots=True)
class Fact:
    """A proposition about the fabula. ``true`` is False for a planted misreading
    (what the surface of an artifact suggests) so a twist can later negate it."""

    id: str
    text: str
    true: bool = True
    requires: frozenset[str] = frozenset()  # facts needed to make sense of this one
    status: Status = Status.WORKING


@dataclass(frozen=True, slots=True)
class Character:
    id: str
    name: str
    died_at: str | None = None  # event id, if they die in the fabula
    status: Status = Status.WORKING


@dataclass(frozen=True, slots=True)
class Event:
    """One thing that happened, at integer time ``time`` (any monotone scale)."""

    id: str
    time: int
    text: str
    participants: frozenset[str] = frozenset()  # character ids present
    learns: Mapping[str, frozenset[str]] = field(default_factory=dict)  # character -> facts
    causes: frozenset[str] = frozenset()  # event ids this one is a consequence of
    status: Status = Status.WORKING


@dataclass(frozen=True, slots=True)
class Artifact:
    """A piece of evidence the participants can meet.

    ``origin`` is the fabula event that explains why this thing exists.
    ``testimony_of`` names the character speaking, for ``Modality.TESTIMONY``.
    ``reveals`` are facts the participants learn for certain.
    ``surface`` are facts the participants will *believe* on first reading even
    though they may be false - the raw material for a twist.
    ``salience`` is why anyone would notice it; empty means it is only found
    because the participants are already looking for it.
    """

    id: str
    text: str
    modality: Modality
    origin: str | None = None
    testimony_of: str | None = None
    reveals: frozenset[str] = frozenset()
    surface: frozenset[str] = frozenset()
    salience: str = ""
    belongs_to: str | None = None  # character id; handling it is contact of a kind
    status: Status = Status.WORKING


@dataclass(frozen=True, slots=True)
class Want:
    id: str
    text: str
    kind: WantKind
    target: str | None = None  # character id for SAVE / RECONCILE / FIND-a-person
    status: Status = Status.WORKING


@dataclass(frozen=True, slots=True)
class Action:
    """Something the participants do in a scene, and why they would bother.

    ``serves`` is the want this action is in service of.
    ``needs_belief`` are facts the participants must believe to think of it.
    ``worked`` marks a puzzle actually solved (as opposed to being handed a thing);
    beliefs planted through worked-for reveals are the ones a twist can trade on.
    """

    text: str
    serves: str
    needs_belief: frozenset[str] = frozenset()
    worked: bool = False
    status: Status = Status.WORKING


@dataclass(frozen=True, slots=True)
class Twist:
    """A reveal that negates a belief the participants hold."""

    negates: str  # fact id the participants believed
    via: str  # artifact id that delivers the reversal
    status: Status = Status.WORKING


@dataclass(frozen=True, slots=True)
class AntagonistAct:
    """A character turning on the participants or the world; needs a cause on stage."""

    character: str
    text: str
    cause: str  # fact id that must already be revealed
    status: Status = Status.WORKING


@dataclass(frozen=True, slots=True)
class Scene:
    id: str
    title: str
    actions: tuple[Action, ...] = ()
    artifacts: tuple[str, ...] = ()  # artifact ids that surface here, in order
    instills: tuple[str, ...] = ()  # want ids newly held after this scene
    resolves: tuple[str, ...] = ()  # want ids satisfied by this scene
    contact: tuple[str, ...] = ()  # characters met directly (voice, presence)
    mentions: tuple[str, ...] = ()  # characters spoken about, secondhand
    twist: Twist | None = None
    antagonist: AntagonistAct | None = None
    status: Status = Status.WORKING


@dataclass(frozen=True, slots=True)
class Ending:
    text: str
    needs: frozenset[str]  # facts the participants must know for the ending to make sense
    status: Status = Status.WORKING


@dataclass(frozen=True, slots=True)
class Story:
    title: str
    characters: Mapping[str, Character]
    facts: Mapping[str, Fact]
    events: Mapping[str, Event]
    artifacts: Mapping[str, Artifact]
    wants: Mapping[str, Want]
    scenes: tuple[Scene, ...]
    ending: Ending

    @classmethod
    def build(
        cls,
        title: str,
        *,
        characters: Iterable[Character],
        facts: Iterable[Fact],
        events: Iterable[Event],
        artifacts: Iterable[Artifact],
        wants: Iterable[Want],
        scenes: Iterable[Scene],
        ending: Ending,
    ) -> Self:
        """Build from sequences, keying each collection by id and refusing duplicates."""
        return cls(
            title=title,
            characters=_keyed(characters),
            facts=_keyed(facts),
            events=_keyed(events),
            artifacts=_keyed(artifacts),
            wants=_keyed(wants),
            scenes=tuple(scenes),
            ending=ending,
        )

    def events_in_order(self) -> list[Event]:
        return sorted(self.events.values(), key=lambda e: (e.time, e.id))


def _keyed[T: Fact | Character | Event | Artifact | Want](items: Iterable[T]) -> dict[str, T]:
    out: dict[str, T] = {}
    for item in items:
        if item.id in out:
            raise ValueError(f"duplicate id {item.id!r}")
        out[item.id] = item
    return out
