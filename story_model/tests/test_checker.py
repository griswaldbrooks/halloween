"""One test per rule: the clean story passes, and exactly the intended break trips it."""

from __future__ import annotations

from dataclasses import replace

import pytest

from story_model import (
    Action,
    AntagonistAct,
    Artifact,
    Ending,
    Event,
    Fact,
    Modality,
    Scene,
    Severity,
    Status,
    Twist,
    Want,
    WantKind,
    check,
    errors,
)
from story_model.checker import knowledge, knows_at_death

from .conftest import clean_story, fs, with_scene


def rules(findings, severity: Severity | None = None) -> set[str]:
    return {f.rule for f in findings if severity is None or f.severity is severity}


def test_clean_story_has_no_errors_or_warnings(clean):
    findings = check(clean)
    assert findings == [], [str(f) for f in findings]


# --- references ---------------------------------------------------------------------------


def test_dangling_reference_is_an_error_and_short_circuits(clean):
    story = with_scene(clean, 1, artifacts=("ledger", "no_such_thing"))
    findings = check(story)
    assert rules(findings) == {"references"}
    assert all(f.severity is Severity.ERROR for f in findings)


def test_duplicate_ids_are_refused():
    with pytest.raises(ValueError, match="duplicate"):
        clean_story(facts=[Fact("x", "a"), Fact("x", "b")])


# --- fabula --------------------------------------------------------------------------------


def test_knowledge_is_first_learned_time(clean):
    known = knowledge(clean)
    assert known["eleanor"] == {"ledger_hidden": 1, "fraud": 1, "eleanor_dead": 2}
    assert known["cousin"] == {}


def test_knows_at_death_rejects_posthumous_learning(clean):
    events = list(clean.events.values()) + [
        Event("later", 3, "Something after her death.", fs({"eleanor"}), learns={"eleanor": fs({"late_fact"})})
    ]
    facts = list(clean.facts.values()) + [Fact("late_fact", "Learned after dying.")]
    story = replace(clean, events={e.id: e for e in events}, facts={f.id: f for f in facts})
    assert knows_at_death(story, "eleanor", "ledger_hidden")
    assert not knows_at_death(story, "eleanor", "late_fact")
    assert not knows_at_death(story, "cousin", "fraud")


def test_living_character_knows_everything_learned(clean):
    events = list(clean.events.values()) + [
        Event(
            "confession",
            9,
            "The cousin learns of the ledger.",
            fs({"cousin"}),
            learns={"cousin": fs({"ledger_hidden"})},
        )
    ]
    story = replace(clean, events={e.id: e for e in events})
    assert knows_at_death(story, "cousin", "ledger_hidden")


def test_effect_before_cause_is_an_error(clean):
    events = {k: v for k, v in clean.events.items()}
    events["hides"] = replace(events["hides"], causes=fs({"eleanor_dies"}))
    findings = check(replace(clean, events=events))
    assert "causality" in rules(findings, Severity.ERROR)


def test_dying_elsewhere_is_an_error(clean):
    events = {k: v for k, v in clean.events.items()}
    events["eleanor_dies"] = replace(events["eleanor_dies"], participants=fs())
    findings = check(replace(clean, events=events))
    assert any(f.rule == "causality" and "without being there" in f.message for f in findings)


def test_learning_while_absent_is_a_warning(clean):
    events = {k: v for k, v in clean.events.items()}
    events["hides"] = replace(events["hides"], participants=fs())
    findings = check(replace(clean, events=events))
    assert any(f.rule == "causality" and f.severity is Severity.WARNING for f in findings)


# --- artifacts -----------------------------------------------------------------------------


def test_object_without_origin_is_a_warning(clean):
    arts = {k: v for k, v in clean.artifacts.items()}
    arts["ledger"] = replace(arts["ledger"], origin=None)
    findings = check(replace(clean, artifacts=arts))
    assert "origin" in rules(findings, Severity.WARNING)


def test_environment_needs_no_origin(clean):
    arts = {k: v for k, v in clean.artifacts.items()}
    arts["ledger"] = replace(arts["ledger"], origin=None, modality=Modality.ENVIRONMENT)
    assert "origin" not in rules(check(replace(clean, artifacts=arts)))


def test_belonging_without_presence_is_a_warning(clean):
    arts = {k: v for k, v in clean.artifacts.items()}
    arts["ledger"] = replace(arts["ledger"], belongs_to="cousin")
    findings = check(replace(clean, artifacts=arts))
    assert any(f.rule == "origin" and "not at its origin event" in f.message for f in findings)


