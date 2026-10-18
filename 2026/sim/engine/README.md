# Halloween 2026 text simulation

A runnable model of the hub-and-spoke game from the 2026-10-07 design handoff. Python 3 standard library only. Four files: `config.py` (every tunable, with the basis of each estimate), `engine.py` (rules), `sim.py` (interfaces), `test_engine.py` (tests). Where the handoff gives no rule, the engine raises `Undefined("<question>")` and the run ends; it never fills the gap.

## Run

```
cd /media/griswald/wd-black-2tb/personal/firstmate/data/hw-sim-engine
python3 sim.py config                       # every constant with its comment
python3 sim.py questions                    # every rule gap the engine can raise
python3 sim.py bot [--variant V] [--seed N] [--finale none|floated] [--set K=V ...] [--quiet]
python3 sim.py play [same options]          # one human drives all four players
python3 sim.py protocol [same options]      # JSON lines in, JSON lines out, for agent players
python3 -m unittest test_engine
```

Variants: `resurrection` (default), `rage`, `loop`, `rescue`, one per handoff section 13 direction. `--finale floated` loads the four prop concepts of handoff section 10 as abstract steps; `none` (default) loads nothing, because the handoff specifies no finale puzzle. `--set NAME=VALUE` overrides any constant, e.g. `--set GROUP_MOVES_TOGETHER=False --set HINT_MAX=0`.

## Model

- Clock: real seconds. Each player has their own clock. Only the player with the lowest clock may act (ties: table order), so causality holds. Joint actions start when the last participant is free and pull everyone forward together.
- Rooms: `seance` (hub) and `deliverance`, `waitstill`, `mindwell`, `remember` (spokes). A spoke connects only through the hub.
- Players are named for their child and bound to its faculty: deliverance/hands, waitstill/eyes, mindwell/ears, remember/voice. Everyone starts with all four faculties; the curse removes the bound one.
- Each spoke is a sequence of steps. A step has a clue modality (how it is perceived), the faculties needed to act on it, and a hidden required effort (base seconds times a per-run jitter). Effort is wall time with someone capable on the step; two people on it at once do not double it. Finishing a spoke yields its relic and two reveals (role, fate).
- Hints: after `HINT_AFTER_SECONDS` of effort on a step since the last hint, the medium offers one; it costs `HINT_SECONDS` and removes `HINT_FRACTION` of the remaining effort. Hints are spoken: nobody who can hear in the room means no effect.
- The table: `place` a relic in the hub. The fourth relic triggers the turn: reveal beat, fire soundtrack starts (`FIRE_TIMER_SECONDS`), then the medium invokes each player by child name in `INVOCATION_ORDER` and each applies their own curse.
- Information: a player observes only through uncursed faculties. Blind: no `sees`. Muffled: no `hears` (misses hints, relays, the objective). Silenced: cannot relay or confer. Gloved: cannot supply hands.
- A blindfolded player may not `go` anywhere (handoff section 8 safety note). With `GROUP_MOVES_TOGETHER` that pins the whole group.

## Actions

Text form (`play`) and JSON form (`protocol`), same vocabulary.

| text | JSON | cost | what |
|---|---|---|---|
| `go <room>` | `{"action":"go","to":"mindwell"}` | `TRAVEL_SECONDS` (double for spoke to spoke) | walk; moves everyone in the room when `GROUP_MOVES_TOGETHER` |
| `examine` | `{"action":"examine"}` | `STEP_EXAMINE_SECONDS` | take in the current step's clue, if you have its modality |
| `work` | `{"action":"work"}` | `STEP_WORK_CHUNK_SECONDS` | one chunk of effort; needs a present knower set that covers the step's faculties |
| `hint` | `{"action":"hint"}` | `HINT_SECONDS` | ask the medium; only once the step has stalled |
| `relay <player>` | `{"action":"relay","to":"remember"}` | `RELAY_SECONDS` | tell one player what you know (everyone hearing in the room learns it too) |
| `confer` | `{"action":"confer"}` | `CONFER_SECONDS` | everyone present pools what the speakers know |
| `place` | `{"action":"place"}` | `PLACE_RELIC_SECONDS` | set the relic you hold on the table (hub only) |
| `curse` | `{"action":"curse"}` | `CURSE_APPLY_SECONDS` | apply your own curse when the spirit calls you |
| `wait` | `{"action":"wait"}` | 0, or until someone else is free, or `WAIT_SECONDS` | idle |
| `look` | `{"action":"observe"}` | 0 | re-emit observations |

## Protocol

Each stdin line is one action with a player id: `{"player":"waitstill","action":"go","to":"waitstill"}`. The engine prints the initial state, then one JSON line per input:

```
{"ok": true|false, "error": "...", "next": "<player who acts next>",
 "obs": {"deliverance": {...}, "waitstill": {...}, "mindwell": {...}, "remember": {...}},
 "over": {...}, "summary": {...}}          # over and summary only when the run has ended
```

An observation: `player, bound, t, clock, room, faculties, curse, holding, knows, phase, your_turn, sees, hears, notices, can, fire_remaining`. `sees` is the room as this player sees it right now (empty if blind). `hears` and `notices` are new since this player's last observation. `can` lists legal actions for the player whose turn it is and is empty otherwise. Acting out of turn is refused without cost; the error names who acts next. An agent player should read only its own entry in `obs`.

Run ends: `over.result` is `lost` (fire timer), `undefined` (the rules ran out; `over.why` carries the question), or `won` (no variant currently defines one). `summary` has total time, time per stage, hints, the curse state at each finale step, and the undefined rules hit.

## Bot

`bot` plays one plausible run: the group visits the children's rooms in table order, the player bound to the room's child leads its puzzle and takes a hint as soon as the medium offers one, relics go straight to the table, everyone obeys the invocation, and in the finale the party works the loaded finale steps in order, relaying when the holder cannot act. With `GROUP_MOVES_TOGETHER=False` each player takes their own child's room alone. The transcript prints the acting player's clock after each action and what that player heard and noticed; `wait` lines are omitted.
