"""Constraint checker over a :class:`~story_model.model.Story`.

The checker walks the fabula to work out what each character could know, then walks
the scenes in order playing the participants as one more character: tracking what
they know, what they merely believe, which wants they hold, and whom they have had
contact with. Each rule emits :class:`Finding` objects; nothing here edits the story.

Severity:
- ``ERROR``   the design is inconsistent as written (an LLM or a tired designer let
              a ghost testify to something it never knew, aimed a payoff at a
              stranger, asked the participants to do something nothing motivated).
- ``WARNING`` it will probably play badly (stale motivation, handed-not-earned twist,
              empty goal stack, artifact with no reason to exist).
- ``OPEN``    the source design says this is still to be decided. Not a defect; a
              list of what the designer owes.
"""

from __future__ import annotations

from collections import Counter
from dataclasses import dataclass, field
from enum import StrEnum

from .model import Modality, Scene, Status, Story, WantKind

CONTACT_WEIGHT = 3  # hearing a character's own voice
BELONGING_WEIGHT = 1  # handling something that was theirs
MENTION_WEIGHT = 1  # hearing about them secondhand
ATTACHMENT_THRESHOLD = 4  # below this, a SAVE/RECONCILE want is a warning even with contact
MAX_OPEN_WANTS = 3
STALE_AFTER_SCENES = 2
LOCAL_WANTS = frozenset({WantKind.FIND, WantKind.ESCAPE, WantKind.SAVE})


class Severity(StrEnum):
    ERROR = "error"
    WARNING = "warning"
    OPEN = "open"


@dataclass(frozen=True, slots=True)
class Finding:
    rule: str
    severity: Severity
    where: str  # scene id, artifact id, "ending", ...
    message: str

    def __str__(self) -> str:
        return f"{self.severity.upper():7} {self.rule:<14} {self.where:<22} {self.message}"


@dataclass(slots=True)
class PlayerState:
    """What the participants carry between scenes."""

    knows: set[str] = field(default_factory=set)
    believes: set[str] = field(default_factory=set)
    earned: set[str] = field(default_factory=set)  # beliefs planted through a worked-for reveal
    open_wants: dict[str, int] = field(default_factory=dict)  # want id -> scene index instilled
    cares: Counter[str] = field(default_factory=Counter)
    contacted: set[str] = field(default_factory=set)


def check(story: Story) -> list[Finding]:
    """Run every rule. Reference errors short-circuit: the other rules assume ids resolve."""
    findings = _check_references(story)
    if any(f.severity is Severity.ERROR for f in findings):
        return findings
    findings += _check_fabula(story)
    findings += _check_artifacts(story)
    findings += _walk_scenes(story)
    findings += _check_open(story)
    return findings


def errors(findings: list[Finding]) -> list[Finding]:
    return [f for f in findings if f.severity is Severity.ERROR]


# --- reference integrity -----------------------------------------------------------------


def _check_references(story: Story) -> list[Finding]:
    out: list[Finding] = []

    def need(kind: str, ids: dict, ref: str | None, where: str) -> None:
        if ref is not None and ref not in ids:
            out.append(Finding("references", Severity.ERROR, where, f"unknown {kind} {ref!r}"))

    for c in story.characters.values():
        need("event", story.events, c.died_at, f"character {c.id}")
    for f in story.facts.values():
        for r in f.requires:
            need("fact", story.facts, r, f"fact {f.id}")
    for e in story.events.values():
        for p in e.participants:
            need("character", story.characters, p, f"event {e.id}")
        for who, learned in e.learns.items():
            need("character", story.characters, who, f"event {e.id}")
            for fact in learned:
                need("fact", story.facts, fact, f"event {e.id}")
        for cause in e.causes:
            need("event", story.events, cause, f"event {e.id}")
    for a in story.artifacts.values():
        need("event", story.events, a.origin, f"artifact {a.id}")
        need("character", story.characters, a.testimony_of, f"artifact {a.id}")
        need("character", story.characters, a.belongs_to, f"artifact {a.id}")
        for fact in a.reveals | a.surface:
            need("fact", story.facts, fact, f"artifact {a.id}")
    for w in story.wants.values():
        need("character", story.characters, w.target, f"want {w.id}")
    for s in story.scenes:
        for a in s.actions:
            need("want", story.wants, a.serves, f"scene {s.id}")
            for fact in a.needs_belief:
                need("fact", story.facts, fact, f"scene {s.id}")
        for art in s.artifacts:
            need("artifact", story.artifacts, art, f"scene {s.id}")
        for w in s.instills + s.resolves:
            need("want", story.wants, w, f"scene {s.id}")
        for c in s.contact + s.mentions:
            need("character", story.characters, c, f"scene {s.id}")
        if s.twist:
            need("fact", story.facts, s.twist.negates, f"scene {s.id}")
            need("artifact", story.artifacts, s.twist.via, f"scene {s.id}")
        if s.antagonist:
            need("character", story.characters, s.antagonist.character, f"scene {s.id}")
            need("fact", story.facts, s.antagonist.cause, f"scene {s.id}")
    for fact in story.ending.needs:
        need("fact", story.facts, fact, "ending")
    return out