def test_ghost_cannot_testify_to_what_it_never_knew(clean):
    """The ghost-dad bug: Eleanor's voice reveals a fact she never learned."""
    facts = list(clean.facts.values()) + [Fact("secret", "A thing nobody told her.")]
    arts = {k: v for k, v in clean.artifacts.items()}
    arts["voice"] = replace(arts["voice"], reveals=fs({"ledger_hidden", "secret"}))
    findings = check(replace(clean, facts={f.id: f for f in facts}, artifacts=arts))
    assert [f for f in errors(findings) if f.rule == "testimony" and "'secret'" in f.message]


def test_testimony_needs_a_speaker(clean):
    arts = {k: v for k, v in clean.artifacts.items()}
    arts["voice"] = replace(arts["voice"], testimony_of=None)
    findings = check(replace(clean, artifacts=arts))
    assert any(f.rule == "testimony" and "no speaker" in f.message for f in findings)


# --- motivation ----------------------------------------------------------------------------


def test_action_without_a_held_want_is_an_error(clean):
    """Why would we go over here and look for a satchel under a rock?"""
    story = with_scene(clean, 0, instills=("why",))  # find_ledger never instilled
    findings = check(story)
    assert any(f.rule == "motivation" and "do not hold yet" in f.message for f in findings)


def test_action_on_resolved_want_is_an_error(clean):
    scenes = (
        Scene("s0", "Prologue", contact=("eleanor",), instills=("find_ledger", "why")),
        Scene("s1", "Contact", artifacts=("voice",), resolves=("find_ledger",)),
        clean.scenes[1],
    )
    findings = check(replace(clean, scenes=scenes))
    assert any(f.rule == "motivation" and "already resolved" in f.message for f in findings)


def test_action_needing_an_unplanted_belief_is_an_error(clean):
    arts = {k: v for k, v in clean.artifacts.items()}
    arts["voice"] = replace(arts["voice"], reveals=fs())  # she never says where it is
    findings = check(replace(clean, artifacts=arts))
    assert any(f.rule == "motivation" and "nothing has made them" in f.message for f in findings)


def test_stale_local_want_is_a_warning():
    """A FIND want acted on three scenes after it was instilled, with newer wants open."""
    story = clean_story(
        wants=[
            Want("find_ledger", "Find it.", WantKind.FIND),
            Want("why", "Why.", WantKind.UNDERSTAND),
            Want("w2", "Newer.", WantKind.UNDERSTAND),
            Want("w3", "Newest.", WantKind.UNDERSTAND),
        ],
        scenes=[
            Scene("s1", "Contact", artifacts=("voice",), instills=("find_ledger", "why")),
            Scene("s2", "Filler", actions=(Action("chat", serves="why"),), instills=("w2",)),
            Scene("s3", "Filler", actions=(Action("chat", serves="why"),), instills=("w3",)),
            Scene("s4", "Filler", actions=(Action("chat", serves="why"),)),
            Scene(
                "s5",
                "The wall",
                actions=(
                    Action("search the wall", serves="find_ledger", needs_belief=fs({"ledger_hidden"}), worked=True),
                ),
                artifacts=("ledger",),
                resolves=("find_ledger", "why", "w2", "w3"),
            ),
        ],
    )
    findings = check(story)
    stale = [f for f in findings if f.rule == "motivation" and f.severity is Severity.WARNING]
    assert len(stale) == 1 and stale[0].where == "s5"
    # A spine want is allowed to carry the evening: the 'chat' actions on 'why' did not warn.


# --- evidence ------------------------------------------------------------------------------


def test_reveal_before_prerequisite_is_an_error(clean):
    arts = {k: v for k, v in clean.artifacts.items()}
    arts["voice"] = replace(arts["voice"], reveals=fs({"fraud"}))  # fraud requires ledger_hidden
    findings = check(replace(clean, artifacts=arts))
    assert "prerequisite" in rules(findings, Severity.ERROR)


def test_prerequisite_satisfied_by_belief_not_only_knowledge(clean):
    """A planted suspicion is enough to make a later reveal land."""
    arts = {k: v for k, v in clean.artifacts.items()}
    arts["voice"] = replace(arts["voice"], reveals=fs(), surface=fs({"ledger_hidden"}))
    findings = check(replace(clean, artifacts=arts))
    assert "prerequisite" not in rules(findings)


