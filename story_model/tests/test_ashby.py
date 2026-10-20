"""The Ashby fixture is a regression test for the design record: the checker must find
exactly the problems the record itself left open, and nothing the record settled."""

from __future__ import annotations

from story_model import Severity, check, errors
from story_model.fixtures.ashby import STORY


def test_ashby_builds_and_has_nine_scenes():
    assert len(STORY.scenes) == 9
    assert [s.id for s in STORY.scenes] == [f"s{i}" for i in range(1, 10)]


def test_ashby_errors_are_the_two_known_ones():
    found = {(f.rule, f.where) for f in errors(check(STORY))}
    assert found == {
        # Captain, 2026-10-17: Mindwell's contribution to the letter "SKIPPED"; nothing in
        # the fabula gives her the hint she testifies to.
        ("testimony", "artifact mindwell_listening"),
        # The decoded letter asks the participants to reconcile Constance with Josiah,
        # whom they never meet. Same bug as the burned-ghost-dad draft, politer clothes.
        ("attachment", "s9"),
    }


def test_ashby_warnings_are_the_record_s_own_gaps():
    found = {(f.rule, f.where) for f in check(STORY) if f.severity is Severity.WARNING}
    assert found == {
        ("origin", "artifact chest_map"),  # record 2.3: "why the chest stores a map" is a listed gap
        ("goals", "ending"),  # the reconciliation is left open, so it never resolves
    }


def test_ashby_open_items_match_the_record():
    opens = {f.where for f in check(STORY) if f.severity is Severity.OPEN}
    assert {
        "fact letter_hint",
        "event constance_dies",
        "artifact locket",
        "artifact chest_map",
        "artifact remember_cipher",
        "artifact wilkes_cup",
        "want reconcile",
        "ending",
    } <= opens


def test_constance_never_learns_her_children_s_fates():
    """Captain's ruling: she must die without knowing. The fabula must not leak it to her."""
    from story_model.checker import knowledge

    known = knowledge(STORY)["constance"]
    assert not {"waitstill_dead", "deliverance_dead", "mindwell_dead", "remember_dead"} & known.keys()


def test_every_ghost_only_says_what_it_knew():
    from story_model.checker import knows_at_death
    from story_model.model import Modality

    for art in STORY.artifacts.values():
        if art.modality is Modality.TESTIMONY and art.id != "mindwell_listening":
            for fact in art.reveals:
                assert knows_at_death(STORY, art.testimony_of, fact), (art.id, fact)