# --- fabula ----------------------------------------------------------------------------


def knowledge(story: Story) -> dict[str, dict[str, int]]:
    """character id -> {fact id: time first learned}."""
    known: dict[str, dict[str, int]] = {c: {} for c in story.characters}
    for e in story.events_in_order():
        for who, facts in e.learns.items():
            for f in facts:
                known[who].setdefault(f, e.time)
    return known


def knows_at_death(story: Story, character: str, fact: str) -> bool:
    """True if the character learned ``fact`` before (or at) the event they died in.
    A living character knows everything they ever learned."""
    learned = knowledge(story)[character].get(fact)
    if learned is None:
        return False
    died = story.characters[character].died_at
    return died is None or learned <= story.events[died].time


def _check_fabula(story: Story) -> list[Finding]:
    out: list[Finding] = []
    for e in story.events_in_order():
        for cause in e.causes:
            if story.events[cause].time > e.time:
                out.append(
                    Finding("causality", Severity.ERROR, f"event {e.id}", f"caused by {cause!r}, which happens later")
                )
        for who in e.learns:
            if who not in e.participants:
                out.append(
                    Finding(
                        "causality",
                        Severity.WARNING,
                        f"event {e.id}",
                        f"{who!r} learns something here but is not a participant",
                    )
                )
    for c in story.characters.values():
        if c.died_at and c.id not in story.events[c.died_at].participants:
            out.append(
                Finding("causality", Severity.ERROR, f"character {c.id}", f"dies at {c.died_at!r} without being there")
            )
    return out


# --- artifacts -------------------------------------------------------------------------


def _check_artifacts(story: Story) -> list[Finding]:
    out: list[Finding] = []
    for a in story.artifacts.values():
        if a.origin is None and a.modality in (Modality.OBJECT, Modality.DOCUMENT):
            out.append(
                Finding("origin", Severity.WARNING, f"artifact {a.id}", "no fabula event explains why this exists")
            )
        if a.origin and a.belongs_to and a.belongs_to not in story.events[a.origin].participants:
            out.append(
                Finding(
                    "origin",
                    Severity.WARNING,
                    f"artifact {a.id}",
                    f"belongs to {a.belongs_to!r}, who was not at its origin event",
                )
            )
        if a.modality is Modality.TESTIMONY:
            if a.testimony_of is None:
                out.append(Finding("testimony", Severity.ERROR, f"artifact {a.id}", "testimony with no speaker"))
            else:
                for fact in sorted(a.reveals):
                    if not knows_at_death(story, a.testimony_of, fact):
                        out.append(
                            Finding(
                                "testimony",
                                Severity.ERROR,
                                f"artifact {a.id}",
                                f"{a.testimony_of!r} testifies to {fact!r} but never learned it while alive",
                            )
                        )
        elif a.testimony_of is not None:
            out.append(Finding("testimony", Severity.WARNING, f"artifact {a.id}", "has a speaker but is not testimony"))
    return out


# --- the participants as a character -------------------------------------------------------


