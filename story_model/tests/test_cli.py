from __future__ import annotations

import pytest

from story_model import check
from story_model.__main__ import load_story, main, render

from .conftest import clean_story


def test_load_story_default_attr():
    story = load_story("story_model.fixtures.ashby")
    assert story.title.startswith("Ashby")


def test_load_story_explicit_attr():
    assert load_story("story_model.fixtures.ashby:STORY").title.startswith("Ashby")


def test_load_story_rejects_non_story():
    with pytest.raises(TypeError):
        load_story("story_model.fixtures.ashby:FACTS")


def test_render_clean_story_says_clean():
    story = clean_story()
    text = render(story, check(story), show_open=False)
    assert "0 error, 0 warning, 0 open" in text
    assert "ERROR" not in text


def test_render_groups_by_severity():
    story = load_story("story_model.fixtures.ashby")
    text = render(story, check(story), show_open=True)
    assert text.index("ERROR (") < text.index("WARNING (") < text.index("OPEN (")


def test_render_hides_open_by_default():
    story = load_story("story_model.fixtures.ashby")
    assert "OPEN (" not in render(story, check(story), show_open=False)


def test_main_exit_status_reflects_errors(capsys):
    assert main(["story_model.fixtures.ashby"]) == 1
    assert "attachment" in capsys.readouterr().out


def test_main_clean_story_exits_zero(capsys, monkeypatch):
    import sys
    import types

    mod = types.ModuleType("clean_fixture")
    mod.STORY = clean_story()
    monkeypatch.setitem(sys.modules, "clean_fixture", mod)
    assert main(["clean_fixture"]) == 0