def test_artifact_surfacing_twice_is_a_warning(clean):
    story = with_scene(clean, 1, artifacts=("ledger", "voice"))
    assert any(f.rule == "evidence" and "twice" in f.message for f in check(story))


def test_unused_artifact_is_a_warning(clean):
    arts = {k: v for k, v in clean.artifacts.items()}
    arts["spare"] = Artifact("spare", "Never seen.", Modality.ENVIRONMENT)
    assert any(f.rule == "evidence" and "never surfaces" in f.message for f in check(replace(clean, artifacts=arts)))


# --- attachment ----------------------------------------------------------------------------


def _with_save_want(story, *, target: str, scene_index: int):
    wants = {k: v for k, v in story.wants.items()}
    wants["save"] = Want("save", f"Save {target}.", WantKind.SAVE, target=target)
    scenes = list(story.scenes)
    scenes[scene_index] = replace(
        scenes[scene_index],
        instills=scenes[scene_index].instills + ("save",),
        resolves=scenes[scene_index].resolves + ("save",),
    )
    return replace(story, wants=wants, scenes=tuple(scenes))


def test_save_want_for_a_stranger_is_an_error(clean):
    """Ghost dad: asked to save someone they have never met."""
    findings = check(_with_save_want(clean, target="cousin", scene_index=1))
    assert any(f.rule == "attachment" and f.severity is Severity.ERROR and "stranger" in f.message for f in findings)


def test_save_want_with_thin_contact_is_a_warning(clean):
    """Met once in the same scene the want lands: contact counts, but attachment is thin."""
    story = _with_save_want(clean, target="cousin", scene_index=1)
    story = with_scene(story, 1, contact=("cousin",))
    findings = check(story)
    att = [f for f in findings if f.rule == "attachment"]
    assert att and att[0].severity is Severity.WARNING


def test_save_want_after_real_contact_passes(clean):
    """Eleanor's own voice (3) plus her ledger (1) clears the threshold."""
    findings = check(_with_save_want(clean, target="eleanor", scene_index=1))
    assert "attachment" not in rules(findings)


# --- twist ---------------------------------------------------------------------------------


def _twisted(clean, *, planted_how: str):
    facts = list(clean.facts.values()) + [Fact("villain", "Eleanor was the thief.", true=False)]
    arts = {k: v for k, v in clean.artifacts.items()}
    match planted_how:
        case "worked":
            arts["ledger"] = replace(arts["ledger"], surface=fs({"villain"}))  # s2 has a worked action
        case "handed":
            arts["voice"] = replace(arts["voice"], surface=fs({"villain"}))  # s1 has no worked action
        case "never":
            pass
    arts["truth"] = Artifact("truth", "The cousin's confession.", Modality.DOCUMENT, origin="hides", reveals=fs())
    scenes = clean.scenes + (
        Scene(
            "s3",
            "Reversal",
            artifacts=("truth",),
            twist=Twist(negates="villain", via="truth"),
            actions=(Action("read it", serves="why"),),
        ),
    )
    scenes = (scenes[0], replace(scenes[1], resolves=("find_ledger",)), replace(scenes[2], resolves=("why",)))
    return replace(clean, facts={f.id: f for f in facts}, artifacts=arts, scenes=scenes)


def test_twist_with_nothing_to_twist_is_an_error(clean):
    findings = check(_twisted(clean, planted_how="never"))
    assert any(f.rule == "twist" and f.severity is Severity.ERROR and "nothing to twist" in f.message for f in findings)


def test_twist_on_handed_belief_is_a_warning(clean):
    findings = check(_twisted(clean, planted_how="handed"))
    tw = [f for f in findings if f.rule == "twist"]
    assert tw and tw[0].severity is Severity.WARNING and "handed" in tw[0].message


def test_twist_on_earned_belief_passes(clean):
    assert "twist" not in rules(check(_twisted(clean, planted_how="worked")))


def test_twist_via_unseen_artifact_is_an_error(clean):
    story = _twisted(clean, planted_how="worked")
    story = with_scene(story, 2, artifacts=())
    assert any(f.rule == "twist" and "has not surfaced" in f.message for f in check(story))


def test_twist_negating_a_true_fact_is_a_warning(clean):
    story = _twisted(clean, planted_how="worked")
    facts = {k: v for k, v in story.facts.items()}
    facts["villain"] = replace(facts["villain"], true=True)
    assert any(f.rule == "twist" and "marks true" in f.message for f in check(replace(story, facts=facts)))