def _walk_scenes(story: Story) -> list[Finding]:
    out: list[Finding] = []
    state = PlayerState()
    surfaced: set[str] = set()
    last = len(story.scenes) - 1
    for index, scene in enumerate(story.scenes):
        out += _scene(story, scene, index, state, surfaced)
        if index != last:
            if not state.open_wants:
                out.append(
                    Finding(
                        "goals",
                        Severity.WARNING,
                        scene.id,
                        "no open want after this scene: why would anyone keep going?",
                    )
                )
            elif len(state.open_wants) > MAX_OPEN_WANTS:
                out.append(
                    Finding(
                        "goals",
                        Severity.WARNING,
                        scene.id,
                        f"{len(state.open_wants)} open wants: the goal stack is too deep",
                    )
                )
    out += _check_ending(story, state, surfaced)
    return out


def _scene(story: Story, scene: Scene, index: int, st: PlayerState, surfaced: set[str]) -> list[Finding]:
    out: list[Finding] = []
    if not scene.actions and not scene.artifacts:
        out.append(Finding("scene", Severity.WARNING, scene.id, "nothing happens here"))

    # 1. Motivation: every action serves a want the participants already hold and
    #    rests on beliefs they already have.
    for action in scene.actions:
        if action.serves not in st.open_wants:
            why = "have already resolved" if _was_ever_instilled(story, action.serves, index) else "do not hold yet"
            out.append(
                Finding(
                    "motivation",
                    Severity.ERROR,
                    scene.id,
                    f"{action.text!r} serves {action.serves!r}, which the participants {why}",
                )
            )
        elif (
            story.wants[action.serves].kind in LOCAL_WANTS and index - st.open_wants[action.serves] > STALE_AFTER_SCENES
        ):
            # A spine want (understand the whole thing) may carry the evening. A local
            # want (find this, get out of here) should be acted on while it is fresh.
            newer = [w for w, i in st.open_wants.items() if i > st.open_wants[action.serves]]
            if newer:
                out.append(
                    Finding(
                        "motivation",
                        Severity.WARNING,
                        scene.id,
                        f"{action.text!r} is driven by {action.serves!r}, instilled "
                        f"{index - st.open_wants[action.serves]} scenes ago, while {newer} are more recent",
                    )
                )
        missing = action.needs_belief - st.believes
        if missing:
            out.append(
                Finding(
                    "motivation",
                    Severity.ERROR,
                    scene.id,
                    f"{action.text!r} needs the participants to believe {sorted(missing)}, and nothing has made them",
                )
            )

    worked = any(a.worked for a in scene.actions)

    # 2. Evidence surfacing: knowledge, belief, prerequisites, attachment through objects.
    for art_id in scene.artifacts:
        art = story.artifacts[art_id]
        if art_id in surfaced:
            out.append(Finding("evidence", Severity.WARNING, scene.id, f"{art_id!r} surfaces twice"))
        surfaced.add(art_id)
        for fact in sorted(art.reveals):
            # Making sense of a reveal needs belief, not certainty: a planted suspicion counts.
            missing = story.facts[fact].requires - st.believes - art.reveals
            if missing:
                out.append(
                    Finding(
                        "prerequisite",
                        Severity.ERROR,
                        scene.id,
                        f"{art_id!r} reveals {fact!r} before {sorted(missing)}, which it needs to make sense",
                    )
                )
        st.knows |= art.reveals
        st.believes |= art.reveals | art.surface
        if worked:
            st.earned |= art.reveals | art.surface
        if art.testimony_of:
            st.cares[art.testimony_of] += CONTACT_WEIGHT
            st.contacted.add(art.testimony_of)
        if art.belongs_to:
            st.cares[art.belongs_to] += BELONGING_WEIGHT

    for who in scene.contact:
        st.cares[who] += CONTACT_WEIGHT
        st.contacted.add(who)
    for who in scene.mentions:
        st.cares[who] += MENTION_WEIGHT

    # 3. Antagonist: the cause has to be on stage first.
    if scene.antagonist and scene.antagonist.cause not in st.knows:
        out.append(
            Finding(
                "antagonist",
                Severity.ERROR,
                scene.id,
                f"{scene.antagonist.character!r} acts ({scene.antagonist.text!r}) "
                f"for a reason ({scene.antagonist.cause!r}) the participants have not seen",
            )
        )

    # 4. Twist: there must be a belief to overturn, ideally one they earned.
    if scene.twist:
        tw = scene.twist
        if tw.via not in surfaced:
            out.append(
                Finding("twist", Severity.ERROR, scene.id, f"twist delivered by {tw.via!r}, which has not surfaced")
            )
        if tw.negates not in st.believes:
            out.append(
                Finding(
                    "twist",
                    Severity.ERROR,
                    scene.id,
                    f"twist negates {tw.negates!r}, but the participants never believed it: nothing to twist",
                )
            )
        elif tw.negates not in st.earned:
            out.append(
                Finding(
                    "twist",
                    Severity.WARNING,
                    scene.id,
                    f"twist negates {tw.negates!r}, a belief that was handed over, not worked for",
                )
            )
        if story.facts[tw.negates].true:
            out.append(
                Finding(
                    "twist", Severity.WARNING, scene.id, f"twist negates {tw.negates!r}, which the fabula marks true"
                )
            )
        st.believes.discard(tw.negates)

    # 5. Wants: resolve, then instill; attachment check for SAVE / RECONCILE.
    for w in scene.resolves:
        if w not in st.open_wants:
            out.append(Finding("goals", Severity.WARNING, scene.id, f"resolves {w!r}, which was not open"))
        st.open_wants.pop(w, None)
    for w in scene.instills:
        want = story.wants[w]
        if w in st.open_wants:
            out.append(Finding("goals", Severity.WARNING, scene.id, f"instills {w!r} again"))
        st.open_wants[w] = index
        if want.kind in (WantKind.SAVE, WantKind.RECONCILE) and want.target:
            if want.target not in st.contacted:
                out.append(
                    Finding(
                        "attachment",
                        Severity.ERROR,
                        scene.id,
                        f"{w!r} asks the participants to {want.kind} {want.target!r}, "
                        f"whom they have never met (attachment {st.cares[want.target]}): payoff aimed at a stranger",
                    )
                )
            elif st.cares[want.target] < ATTACHMENT_THRESHOLD:
                out.append(
                    Finding(
                        "attachment",
                        Severity.WARNING,
                        scene.id,
                        f"{w!r} targets {want.target!r} with attachment {st.cares[want.target]} "
                        f"(threshold {ATTACHMENT_THRESHOLD})",
                    )
                )
    return out


