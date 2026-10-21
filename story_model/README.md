# story_model

A typed world model for story-driven escape rooms, and a checker that tells you
when the story you wrote cannot play.

`2026/sim/engine` models the **mechanics** of a game: clocks, rooms, faculties,
hints. Nothing in the repo modelled the **story**: what actually happened, what each
ghost could know, what the participants have been given a reason to do, and whom
they have been given a reason to care about. That is the layer that quietly broke
every time an LLM (or a tired human) drafted the next scene, and the layer you had
to hold in your head to steer it. The Ashby design record even names the principle
(§2.5: "track separately what happened, what each character knows, and what the
participants have discovered") and then notes that no tool was adopted. This is
that tool.

The arrangement is the usual one: the model proposes, the checker disposes. Write
the story as data, run `check`, read the findings, fix the story. An LLM can
propose edits to the data; it cannot talk its way past the checker.

## The four layers

| Layer | Types | What it holds |
| --- | --- | --- |
| **Fabula** (what happened) | `Character`, `Event`, `Fact` | Timestamped events, who was there, what each character learned, who died when. |
| **Evidence** (what is in the room) | `Artifact` | Objects, documents, environment, and ghost **testimony**. Each points at the facts it reveals, the facts its surface merely *suggests*, and the fabula event that explains why it exists. |
| **Syuzhet** (the order met) | `Scene`, `Action`, `Want`, `Twist`, `AntagonistAct`, `Ending` | Which artifacts surface, which wants are instilled and resolved, what the participants do and which want each action serves. |
| **The participants** (derived) | `PlayerState` | What they know, what they merely believe, which beliefs they *earned* through a worked puzzle, whom they have met, whom they care about. |

Everything the source design leaves undecided is marked `Status.OPEN` rather than
guessed. The checker lists Open items separately; they are not defects.

## The rules

| Rule | Catches |
| --- | --- |
| `references` | Dangling ids. Short-circuits the rest. |
| `causality` | Effect before cause; a character dying at an event they were not at. |
| `origin` | An object or document with no fabula event behind it. |
| `testimony` | A ghost saying something it never learned while alive. |
| `motivation` | An action that serves no want the participants hold, or rests on a belief nothing planted. A local want (find, escape, save) acted on long after it was instilled while fresher wants sit open. |
| `prerequisite` | A fact revealed before the facts needed to make sense of it. |
| `attachment` | A SAVE or RECONCILE want aimed at a character the participants have never met (error) or barely met (warning). |
| `twist` | A reversal with nothing to reverse; a reversal of a belief that was handed over rather than worked for; a reversal delivered by an artifact nobody has seen. |
| `antagonist` | A character turning on the participants for a reason not yet on stage. |
| `goals` | An empty goal stack mid-game, a stack deeper than three, wants never resolved. |
| `ending` | An ending that needs facts never revealed. |
| `open` | The design's own open questions, collected. |

The weights and thresholds (`CONTACT_WEIGHT`, `ATTACHMENT_THRESHOLD`, ...) are
module constants in `checker.py`; they are opinions, and the tests document them.

## Run

```
cd story_model
pixi install
pixi run test          # 57 tests, 99% coverage
pixi run lint
pixi run check         # the Ashby fixture; exit 1 because it has errors
pixi run check-all     # also list the record's Open items
python -m story_model my_stories.next_year:STORY
```

## What it says about Ashby

The fixture `story_model/fixtures/ashby.py` is the design record of 2026-10-17 as
data. The checker's verdict, which `tests/test_ashby.py` pins:

- **error / testimony:** Mindwell "moves the letter forward one step", but nothing
  in the fabula gives her anything to move it with. That is Q2/Q3, which the
  captain skipped on 2026-10-17.
- **error / attachment:** the decoded letter asks the participants to reconcile
  Constance with Josiah, who is mentioned in two scenes and never heard from. The
  emotional payoff of the whole evening is aimed at a stranger. (Same bug as the
  earlier "burn ghost dad" draft, wearing a waistcoat.)
- **warning / origin:** the chest has no reason to exist. The record lists "why the
  chest stores a map" as a gap not to be filled by assumption; the checker agrees.
- **warning / goals:** the reconciliation never resolves, because the ending is Open.

Ten Open items, all of them the record's own.

## Writing a story

Start from `tests/conftest.py::clean_story`, a two-scene story that passes every
rule, or from the Ashby fixture. Rules of thumb the checker enforces:

- Every artifact needs a reason to exist in the past, not only a use in the present.
- A ghost's `learns` must happen at or before its `died_at` event.
- An action's `serves` must name a want instilled in an *earlier* scene; actions are
  checked against the state at the start of the scene.
- Beliefs planted by an artifact count as **earned** when the scene that surfaces it
  contains a `worked=True` action. Twists should land on earned beliefs.
- If you want the participants to save or reconcile someone, let them hear that
  person's voice first.

## Next

The checker verifies; it does not search. The obvious extension is a solver that,
given the fabula and the physical affordances (a cup that hears walls, a lantern
that can only flash), finds a reveal order satisfying every rule, or proves there
is none. Answer Set Programming (clingo) is the natural fit; the predicates here
(`knows`, `believes`, `cares`, `wants`) translate directly. That is a separate
component so this one stays stdlib-only.