# --- antagonist ----------------------------------------------------------------------------


def test_antagonist_without_a_seen_cause_is_an_error(clean):
    story = with_scene(clean, 0, antagonist=AntagonistAct("eleanor", "rages", cause="fraud"))
    assert any(f.rule == "antagonist" and f.severity is Severity.ERROR for f in check(story))


def test_antagonist_with_a_seen_cause_passes(clean):
    story = with_scene(clean, 1, antagonist=AntagonistAct("eleanor", "rages", cause="fraud"))
    assert "antagonist" not in rules(check(story))


# --- goals and ending ----------------------------------------------------------------------


def test_empty_goal_stack_mid_story_is_a_warning(clean):
    scenes = (replace(clean.scenes[0], instills=()),) + clean.scenes[1:]
    findings = check(replace(clean, scenes=scenes))
    assert any(f.rule == "goals" and "no open want" in f.message for f in findings)


def test_deep_goal_stack_is_a_warning(clean):
    wants = {k: v for k, v in clean.wants.items()}
    for i in range(3):
        wants[f"w{i}"] = Want(f"w{i}", "Extra.", WantKind.UNDERSTAND)
    story = with_scene(replace(clean, wants=wants), 0, instills=("find_ledger", "why", "w0", "w1", "w2"))
    story = with_scene(story, 1, resolves=("find_ledger", "why", "w0", "w1", "w2"))
    assert any(f.rule == "goals" and "too deep" in f.message for f in check(story))


def test_unresolved_want_at_end_is_a_warning(clean):
    story = with_scene(clean, 1, resolves=("find_ledger",))
    assert any(f.rule == "goals" and "never resolved" in f.message for f in check(story))


def test_resolving_a_want_never_held_is_a_warning(clean):
    story = with_scene(clean, 0, resolves=("why",))
    assert any(f.rule == "goals" and "was not open" in f.message for f in check(story))


def test_ending_needing_unrevealed_fact_is_an_error(clean):
    story = replace(clean, ending=Ending("x", needs=fs({"eleanor_dead"})))
    assert any(f.rule == "ending" and f.severity is Severity.ERROR for f in check(story))


def test_empty_scene_is_a_warning(clean):
    scenes = clean.scenes + (Scene("s3", "Nothing", resolves=()),)
    story = replace(clean, scenes=scenes)
    assert any(f.rule == "scene" for f in check(story))


# --- open items ----------------------------------------------------------------------------


def test_open_status_is_reported_not_counted_as_error(clean):
    facts = {k: v for k, v in clean.facts.items()}
    facts["fraud"] = replace(facts["fraud"], status=Status.OPEN)
    story = with_scene(replace(clean, facts=facts), 1, status=Status.OPEN)
    findings = check(story)
    assert rules(findings) == {"open"}
    assert errors(findings) == []
    assert {f.where for f in findings} == {"fact fraud", "s2"}


def test_finding_str_is_one_line(clean):
    story = with_scene(clean, 0, instills=("why",))
    line = str(errors(check(story))[0])
    assert line.startswith("ERROR") and "\n" not in line


def test_speaker_on_non_testimony_is_a_warning(clean):
    arts = {k: v for k, v in clean.artifacts.items()}
    arts["ledger"] = replace(arts["ledger"], testimony_of="eleanor")
    assert any(f.rule == "testimony" and "not testimony" in f.message for f in check(replace(clean, artifacts=arts)))


def test_instilling_an_open_want_again_is_a_warning(clean):
    story = with_scene(clean, 1, instills=("why",), resolves=("find_ledger",))
    assert any(f.rule == "goals" and "again" in f.message for f in check(story))


def test_open_actions_twists_and_ending_are_reported(clean):
    from dataclasses import replace as r

    story = _twisted(clean, planted_how="worked")
    s3 = story.scenes[2]
    s3 = r(s3, actions=(r(s3.actions[0], status=Status.OPEN),), twist=r(s3.twist, status=Status.OPEN))
    story = r(story, scenes=story.scenes[:2] + (s3,), ending=r(story.ending, status=Status.OPEN))
    opens = [f for f in check(story) if f.severity is Severity.OPEN]
    assert {f.message for f in opens} >= {"read it", "twist via truth", "The fraud is known."}