def _was_ever_instilled(story: Story, want: str, before: int) -> bool:
    return any(want in s.instills for s in story.scenes[:before])


def _check_ending(story: Story, st: PlayerState, surfaced: set[str]) -> list[Finding]:
    out: list[Finding] = []
    missing = story.ending.needs - st.knows
    if missing:
        out.append(
            Finding("ending", Severity.ERROR, "ending", f"the ending needs {sorted(missing)}, which are never revealed")
        )
    for w, i in st.open_wants.items():
        out.append(
            Finding(
                "goals",
                Severity.WARNING,
                "ending",
                f"{w!r} (instilled in scene {story.scenes[i].id}) is never resolved",
            )
        )
    for a in story.artifacts:
        if a not in surfaced:
            out.append(Finding("evidence", Severity.WARNING, "ending", f"{a!r} is defined but never surfaces"))
    return out


# --- open items ------------------------------------------------------------------------


def _check_open(story: Story) -> list[Finding]:
    out: list[Finding] = []
    pools = (
        ("character", story.characters.values()),
        ("fact", story.facts.values()),
        ("event", story.events.values()),
        ("artifact", story.artifacts.values()),
        ("want", story.wants.values()),
    )
    for kind, items in pools:
        for item in items:
            if item.status is Status.OPEN:
                out.append(
                    Finding(
                        "open", Severity.OPEN, f"{kind} {item.id}", item.text if hasattr(item, "text") else item.name
                    )
                )
    for s in story.scenes:
        if s.status is Status.OPEN:
            out.append(Finding("open", Severity.OPEN, s.id, s.title))
        for a in s.actions:
            if a.status is Status.OPEN:
                out.append(Finding("open", Severity.OPEN, s.id, a.text))
        if s.twist and s.twist.status is Status.OPEN:
            out.append(Finding("open", Severity.OPEN, s.id, f"twist via {s.twist.via}"))
    if story.ending.status is Status.OPEN:
        out.append(Finding("open", Severity.OPEN, "ending", story.ending.text))
    return out
